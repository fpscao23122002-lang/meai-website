# Tài khoản Google & gói cước MeAI

Website và app MeAI Desktop dùng **chung một tài khoản Google**. Tài khoản giữ toàn bộ dữ liệu của người dùng:
gói đang dùng, hạn dùng, số máy, danh sách máy tính và lịch sử đơn hàng. Mua gói trên web hay trong app đều cộng
vào cùng tài khoản. App chỉ cần đăng nhập Google rồi hỏi API là biết đúng gói để áp dụng.

```
Trình duyệt ──(Google ID token)──► /api/auth/google ─┐
App desktop ──(mã liên kết / ID token)──► /api/app/* ─┼─► Cloudflare Pages Functions ──► D1 (users, subscriptions, devices, orders)
Ngân hàng (SePay/Casso) ──► /api/payments/webhook ───┘
```

Mã nguồn:

| Phần | Vị trí |
|---|---|
| API | `server/router.ts`, mount tại `functions/api/[[route]].ts` |
| Dữ liệu | `server/store.ts`, `migrations/0001_accounts.sql` |
| Xác minh Google ID token | `server/google.ts` |
| Quy tắc gói (giá, số ngày, số máy) | `shared/plans.ts`, dùng chung cho web và API |
| Giao diện | `src/components/dashboard/DashboardApp.tsx`, `src/pages/AppConnectPage.tsx` |
| Kiểm thử | `npm run test:api` |

Khi chưa cấu hình (chưa có D1 hoặc `GOOGLE_CLIENT_ID`), website vẫn chạy bình thường. Khu vực khách hàng tự chuyển
sang **chế độ xem thử**: dữ liệu mô phỏng, lưu trên trình duyệt.

---

## 1. Bật hệ thống tài khoản (làm một lần)

### 1.1. Tạo Google OAuth Client ID

