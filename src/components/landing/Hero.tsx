import { useEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useTransform } from "framer-motion";
import { useElementProgress } from "@/hooks/usePageScroll";
import { ArrowRight, HardDrive, PlayCircle, Sparkles, Users } from "lucide-react";
import { Link } from "@/components/ui/Link";
import { ButtonLink } from "@/components/ui/Button";
import { WindowsIcon } from "@/components/ui/WindowsIcon";
import { SplitText } from "@/components/fx/SplitText";
import { CountUp } from "@/components/fx/CountUp";
import { StudioMock } from "@/components/mock/StudioMock";
import { ShotButton } from "@/components/mock/ShotButton";
import { engines } from "@/lib/data";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/cn";

const stats = [
  { value: "3", label: "Engine AI: Muse · Flow · Seedance" },
  { value: "4", label: "Nền tảng tài khoản (có Dola)" },
  { value: "6", label: "Ảnh tham chiếu / prompt" },
  { value: "4K", label: "Độ phân giải tối đa" },
];

const ease = [0.22, 1, 0.36, 1] as const;

function RotatingEngine() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((v) => (v + 1) % engines.length), 2200);
    return () => window.clearInterval(id);
  }, []);
  const e = engines[i];
  return (
    <span className="relative inline-flex h-[1.5em] min-w-[9.5em] items-center justify-center overflow-hidden align-bottom sm:justify-start">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={e.id}
          initial={{ y: "100%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.5, ease }}
          className={cn("inline-flex items-center gap-2 font-bold", e.text)}
        >
          <span className={cn("h-2.5 w-2.5 rounded-full shadow-[0_0_12px_currentColor]", e.dot)} />
          {e.name}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

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

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const scrollYProgress = useElementProgress(heroRef, 0, 0);
  const mockY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);

  const trackGlow = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--hx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--hy", `${e.clientY - r.top}px`);
  };

  return (
    <section ref={heroRef} onMouseMove={trackGlow} className="relative overflow-hidden pb-20 pt-32 sm:pt-36">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
        <Beams />
        <div className="absolute inset-0 bg-[radial-gradient(600px_circle_at_var(--hx,50%)_var(--hy,20%),rgba(0,240,255,0.08),transparent_60%)]" />
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(14,230,250,0.15),rgba(14,230,250,0.083)_45%,transparent)] scale-[1.5]" />
        <div className="absolute right-[-10%] top-40 h-[420px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(252,49,153,0.15),rgba(252,49,153,0.083)_45%,transparent)] scale-[1.5]" />
      </div>

      <div className="container">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
            <Link
              href="/dashboard#changelog"
              className="glow-border group inline-flex items-center gap-2 rounded-full bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-slate-300 transition hover:text-white"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-cyan-glow" />
                <span className="relative h-2 w-2 rounded-full bg-cyan-glow" />
              </span>
              <Sparkles className="h-3.5 w-3.5 text-cyan-glow" />
              Mới v{siteConfig.latestVersion}: Seedance Đầu–cuối, 21:9 & Google Flow 4K
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <h1 className="mt-7 text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[58px]">
            <SplitText inView={false} delay={0.1} parts={[{ text: "MeAI Studio", className: "text-gradient" }]} className="block" />
            <SplitText
              inView={false}
              delay={0.25}
              stagger={0.05}
              parts={["Xưởng Sản Xuất Video AI & Tự Động Hóa Reels Đa Tài Khoản"]}
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85, ease }}
            className="mt-5 flex flex-wrap items-center justify-center gap-x-2 text-lg font-medium text-slate-300 sm:text-xl"
          >
            Tạo ảnh & video hàng loạt trên <RotatingEngine />
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.95, ease }}
            className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-7 text-slate-400 sm:text-lg"
          >
            Dán danh sách prompt, bấm <strong className="text-white">Tạo &amp; chạy</strong>. MeAI tự chia task cho nhiều tài
            khoản, giữ đồng nhất nhân vật & sản phẩm, chạy lại lỗi, ghép video và đăng thẳng lên Facebook Reels — một mình
            bạn vận hành cả xưởng content.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.05, ease }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <ButtonLink href={siteConfig.downloadUrl} download size="lg" className="w-full sm:w-auto">
              <WindowsIcon className="h-5 w-5" />
              Tải bản cài đặt cho Windows
            </ButtonLink>
            <ButtonLink href="#demo" variant="outline" size="lg" className="w-full sm:w-auto">
              <PlayCircle className="h-5 w-5 text-cyan-glow" />
              Bấm thử Studio ngay
            </ButtonLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.2 }}
            className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500"
          >
            <span>
              Phiên bản {siteConfig.latestVersion} · Windows 10/11 64-bit · {siteConfig.installerSize}
            </span>
            <span className="flex items-center gap-1">
              <HardDrive className="h-3.5 w-3.5 text-cyan-glow" /> Thành phẩm lưu thẳng vào máy bạn
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-neon-pink" /> Không giới hạn tài khoản & luồng
            </span>
          </motion.div>
        </div>

        {/* Ảnh Studio: nghiêng 3D khi xuất hiện rồi đặt phẳng hoàn toàn (transform = none) để ảnh sắc nét */}
        <div className="relative mx-auto mt-16 [perspective:1800px]">
          <motion.div
            initial={{ opacity: 0, y: 80, rotateX: 22, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            transition={{ duration: 1.3, delay: 0.5, ease }}
            className="relative origin-top"
          >
            <motion.div style={{ scale: glowScale }} className="absolute -inset-x-24 -inset-y-20 -z-10 animate-pulse-soft bg-[radial-gradient(50%_55%_at_30%_50%,rgba(0,240,255,0.22),transparent_75%),radial-gradient(50%_55%_at_70%_50%,rgba(252,49,153,0.2),transparent_75%)]" />
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

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center"
            >
              <p className="text-gradient text-4xl font-extrabold tabular-nums sm:text-5xl">
                <CountUp value={s.value} />
              </p>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
