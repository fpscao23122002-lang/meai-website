import { useRef, type MouseEvent } from "react";
import { motion, useTransform } from "framer-motion";
import { useElementProgress } from "@/hooks/usePageScroll";
import { HardDrive, Users } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StudioMock } from "@/components/mock/StudioMock";
import { ShotButton } from "@/components/mock/ShotButton";
import { siteConfig } from "@/lib/site";

const ease = [0.22, 1, 0.36, 1] as const;

function Beams() {
  const beams = [12, 27, 48, 71, 88];
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,black,transparent_85%)]">
      {beams.map((left, i) => (
        <div key={left} className="absolute top-0 h-full w-px bg-white/[0.04]" style={{ left: `${left}%` }}>
          <span
            className="absolute left-0 top-0 h-24 w-px animate-beam-down bg-gradient-to-b from-transparent via-cyan-glow to-transparent"
            style={{ animationDelay: `${i * 1.3}s`, animationDuration: `${5 + i}s` }}
          />
        </div>
      ))}
    </div>
  );
}

/** Màn hình Studio dựng lại bằng code, tự chạy demo — ngay dưới phim mở đầu */
export function StudioShowcase() {
  const ref = useRef<HTMLElement>(null);
  const scrollYProgress = useElementProgress(ref, 1, 0);
  const mockY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [0.95, 1.25]);

  const trackGlow = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--hx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--hy", `${e.clientY - r.top}px`);
  };

  return (
    <section id="studio" ref={ref} onMouseMove={trackGlow} className="relative scroll-mt-20 overflow-hidden pb-20 pt-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
        <Beams />
        <div className="absolute inset-0 bg-[radial-gradient(600px_circle_at_var(--hx,50%)_var(--hy,20%),rgba(0,240,255,0.08),transparent_60%)]" />
      </div>

      <div className="container">
        <SectionHeading
          eyebrow="Studio"
          title={["Một màn hình, ", { text: "cả xưởng video chạy", className: "text-gradient" }]}
          description="Dán danh sách prompt, bấm Tạo & chạy. MeAI tự chia task cho nhiều tài khoản, giữ đồng nhất nhân vật & sản phẩm, chạy lại lỗi, ghép video và đăng thẳng lên Facebook Reels."
        />

        {/* Nghiêng 3D khi xuất hiện rồi đặt phẳng hoàn toàn (transform = none) để giao diện sắc nét */}
        <div className="relative mx-auto mt-14 [perspective:1800px]">
          <motion.div
            initial={{ opacity: 0, y: 80, rotateX: 22, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.2, ease }}
            className="relative origin-top"
          >
            <motion.div
              style={{ scale: glowScale }}
              className="absolute -inset-x-24 -inset-y-20 -z-10 animate-pulse-soft bg-[radial-gradient(50%_55%_at_30%_50%,rgba(0,240,255,0.22),transparent_75%),radial-gradient(50%_55%_at_70%_50%,rgba(252,49,153,0.2),transparent_75%)]"
            />
            <motion.div style={{ y: mockY }}>
              <div className="glow-border relative rounded-2xl bg-panel p-1 shadow-[0_40px_140px_-30px_rgba(0,240,255,0.4)] sm:p-1.5">
                <StudioMock />
              </div>
            </motion.div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-glow" />
                Giao diện dựng lại từ app thật — đang tự chạy demo
              </span>
              <ShotButton src="/screens/studio-muse-anh.webp" w={2558} label="Ảnh chụp màn hình Studio thật" />
            </div>
          </motion.div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
          <span>
            Phiên bản {siteConfig.latestVersion} · Windows 10/11 64-bit · {siteConfig.installerSize}
          </span>
          <span className="flex items-center gap-1">
            <HardDrive className="h-3.5 w-3.5 text-cyan-glow" /> Thành phẩm lưu thẳng vào máy bạn
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-neon-pink" /> Không giới hạn tài khoản & luồng
          </span>
        </div>
      </div>
    </section>
  );
}