1. Vào [Google Cloud Console](https://console.cloud.google.com/), chọn **APIs & Services**.
2. Mở **OAuth consent screen**:
   - User type: **External**.
   - Điền tên app "MeAI Studio", email hỗ trợ và logo.
   - **Privacy policy**: `https://meai.vn/bao-mat`; **Terms of service**: `https://meai.vn/dieu-khoan` (website đã có sẵn hai trang này).
   - Bấm **Publish app**.
3. Mở **Credentials**, chọn **Create credentials → OAuth client ID**:
   - Application type: **Web application**.
   - **Authorized JavaScript origins**: `https://meai.vn` (tên miền thật), `https://<dự-án>.pages.dev` và `http://localhost:8788`.
4. Copy **Client ID** (dạng `xxxx.apps.googleusercontent.com`).

### 1.2. Tạo database D1

```bash
npx wrangler login
npx wrangler d1 create meai          # in ra database_id
```

Mở `wrangler.toml`, bỏ dấu `#` ở khối `[[d1_databases]]` và dán `database_id`. Sau đó tạo bảng:

```bash
npm run db:migrate
```

### 1.3. Khai báo biến môi trường

Vào Cloudflare Dashboard, mở dự án Pages, chọn **Settings → Variables and Secrets** (Production):

| Biến | Bắt buộc | Ý nghĩa |
|---|---|---|
| `GOOGLE_CLIENT_ID` | ✅ | Client ID ở bước 1.1 |
| `ADMIN_TOKEN` | ✅ | Chuỗi bí mật dài, dùng để kích hoạt gói thủ công (đặt dạng **Secret**) |
| `BANK_ID`, `BANK_ACCOUNT`, `BANK_ACCOUNT_NAME` | Nên có | Hiện mã VietQR có sẵn số tiền và nội dung. `BANK_ID` theo VietQR, VD: `MB`, `VCB`, `TCB`, `ACB` |
| `PAYMENT_WEBHOOK_KEY` | Tuỳ chọn | Bật kích hoạt **tự động** khi ngân hàng báo có tiền (mục 3) |
| `GOOGLE_DESKTOP_CLIENT_IDS` | Tuỳ chọn | Client ID loại *Desktop app*, chỉ cần nếu app tự đăng nhập Google (mục 4.3) |

Deploy lại (`npm run deploy` hoặc push lên `main`). Mở `/dashboard`: khi nút **Tiếp tục với Google** là nút chính thức
của Google và không còn dòng "Bản xem thử" thì hệ thống đã chạy thật.

---

## 2. Luồng mua gói

1. Khách chọn gói ở **Bảng giá** (hoặc trong app), đăng nhập Google và vào Khu vực khách hàng.
2. Hệ thống tạo đơn `MEAIxxxxxx`. Khách quét VietQR hoặc chuyển khoản với **nội dung = mã đơn**.
3. Gói được kích hoạt vào tài khoản Google theo một trong hai cách:
   - **Tự động** qua webhook ngân hàng (mục 3).
   - **Thủ công**: khách gửi ảnh chuyển khoản qua Telegram [@meai_support](https://t.me/meai_support), bạn chạy lệnh:

```bash
# Kích hoạt theo mã đơn
curl -X POST https://meai.vn/api/admin/grant \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "content-type: application/json" \
  -d '{"orderCode":"MEAIABC234"}'

# Tặng / cấp gói trực tiếp theo Gmail (người dùng phải đăng nhập MeAI ít nhất 1 lần)
curl -X POST https://meai.vn/api/admin/grant \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "content-type: application/json" \
  -d '{"email":"khach@gmail.com","planId":"year"}'

# Xem các đơn đang chờ
curl https://meai.vn/api/admin/orders -H "Authorization: Bearer $ADMIN_TOKEN"
```

Trang của khách tự cập nhật mỗi 5 giây và báo "Đã kích hoạt" ngay khi xong.

**Quy tắc cộng gói** (`server/store.ts → applyPurchase`):
- Gói theo thời hạn được **cộng nối tiếp** vào hạn còn lại, nên gia hạn sớm không mất ngày.
- Mua Vĩnh viễn thì hạn dùng không bao giờ hết.
- Đang dùng gói cao hơn mà mua gói thấp hơn: giữ gói cao, chỉ cộng thêm ngày.

---

## 3. Kích hoạt tự động bằng webhook ngân hàng

Dùng [SePay](https://sepay.vn) hoặc dịch vụ tương tự để theo dõi tài khoản ngân hàng:

1. Đặt `PAYMENT_WEBHOOK_KEY` = một chuỗi bí mật.
2. Trong SePay, thêm webhook:
   - URL: `https://meai.vn/api/payments/webhook`.
   - Kiểu chứng thực: **API Key**, giá trị là chuỗi ở bước 1. SePay gửi header `Authorization: Apikey <khoá>`.

API đọc nội dung chuyển khoản (`content` / `description`), số tiền (`transferAmount` / `amount`) và mã giao dịch (`id` / `tid`):
- Đơn khớp và **đủ tiền** thì được kích hoạt.
- Mỗi mã giao dịch chỉ dùng được một lần, nên gửi lặp không cộng gói hai lần.
- Chuyển thiếu tiền thì không kích hoạt.

---

## 4. Tích hợp app MeAI Desktop

Base URL: `https://meai.vn/api`. Mọi request và response đều là JSON.

### 4.1. Đăng nhập qua trình duyệt (khuyến nghị, không cần Client ID riêng cho app)

1. App tạo:
   - `state` ngẫu nhiên (8–128 ký tự `A-Za-z0-9_-`);
   - `deviceId` cố định cho máy, VD: hash của MachineGuid (6–128 ký tự `A-Za-z0-9._:-`).
2. App mở cổng loopback, VD `http://127.0.0.1:53682`, rồi mở trình duyệt tới:
   `https://meai.vn/app/connect?port=53682&state=<state>`
3. Người dùng đăng nhập Google trên web và bấm **Cho phép**. Trình duyệt chuyển về
   `http://127.0.0.1:53682/callback?code=<code>&state=<state>`.
4. App kiểm tra `state` trùng khớp, rồi đổi `code` (dùng 1 lần, hạn 5 phút) lấy token:

```http
POST /api/app/token
{ "code": "<code>", "deviceId": "WIN-7F3A-91C2", "deviceName": "DESKTOP-STUDIO01" }

→ 200 { "token": "<app token>", "expiresInDays": 180, "entitlement": { … } }
```

Lưu `token` an toàn, VD bằng Windows Credential Manager / DPAPI.

### 4.2. Kiểm tra quyền dùng (mỗi lần khởi động và mỗi `recheckAfterSec`)

```http
GET /api/app/entitlement
Authorization: Bearer <app token>

→ 200 {
  "user": { "id", "email", "name", "picture" },
  "plan": { "id": "year", "name": "Gói Năm", "active": true, "expiresAt": 1830000000000,
            "daysLeft": 118, "maxDevices": 2, "periodDays": 365, "startedAt": … } | null,
  "canUse": true,
  "device": "ok" | "limit" | "unknown",
  "devices": [ … ],
  "recheckAfterSec": 21600
}
→ 401 → token hết hạn hoặc máy đã bị gỡ trên web: đăng nhập lại
```

App áp dụng đúng gói theo kết quả trả về:

| Kết quả | Việc app làm |
|---|---|
| `canUse = true` | Mở khoá các tính năng của `plan.id` |
| `plan = null` hoặc `plan.active = false` | Hiện màn chọn gói |
| `device = "limit"` | Báo đã đủ số máy, mở `https://meai.vn/dashboard` để gỡ máy cũ |

### 4.3. (Tuỳ chọn) App tự đăng nhập Google

Nếu app tự chạy OAuth (Desktop client, loopback + PKCE) và lấy được `id_token`:

```http
POST /api/app/google
{ "idToken": "<Google ID token>", "deviceId": "…", "deviceName": "…" }
```

Kết quả giống 4.1. Cần khai báo Client ID desktop trong `GOOGLE_DESKTOP_CLIENT_IDS`.

### 4.4. Mua gói ngay trong app

```http
POST /api/app/orders
Authorization: Bearer <app token>
{ "planId": "month" | "year" | "lifetime" }

→ 200 { "order": { "code", "amount", "status": "pending",
                   "payment": { "qrUrl", "bankId", "account", "accountName", "transferContent" } | null } }
```

App hiển thị `payment.qrUrl` (ảnh VietQR), rồi gọi lại `/api/app/entitlement` vài giây một lần tới khi `canUse = true`.
Cách khác: mở `https://meai.vn/dashboard?plan=year` trên trình duyệt.

### 4.5. Đăng xuất

```http
POST /api/app/logout
Authorization: Bearer <app token>
```

---

## 5. Bảo mật đã áp dụng

- **Google ID token** được xác minh phía server: chữ ký RS256 theo khoá công khai của Google, `iss`, `aud`, `exp` và `email_verified`.
- **Phiên web** dùng cookie `__Host-meai_session` (HttpOnly, Secure, SameSite=Lax). Mọi thao tác ghi đều kiểm tra
  header `Origin` để chống CSRF.
- **Token** chỉ được lưu dưới dạng SHA-256 trong D1, không lưu token gốc.
- **Gỡ máy** trên web xoá luôn phiên app của máy đó.
- **Mã liên kết app** chỉ dùng được một lần, hết hạn sau 5 phút và chỉ chuyển hướng về `127.0.0.1`.
- **Khoá quản trị và khoá webhook** được so sánh không rò rỉ thời gian.

## 6. Chạy thử tại máy

```bash
cp .dev.vars.example .dev.vars             # điền GOOGLE_CLIENT_ID…
npm run build
npx wrangler d1 migrations apply meai --local   # cần bật khối [[d1_databases]] trong wrangler.toml
npx wrangler pages dev dist                # http://localhost:8788
npm run test:api                           # kiểm thử toàn bộ API (không cần mạng)
```
