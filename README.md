# MeAI Studio — Website chính thức

Website giới thiệu & khu vực khách hàng cho phần mềm Desktop **MeAI - All-in-One AI Video & Marketing Automation Studio**.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS 3 · Framer Motion · Lucide Icons

## Chạy dự án

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build production
npm start          # chạy bản production
npm run lint       # ESLint
npm run typecheck  # kiểm tra TypeScript
```

## Cấu trúc

| Đường dẫn | Nội dung |
| --- | --- |
| `/` | Landing page: Hero, Bento tính năng, Quy trình, Demo tương tác, Bảng giá, FAQ, CTA |
| `/docs` | Hướng dẫn sử dụng: cài đặt, thêm tài khoản, prompt hàng loạt, ảnh tham chiếu, hàng đợi, đăng FB Reels, LadiPage, khắc phục sự cố |
| `/dashboard` | Khu vực khách hàng: đăng nhập, hạn dùng gói, License Key & thiết bị, tải bản mới, changelog |

```
app/                 # Routes (App Router), metadata, sitemap, robots
components/
  landing/           # Các section của trang chủ (Hero, StudioMockup, InteractiveDemo, ...)
  docs/              # Sidebar mục lục + block tài liệu (Steps, Callout, CodeBlock, DocTable)
  dashboard/         # DashboardApp (đăng nhập, license) + Changelog
  layout/            # Navbar, Footer
  ui/                # Button, Logo, Reveal, SectionHeading
lib/
  site.ts            # Thông tin chung: phiên bản, link tải, liên hệ
  data.ts            # Engine, bảng giá, FAQ, changelog
  docs.ts            # Mục lục tài liệu
```

## Tùy chỉnh nhanh

- **Ảnh giao diện thật:** đặt ảnh chụp app tại `public/app-preview.png` (khuyến nghị 1920×1080). Hero sẽ tự dùng ảnh này thay cho mockup mô phỏng.
- **Link tải bộ cài:** đặt `NEXT_PUBLIC_DOWNLOAD_URL` (xem `.env.example`) hoặc chép file vào `public/downloads/MeAI-Studio-Setup-x64.exe`.
- **Phiên bản / ngày phát hành / dung lượng:** sửa trong `lib/site.ts`.
- **Giá, quyền lợi, FAQ, changelog:** sửa trong `lib/data.ts`.
- **Màu thương hiệu:** `tailwind.config.ts` (`ink` #0B0F19, `panel` #111827, `cyan.brand/glow`, `neon.pink/red`, `bg-brand-gradient`).

## Lưu ý về `/dashboard`

Khu vực khách hàng hiện chạy ở **chế độ demo**: đăng nhập, License Key và danh sách thiết bị được mô phỏng và lưu trong `localStorage` của trình duyệt. Khi có backend License, thay đối tượng `api` và hàm `createDemoSession` trong `components/dashboard/DashboardApp.tsx` bằng lời gọi API thật (đăng nhập, lấy license, gỡ thiết bị, kích hoạt mã).
