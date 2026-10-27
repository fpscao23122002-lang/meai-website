import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  CheckCircle2,
  Clapperboard,
  LayoutGrid,
  Pause,
  Play,
  Search,
  Settings,
  Sparkles,
  UserRound,
  Users,
  Volume2,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ShotButton } from "@/components/mock/ShotButton";
import { ScreenMock } from "@/components/mock/ScreenMock";
import { appScreens } from "@/lib/data";
import { cn } from "@/lib/cn";
import { useIndicator } from "@/hooks/useIndicator";

// Icon theo đúng menu bên trái của app
const icons: Record<string, typeof Sparkles> = {
  studio: Sparkles,
  "tu-lieu": UserRound,
  "kich-ban": Clapperboard,
  "thu-vien": LayoutGrid,
  "tai-khoan": Users,
  ladipage: Search,
  "dang-reels": Volume2,
  "cai-dat": Settings,
};

const AUTO_MS = 11000;
const ease = [0.22, 1, 0.36, 1] as const;

export function AppTour() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { margin: "-30% 0px" });
  const [active, setActive] = useState(0);
  const [shotIdx, setShotIdx] = useState(0);
  const [auto, setAuto] = useState(true);
  const [hovering, setHovering] = useState(false);

  const screen = appScreens[active];
  const tourInd = useIndicator<HTMLUListElement>(screen.id);
  const shot = screen.shots[Math.min(shotIdx, screen.shots.length - 1)];
  const playing = auto && inView && !hovering;

  // Tự chuyển màn hình khi người xem chưa chọn
  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => {
      setActive((a) => (a + 1) % appScreens.length);
      setShotIdx(0);
    }, AUTO_MS);
    return () => window.clearTimeout(id);
  }, [playing, active]);

  const select = (i: number) => {
    setActive(i);
    setShotIdx(0);
    setAuto(false);
  };

  return (
    <section
      ref={sectionRef}
      id="giao-dien"
      className="relative overflow-x-clip py-24"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="container">
        <SectionHeading
          eyebrow="Giao diện thật"
          title={["Đi một vòng ", { text: "bên trong MeAI", className: "text-gradient" }]}
          description="8 khu vực, đúng như menu bên trái của app — dựng lại bằng code nên luôn sắc nét trên mọi màn hình, và tự chạy thao tác mẫu để bạn thấy app làm việc thế nào."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">
          {/* Menu giống sidebar của app */}
          <div className="-mx-4 overflow-x-auto px-4 pb-1 lg:mx-0 lg:overflow-visible lg:px-0">
            <ul ref={tourInd.containerRef} className="relative flex gap-2 lg:flex-col lg:gap-1.5">
              <span
                aria-hidden
                style={tourInd.style}
                className="pointer-events-none absolute left-0 top-0 rounded-xl bg-gradient-to-r from-cyan-glow/15 to-neon-pink/10 shadow-glow-sm will-change-transform"
              />
              {appScreens.map((s, i) => {
                const Icon = icons[s.id] ?? Sparkles;
                const on = i === active;
                return (
                  <li key={s.id} className="shrink-0">
                    <button
                      type="button"
                      data-ind={s.id}
                      onClick={() => select(i)}
                      className={cn(
                        "relative flex w-full items-center gap-3 overflow-hidden rounded-xl border px-3.5 py-2.5 text-left text-sm font-medium transition-colors",
                        on ? "border-cyan-glow/40 text-white" : "border-white/[0.06] bg-panel/60 text-slate-400 hover:border-white/15 hover:text-white",
                      )}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0 transition-colors", on ? "text-cyan-glow" : "text-slate-500")} />
                      <span className="whitespace-nowrap">{s.label}</span>
                      {on && playing ? (
                        <motion.span
                          key={`p-${active}`}
                          className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-brand-gradient"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: AUTO_MS / 1000, ease: "linear" }}
                        />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              onClick={() => setAuto((v) => !v)}
              className="mt-3 hidden items-center gap-1.5 px-1 text-xs text-slate-500 hover:text-white lg:flex"
            >
              {auto ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              {auto ? "Tạm dừng tự chuyển" : "Tự động chuyển màn"}
            </button>
          </div>

          <div className="min-w-0">
            {/* Chỉ hiệu ứng xuất hiện (không dùng exit) để tránh kẹt khi chuyển màn nhanh trên mobile */}
            <motion.div
                key={`${screen.id}-${shotIdx}`}
                initial={{ opacity: 0, clipPath: "inset(0% 0% 12% 0% round 18px)", filter: "blur(10px)", y: 16 }}
                animate={{
                  opacity: 1,
                  clipPath: "inset(0% 0% 0% 0% round 0px)",
                  filter: "blur(0px)",
                  y: 0,
                  // Bỏ hẳn filter/clip sau khi xong để ảnh hiển thị sắc nét nhất
                  transitionEnd: { filter: "none", clipPath: "none" },
                }}
                                transition={{ duration: 0.55, ease }}
              >
                {screen.shots.length > 1 ? (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {screen.shots.map((sh, i) => (
                      <button
                        key={sh.src}
                        type="button"
                        onClick={() => {
                          setShotIdx(i);
                          setAuto(false);
                        }}
                        className={cn(
                          "relative rounded-lg border px-3 py-1.5 text-xs font-semibold transition",
                          i === shotIdx ? "border-neon-pink/50 text-pink-100" : "border-white/10 text-slate-400 hover:text-white",
                        )}
                      >
                        {i === shotIdx ? (
                          <motion.span layoutId="shot-active" className="absolute inset-0 -z-10 rounded-lg bg-neon-pink/15" />
                        ) : null}
                        {sh.label}
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="relative">
                  <div className="absolute -inset-12 -z-10 bg-[radial-gradient(50%_55%_at_30%_50%,rgba(0,240,255,0.13),transparent_75%),radial-gradient(50%_55%_at_70%_50%,rgba(252,49,153,0.12),transparent_75%)]" />
                  <ScreenMock id={screen.id} shotIdx={shotIdx} play={inView} />
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-glow" />
                    Dựng lại từ app thật — đang tự chạy thao tác mẫu
                  </span>
                  <ShotButton src={shot.src} w={2559} label={`Ảnh chụp màn hình ${shot.label} thật`} />
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-[1fr_1.1fr]">
                  <div>
                    <h3 className="text-xl font-bold text-white sm:text-2xl">{screen.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base">{screen.desc}</p>
                  </div>
                  <ul className="space-y-2.5">
                    {screen.points.map((p, i) => (
                      <motion.li
                        key={p}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.08, duration: 0.4, ease }}
                        className="flex gap-2.5 text-sm leading-6 text-slate-300"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-glow" />
                        {p}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
