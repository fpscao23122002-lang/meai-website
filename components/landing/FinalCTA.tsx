import { BookOpen } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { WindowsIcon } from "@/components/ui/WindowsIcon";
import { siteConfig } from "@/lib/site";

export function FinalCTA() {
  return (
    <section className="py-16">
      <div className="container">
        <Reveal className="glow-border relative overflow-hidden rounded-[32px] bg-panel px-6 py-16 text-center sm:px-12">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-cyan-brand/25 blur-[100px]" />
            <div className="absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-neon-pink/25 blur-[100px]" />
            <div className="bg-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
          </div>
          <div className="relative">
            <h2 className="mx-auto max-w-3xl text-balance text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Đối thủ đang đăng 50 Reels/ngày. <span className="text-gradient">Còn bạn?</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-slate-400">
              Tải MeAI Studio, cắm tài khoản, dán prompt và bấm Tạo &amp; chạy. Tối nay xếp hàng đợi, sáng mai có cả trăm video chờ đăng Reels.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href={siteConfig.downloadUrl} download size="lg" className="w-full sm:w-auto">
                <WindowsIcon className="h-5 w-5" /> Tải MeAI cho Windows
              </ButtonLink>
              <ButtonLink href="/docs" variant="outline" size="lg" className="w-full sm:w-auto">
                <BookOpen className="h-5 w-5 text-cyan-glow" /> Xem hướng dẫn
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
