import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DashboardApp } from "@/components/dashboard/DashboardApp";
import { Changelog } from "@/components/dashboard/Changelog";

export const metadata: Metadata = {
  title: "Khách hàng & Quản lý License",
  description:
    "Đăng nhập khu vực khách hàng MeAI: kiểm tra hạn sử dụng gói cước, quản lý License Key và thiết bị, xem changelog và tải bản cập nhật mới nhất.",
  robots: { index: false, follow: true },
};

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <main className="relative pt-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] overflow-hidden">
          <div className="absolute left-[10%] top-[-150px] h-[400px] w-[600px] rounded-full bg-cyan-brand/15 blur-[120px]" />
          <div className="absolute right-[5%] top-[-100px] h-[360px] w-[500px] rounded-full bg-neon-pink/10 blur-[120px]" />
        </div>
        <div className="container space-y-20">
          <DashboardApp />
          <div className="mx-auto max-w-4xl">
            <Changelog />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
