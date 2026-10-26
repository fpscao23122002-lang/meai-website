import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const fontSans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "MeAI Studio - Xưởng Sản Xuất Video AI & Tự Động Hóa Reels Đa Tài Khoản",
    template: "%s | MeAI Studio",
  },
  description: siteConfig.description,
  keywords: [
    "MeAI",
    "tạo video AI hàng loạt",
    "Google Flow",
    "Veo",
    "Seedance",
    "Muse",
    "tự động đăng Reels",
    "phần mềm MMO",
    "video affiliate",
    "AI marketing automation",
  ],
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "MeAI Studio - Xưởng Sản Xuất Video AI & Tự Động Hóa Reels",
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "MeAI Studio - Xưởng Sản Xuất Video AI",
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0F19",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={fontSans.variable}>
      <body className="min-h-screen bg-ink">{children}</body>
    </html>
  );
}
