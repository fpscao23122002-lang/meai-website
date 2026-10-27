import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Màn mở đầu (~4.5s): nền lưới phối cảnh + hạt sáng hội tụ, logo giữa các vòng quỹ đạo,
 * chữ thương hiệu hiện từng ký tự, thanh tiến độ % và trạng thái kết nối từng engine,
 * kết thúc bằng hiệu ứng "mở rèm" vào trang chính.
 */

const DURATION = 4300; // thời gian chạy thanh tiến độ (ms)
const OPEN_MS = 900; // thời gian mở rèm

const STEPS = [
  { at: 0, text: "Khởi động lõi AI…" },
  { at: 16, text: "Kết nối Muse…" },
  { at: 34, text: "Kết nối Google Flow…" },
  { at: 52, text: "Đồng bộ Seedance & Dola…" },
  { at: 70, text: "Nạp tư liệu & hàng đợi thông minh…" },
  { at: 88, text: "Tối ưu giao diện Studio…" },
  { at: 100, text: "Sẵn sàng!" },
];

const ENGINES = [
  { name: "Muse", color: "#00F0FF", at: 22 },
  { name: "Google Flow", color: "#A855F7", at: 40 },
  { name: "Seedance", color: "#EAB308", at: 58 },
  { name: "Dola", color: "#EC4899", at: 76 },
];

const BRAND = "MeAI Studio";
const MILESTONES = [...new Set([...STEPS.map((s) => s.at), ...ENGINES.map((e) => e.at)])].sort((a, b) => a - b);

// Tải trước tài nguyên trang chính trong lúc chạy màn mở đầu
function preload() {
  ["/brand/meai-logo.webp", "/samples/anh-1.webp", "/samples/video-1.webp", "/samples/video-3.webp", "/samples/video-4.webp"].forEach((src) => {
    const img = new Image();
    img.src = src;
  });
  void import("@/pages/DocsPage");
  void import("@/pages/DashboardPage");
}

function easeProgress(t: number) {
  // Nhanh lúc đầu, chậm lại ở giữa ("đang kết nối"), tăng tốc về cuối
  const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  return Math.min(100, Math.round((0.35 * t + 0.65 * e) * 100));
}

