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
| `/` | Landing page: Hero (ảnh Studio thật), Bento tính năng, Giao diện thật (8 màn hình app), Quy trình, Demo Studio tương tác, Bảng giá, FAQ, CTA |
| `/docs` | Hướng dẫn sử dụng theo đúng menu app: cài đặt, thiết lập, tài khoản, Studio, Tư liệu, hàng đợi, Kịch bản, LadiPage, Đăng FB Reels, sự cố |
| `/dashboard` | Khu vực khách hàng: đăng nhập, hạn dùng gói, License Key & thiết bị, tải bản mới, changelog |

```
app/                 # Routes (App Router), metadata, icon, opengraph-image, sitemap, robots
components/
  landing/           # Hero, BentoFeatures, AppTour, Workflow, InteractiveDemo, Pricing, FAQ, FinalCTA
  docs/              # Sidebar mục lục + block tài liệu (Steps, Callout, CodeBlock, DocTable, DocShot)
  dashboard/         # DashboardApp (đăng nhập, license) + Changelog
  layout/            # Navbar, Footer
  ui/                # Button, Logo, Reveal, SectionHeading
lib/
  site.ts            # Thông tin chung: phiên bản, link tải, liên hệ
  data.ts            # Engine, màn hình app, bảng giá, FAQ, changelog
  docs.ts            # Mục lục tài liệu
public/
  brand/             # Logo MeAI (meai-logo.webp, meai-logo-full.webp)
  screens/           # Ảnh chụp 12 màn hình app (đã tối ưu WebP 1920px)
  samples/           # Ảnh thành phẩm mẫu dùng trong demo
image/, app-preview.png.png  # Ảnh gốc bạn tải lên (nguồn để tạo các file trong public/)
```

## Tùy chỉnh nhanh

- **Ảnh giao diện app:** thay file trong `public/screens/` (giữ nguyên tên, khuyến nghị WebP 1920px). Danh sách màn hình & mô tả nằm ở `appScreens` trong `lib/data.ts`.
- **Logo:** `public/brand/meai-logo.webp` (header/footer), `app/icon.png` + `app/apple-icon.png` (favicon), `app/opengraph-image.png` (ảnh chia sẻ).
- **Link tải bộ cài:** đặt `NEXT_PUBLIC_DOWNLOAD_URL` (xem `.env.example`) hoặc chép file vào `public/downloads/MeAI-Studio-Setup-x64.exe`.
- **Phiên bản / ngày phát hành / dung lượng:** sửa trong `lib/site.ts`.
- **Giá, quyền lợi, FAQ, changelog:** sửa trong `lib/data.ts`.
- **Màu thương hiệu:** `tailwind.config.ts` (lấy đúng từ app: `ink` #0B0B14, `panel` #121224, `bg-brand-gradient` #00F0FF → #FC3199, màu engine Muse/Flow/Seedance/Dola).

## Lưu ý về `/dashboard`

Khu vực khách hàng hiện chạy ở **chế độ demo**: đăng nhập, License Key và danh sách thiết bị được mô phỏng và lưu trong `localStorage` của trình duyệt. Khi có backend License, thay đối tượng `api` và hàm `createDemoSession` trong `components/dashboard/DashboardApp.tsx` bằng lời gọi API thật (đăng nhập, lấy license, gỡ thiết bị, kích hoạt mã).
