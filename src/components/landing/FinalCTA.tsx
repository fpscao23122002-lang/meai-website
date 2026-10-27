import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { WindowsIcon } from "@/components/ui/WindowsIcon";
import { SplitText } from "@/components/fx/SplitText";
import { trackSpotlight } from "@/components/fx/spotlight";
import { engines } from "@/lib/data";
import { siteConfig } from "@/lib/site";

/** Logo nổi giữa các vòng quỹ đạo, mỗi engine là một "vệ tinh" */
function OrbitLogo() {
  return (
    <div className="relative mx-auto mb-10 h-44 w-44">
      <div className="absolute inset-0 animate-spin-slower rounded-full border border-dashed border-cyan-glow/25" />
      <div className="absolute inset-5 animate-spin-slow rounded-full border border-neon-pink/20 [animation-direction:reverse]" />
      {engines.map((e, i) => (
        <div
          key={e.id}
          className="absolute inset-0 animate-spin-slower"
          style={{ animationDelay: `${-i * (22 / engines.length)}s` }}
        >
          <span
            className={`absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full ${e.dot}`}
            style={{ boxShadow: `0 0 14px ${e.hex}` }}
          />
        </div>
      ))}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-9"
      >
        <div className="absolute -inset-3 animate-pulse-soft rounded-[30%] bg-brand-gradient opacity-40 blur-2xl" />
        <img src="/brand/meai-logo.webp" alt="MeAI" width={256} height={256} loading="lazy" className="relative h-full w-full rounded-[24%] ring-1 ring-white/15" />
      </motion.div>
    </div>
  );
}

export function FinalCTA() {
  return (
    <section className="py-16">
      <div className="container">
        <Reveal>
          <div
            onMouseMove={trackSpotlight}
            className="spotlight glow-border relative overflow-hidden rounded-[32px] bg-panel px-6 py-16 text-center sm:px-12"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-20 -top-20 h-72 w-72 animate-aurora-1 rounded-full bg-cyan-brand/25 blur-[100px]" />
              <div className="absolute -bottom-24 -right-10 h-72 w-72 animate-aurora-2 rounded-full bg-neon-pink/25 blur-[100px]" />
              <div className="bg-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
            </div>
            <div className="relative">
              <OrbitLogo />
              <h2 className="mx-auto max-w-3xl text-balance text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                <SplitText parts={["Đối thủ đang đăng 50 Reels/ngày. ", { text: "Còn bạn?", className: "text-gradient" }]} />
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-slate-400">
                Tải MeAI Studio, cắm tài khoản, dán prompt và bấm Tạo &amp; chạy. Tối nay xếp hàng đợi, sáng mai có cả trăm
                video chờ đăng Reels.
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
          </div>
        </Reveal>
      </div>
    </section>
  );
}