export function Intro({ onReveal }: { onReveal: () => void }) {
  const reduce = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  // Tiến độ chạy bằng motion value (cập nhật thẳng vào DOM, không dựng lại giao diện mỗi khung hình);
  // `pct` (state) chỉ đổi khi vượt qua các mốc trạng thái → rất ít lần render lại.
  const progress = useMotionValue(0);
  const pctText = useTransform(progress, (v) => Math.round(v));
  const barScale = useTransform(progress, (v) => v / 100);
  const headX = useTransform(progress, (v) => `${v - 100}%`);
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<"load" | "open" | "gone">("load");
  const revealed = useRef(false);
  const total = reduce ? 1000 : DURATION;

  const finish = () => {
    if (revealed.current) return;
    revealed.current = true;
    progress.set(100);
    setPct(100);
    setPhase("open");
    onReveal();
    window.setTimeout(() => setPhase("gone"), OPEN_MS + 100);
  };

  useEffect(() => {
    preload();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const start = performance.now();
    let raf = 0;
    let doneTimer = 0;
    let stage = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / total);
      const v = easeProgress(t);
      progress.set(v);
      const reached = MILESTONES.filter((m) => v >= m).pop() ?? 0;
      if (reached !== stage) {
        stage = reached;
        setPct(reached);
      }
      if (t < 1) raf = requestAnimationFrame(tick);
      else doneTimer = window.setTimeout(finish, 380);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(doneTimer);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase === "gone") document.body.style.overflow = "";
  }, [phase]);

  const step = [...STEPS].reverse().find((s) => pct >= s.at) ?? STEPS[0];

  const particles = useMemo(() => {
    let seed = 11;
    const r = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    return Array.from({ length: 28 }, (_, i) => {
      const ang = r() * Math.PI * 2;
      const dist = 280 + r() * 420;
      return { x: Math.cos(ang) * dist, y: Math.sin(ang) * dist, d: r() * 2.4, s: 1.5 + r() * 2.5, c: i % 3 === 0 ? "#FC3199" : "#00F0FF" };
    });
  }, []);

  if (phase === "gone") return null;
  const opening = phase === "open";

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden" aria-live="polite" aria-label="Đang tải MeAI Studio">
      {/* Rèm trên / dưới: tách ra khi mở */}
      {(["top", "bottom"] as const).map((side) => (
        <motion.div
          key={side}
          initial={false}
          animate={opening ? { y: side === "top" ? "-100%" : "100%" } : { y: 0 }}
          transition={{ duration: OPEN_MS / 1000, ease: [0.76, 0, 0.24, 1] }}
          className={cn("absolute inset-x-0 h-1/2 bg-ink", side === "top" ? "top-0" : "bottom-0")}
        >
          <div
            className={cn(
              "absolute inset-x-0 h-px bg-brand-gradient shadow-[0_0_20px_rgba(0,240,255,0.9)] transition-opacity duration-300",
              side === "top" ? "bottom-0" : "top-0",
              opening ? "opacity-100" : "opacity-0",
            )}
          />
        </motion.div>
      ))}

      {/* Nội dung màn mở đầu */}
      <motion.div
        animate={opening ? { opacity: 0, scale: 1.15, filter: "blur(12px)" } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 flex flex-col items-center justify-center px-6"
      >
        {/* Nền: lưới phối cảnh chạy + quầng sáng */}
        <div className="pointer-events-none absolute inset-0 [perspective:600px]">
          <div className="absolute inset-x-[-50%] bottom-[-10%] h-[60%] origin-bottom [transform:rotateX(70deg)]">
            <div className="intro-grid absolute inset-0 [mask-image:linear-gradient(to_top,black,transparent_85%)]" />
          </div>
          <div className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 animate-pulse-soft rounded-full bg-[radial-gradient(circle,rgba(0,240,255,0.18),rgba(252,49,153,0.1)_45%,transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(11,11,20,0.9))]" />
        </div>

        {/* Hạt sáng hội tụ về logo */}
        <div className="pointer-events-none absolute left-1/2 top-[42%]">
          {!reduce &&
            particles.map((p, i) => (
              <span
                key={i}
                className="absolute rounded-full opacity-0"
                style={
                  {
                    width: p.s,
                    height: p.s,
                    background: p.c,
                    boxShadow: `0 0 ${p.s * 4}px ${p.c}`,
                    "--px": `${p.x}px`,
                    "--py": `${p.y}px`,
                    transform: `translate3d(${p.x}px, ${p.y}px, 0)`,
                    animation: `fx-converge 1.8s ease-in ${p.d}s infinite backwards, fx-blink 1.8s ease-in ${p.d}s infinite backwards`,
                  } as CSSProperties
                }
              />
            ))}
        </div>

        {/* Logo + vòng quỹ đạo */}
        <div className="relative flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">
          <motion.div
            initial={{ scale: 0.3, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 animate-spin-slow rounded-full p-[2px] [background:conic-gradient(from_0deg,transparent,#00F0FF,#A855F7,#FC3199,transparent_70%)] [mask:radial-gradient(farthest-side,transparent_calc(100%-2px),black_calc(100%-2px))]"
          />
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-5 animate-spin-slower rounded-full border border-dashed border-cyan-glow/30 [animation-direction:reverse]"
          />
          {/* 4 vệ tinh engine, sáng lên khi kết nối xong */}
          {ENGINES.map((e, i) => {
            const on = pct >= e.at;
            return (
              <div key={e.name} className="absolute inset-0 animate-spin-slow" style={{ animationDelay: `${-i * 2}s` }}>
                <motion.span
                  animate={{ scale: on ? 1 : 0.5, opacity: on ? 1 : 0.25 }}
                  className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full"
                  style={{ background: e.color, boxShadow: on ? `0 0 16px 3px ${e.color}` : "none" }}
                />
              </div>
            );
          })}

          <motion.div
            initial={{ scale: 0, rotate: -25, opacity: 0 }}
            animate={{ scale: pct >= 100 ? [1, 1.12, 1] : 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.35 }}
            className="relative"
          >
            <div className="absolute -inset-14 animate-pulse-soft bg-[radial-gradient(closest-side,rgba(0,240,255,0.45),rgba(252,49,153,0.3)_55%,transparent)]" />
            <div className="relative h-28 w-28 overflow-hidden rounded-[26%] ring-1 ring-white/20 sm:h-32 sm:w-32">
              <img src="/brand/meai-logo.webp" alt="MeAI" className="h-full w-full" />
              {/* vệt sáng quét qua logo */}
              <span className="absolute inset-y-0 -left-1/2 w-1/2 animate-shine bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            </div>
          </motion.div>
        </div>

        {/* Tên thương hiệu */}
        <h1 className="relative mt-7 flex text-3xl font-extrabold tracking-tight sm:text-4xl" aria-label={BRAND}>
          {BRAND.split("").map((ch, i) => (
            <motion.span
              key={i}
              aria-hidden
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.6 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={cn(ch === " " ? "w-2.5" : "", i >= 2 && i <= 3 ? "text-gradient" : i > 4 ? "text-white/90" : "text-white")}
            >
              {ch}
            </motion.span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.6em" }}
          animate={{ opacity: 1, letterSpacing: "0.32em" }}
          transition={{ delay: 1.3, duration: 1 }}
          className="mt-2 text-center text-[10px] font-semibold uppercase text-slate-400 sm:text-xs"
        >
          AI Video & Marketing Automation
        </motion.p>

        {/* Thanh tiến độ */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="mt-9 w-full max-w-md">
          <div className="flex items-end justify-between text-xs">
            <AnimatePresence mode="wait">
              <motion.span
                key={step.text}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className={cn("font-medium", pct >= 100 ? "text-cyan-glow" : "text-slate-400")}
              >
                {step.text}
              </motion.span>
            </AnimatePresence>
            <span className="font-mono text-lg font-bold tabular-nums text-white">
              <motion.span>{pctText}</motion.span>
              <span className="text-xs text-slate-500">%</span>
            </span>
          </div>
          <div className="relative mt-2 h-1.5 rounded-full bg-white/[0.07]">
            <motion.div style={{ scaleX: barScale }} className="absolute inset-0 origin-left rounded-full bg-brand-gradient" />
            {/* đầu sáng: lớp phủ toàn chiều rộng dịch theo % → mép phải luôn ở đúng vị trí tiến độ */}
            <motion.div style={{ x: headX }} className="pointer-events-none absolute inset-0">
              <span className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_4px_rgba(0,240,255,0.8)]" />
            </motion.div>
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="h-full w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            </div>
          </div>

          {/* Trạng thái từng engine */}
          <div className="mt-4 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {ENGINES.map((e) => {
              const on = pct >= e.at;
              return (
                <motion.span
                  key={e.name}
                  animate={{ opacity: on ? 1 : 0.35, scale: on ? 1 : 0.96 }}
                  className="flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-1 text-[10.5px] font-semibold"
                  style={{ borderColor: on ? `${e.color}88` : "rgba(255,255,255,0.08)", color: on ? e.color : "#64748b" }}
                >
                  {on ? <Check className="h-3 w-3" strokeWidth={3} /> : <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />}
                  {e.name}
                </motion.span>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      {/* Bỏ qua */}
      {!opening ? (
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={finish}
          className="absolute bottom-5 right-5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:border-cyan-glow/40 hover:text-white"
        >
          Bỏ qua ›
        </motion.button>
      ) : null}
    </div>
  );
}
