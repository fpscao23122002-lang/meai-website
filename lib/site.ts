export const siteConfig = {
  name: "MeAI Studio",
  fullName: "MeAI - All-in-One AI Video & Marketing Automation Studio",
  description:
    "Xưởng sản xuất video AI & tự động hóa Reels đa tài khoản. Tích hợp Muse, Google Flow, Seedance — tạo ảnh, tạo video hàng loạt từ danh sách prompt, giữ đồng nhất nhân vật, viết kịch bản từ LadiPage và đăng thẳng lên Facebook Reels.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://meai.vn",
  downloadUrl: process.env.NEXT_PUBLIC_DOWNLOAD_URL ?? "/downloads/MeAI-Studio-Setup-x64.exe",
  latestVersion: "2.6.0",
  releaseDate: "20/10/2026",
  installerSize: "148 MB",
  contact: {
    zalo: "https://zalo.me/meai",
    facebook: "https://facebook.com/meai.studio",
    youtube: "https://youtube.com/@meai.studio",
    email: "support@meai.vn",
    hotline: "0900 000 000",
  },
};

export const navLinks = [
  { href: "/#tinh-nang", label: "Tính năng" },
  { href: "/#giao-dien", label: "Giao diện" },
  { href: "/#demo", label: "Trải nghiệm" },
  { href: "/#bang-gia", label: "Bảng giá" },
  { href: "/#faq", label: "FAQ" },
  { href: "/docs", label: "Hướng dẫn" },
];
