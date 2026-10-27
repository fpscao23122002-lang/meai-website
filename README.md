# MeAI Studio — Website chính thức

Website giới thiệu & khu vực khách hàng cho phần mềm Desktop **MeAI - All-in-One AI Video & Marketing Automation Studio**.

**Stack:** React 19 · Vite 6 · TypeScript · Tailwind CSS 3 · Framer Motion · React Router 7 · Lucide Icons
**Hosting:** Cloudflare Pages (static, cấu hình sẵn)

## Chạy dự án

Yêu cầu Node.js 22 (xem `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # kiểm tra TypeScript + build ra thư mục dist/
npm run preview    # xem thử bản build
npm run lint       # ESLint
npm run typecheck  # kiểm tra TypeScript
```

## Deploy lên Cloudflare Pages

### Cách 1 — Kết nối GitHub (khuyến nghị, tự deploy mỗi lần push)

1. Vào **Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git**, chọn repo `meai-website`.
2. Cấu hình build:

   | Mục | Giá trị |
   | --- | --- |
   | Framework preset | `React (Vite)` (hoặc `None`) |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Production branch | `main` |

3. **Settings → Environment variables** (áp dụng cho Production & Preview):
   - `VITE_SITE_URL` = tên miền chính thức, VD `https://meai.vn` (dùng cho canonical, Open Graph, sitemap)
   - `VITE_DOWNLOAD_URL` = link tải bộ cài `.exe` (nên dùng Cloudflare R2 hoặc GitHub Releases — Cloudflare Pages giới hạn mỗi file tối đa 25 MB)
   - Phiên bản Node được lấy tự động từ `.nvmrc` (22).
4. **Custom domains** → thêm tên miền của bạn.

### Cách 2 — Deploy từ máy bằng Wrangler CLI

```bash
npx wrangler login          # đăng nhập Cloudflare (một lần)
npm run deploy              # build + wrangler pages deploy dist
```

`wrangler.toml` đã khai báo tên project (`meai-website`) và thư mục output (`dist`). Biến `VITE_*` khi deploy bằng CLI lấy từ file `.env.production` trên máy (xem `.env.example`).

### Những gì đã cấu hình sẵn

- **Định tuyến SPA:** Cloudflare Pages tự trả về `index.html` cho mọi đường dẫn khi project không có `404.html`, nên `/docs`, `/dashboard` và trang 404 của React hoạt động mà không cần `_redirects`.
- **`public/_headers`:** header bảo mật, cache vĩnh viễn cho `/assets/*` (file có hash), cache 7 ngày cho ảnh, `noindex` cho `/dashboard`.
- **SEO:** `robots.txt` và `sitemap.xml` được sinh lúc build theo `VITE_SITE_URL`; title/description/canonical cập nhật theo từng trang (`src/hooks/usePageMeta.ts`); ảnh chia sẻ `public/og-image.png`.

## Cấu trúc

| Đường dẫn | Nội dung |
| --- | --- |
| `/` | Landing page: Hero (ảnh Studio thật), Bento tính năng, Giao diện thật (8 màn hình app), Quy trình, Demo Studio tương tác, Bảng giá, FAQ, CTA |
| `/docs` | Hướng dẫn sử dụng theo đúng menu app |
| `/dashboard` | Khu vực khách hàng: đăng nhập, hạn dùng gói, License Key & thiết bị, tải bản mới, changelog |

```
index.html             # Khung HTML, meta SEO/Open Graph, font Be Vietnam Pro
vite.config.ts         # Alias @ → src, chia chunk, sinh robots.txt & sitemap.xml
wrangler.toml          # Cấu hình Cloudflare Pages cho Wrangler CLI
public/
  _headers             # Header Cloudflare Pages
  favicon.png, apple-touch-icon.png, og-image.png
  brand/               # Logo MeAI
  screens/             # Ảnh chụp màn hình app (WebP)
  samples/             # Ảnh thành phẩm mẫu dùng trong demo
src/
  main.tsx, App.tsx    # Khởi tạo React + định tuyến (trang phụ tải lazy)
  pages/               # HomePage, DocsPage, DashboardPage, NotFoundPage
  components/
    landing/           # Hero, BentoFeatures, AppTour, Workflow, InteractiveDemo, Pricing, FAQ, FinalCTA
    docs/              # Sidebar mục lục + block tài liệu
    dashboard/         # DashboardApp (đăng nhập, license) + Changelog
    layout/            # Navbar, Footer, ScrollManager (cuộn tới #section)
    ui/                # Button, Link, Image, Logo, Reveal, SectionHeading
  hooks/usePageMeta.ts # Title/description/canonical theo trang
  lib/                 # site.ts (thông tin chung), data.ts (nội dung), docs.ts (mục lục)
image/, app-preview.png.png  # Ảnh gốc bạn tải lên (nguồn để tạo các file trong public/)
```

## Giao diện app & hiệu ứng

- **Giao diện app dựng bằng code** (`src/components/mock/`): 8 màn hình (Studio cho từng engine, Tư liệu, Kịch bản, Thư viện, Tài khoản, LadiPage, Đăng FB Reels, Cài đặt) dựng lại bằng HTML/CSS nên luôn sắc nét và tự co giãn theo PC/mobile. Mỗi màn hình tự chạy thao tác mẫu (gõ chữ, con trỏ ảo bấm nút, hàng đợi chạy…) khi hiện trên màn hình (`src/hooks/useScript.ts`). Ảnh chụp thật trong `public/screens/` mở qua nút "Xem ảnh chụp thật" (`ShotButton` + `Lightbox`).
- **Màn mở đầu** (`src/components/fx/Intro.tsx`, ~4.5 giây mỗi lần mở web, có nút "Bỏ qua"): lưới phối cảnh, hạt sáng hội tụ, logo giữa các vòng quỹ đạo engine, thanh tiến độ % + trạng thái kết nối từng engine, kết thúc bằng hiệu ứng mở rèm. Chỉnh thời lượng ở hằng số `DURATION`.
- **Demo tương tác:** menu trái của khung "Bấm thử Studio" chuyển được giữa 8 màn hình; mọi màn hình đều bấm/gõ được. Màn hình tự chạy demo cho đến khi người dùng chạm vào (nút "Xem lại demo" để chạy lại).
- **Hiệu ứng dùng chung** (`src/components/fx/`): nền aurora, quầng sáng theo con trỏ (PC), gợn sóng khi bấm/chạm, nút "nam châm" (PC), thanh tiến trình cuộn, nút lên đầu trang, thẻ nghiêng 3D + spotlight, chữ hiện từng từ, số đếm tăng dần, băng chạy chữ.
- Hiệu ứng tự tắt khi người dùng bật "Giảm chuyển động" trong hệ điều hành; hiệu ứng theo con trỏ chỉ bật trên thiết bị có chuột.

## Tùy chỉnh nhanh

- **Phiên bản / ngày phát hành / dung lượng / liên hệ:** `src/lib/site.ts`.
- **Giá, quyền lợi, FAQ, changelog, mô tả màn hình app:** `src/lib/data.ts`.
- **Ảnh giao diện app:** thay file trong `public/screens/` (giữ nguyên tên).
- **Logo:** `public/brand/meai-logo.webp`, `public/favicon.png`, `public/apple-touch-icon.png`, `public/og-image.png`.
- **Màu thương hiệu:** `tailwind.config.ts` (`ink` #0B0B14, `panel` #121224, `bg-brand-gradient` #00F0FF → #FC3199, màu engine Muse/Flow/Seedance/Dola).

## Lưu ý về `/dashboard`

Khu vực khách hàng hiện chạy ở **chế độ demo**: đăng nhập, License Key và danh sách thiết bị được mô phỏng và lưu trong `localStorage` của trình duyệt. Khi có backend License (VD: Cloudflare Workers + D1), thay đối tượng `api` và hàm `createDemoSession` trong `src/components/dashboard/DashboardApp.tsx` bằng lời gọi API thật.
