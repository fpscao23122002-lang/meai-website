"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Clapperboard,
  LayoutGrid,
  Maximize2,
  Search,
  Settings,
  Sparkles,
  UserRound,
  Users,
  Volume2,
  X,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { appScreens } from "@/lib/data";
import { cn } from "@/lib/cn";

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

export function AppTour() {
  const [active, setActive] = useState(appScreens[0].id);
  const [shotIdx, setShotIdx] = useState(0);
  const [zoom, setZoom] = useState(false);

  const screen = appScreens.find((s) => s.id === active) ?? appScreens[0];
  const shot = screen.shots[Math.min(shotIdx, screen.shots.length - 1)];

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoom(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom]);

  const select = (id: string) => {
    setActive(id);
    setShotIdx(0);
  };

  return (
    <section id="giao-dien" className="relative py-24">
      <div className="container">
        <SectionHeading
          eyebrow="Giao diện thật"
          title={
            <>
              Đi một vòng <span className="text-gradient">bên trong MeAI</span>
            </>
          }
          description="8 khu vực, đúng như menu bên trái của app. Bấm từng mục để xem màn hình thật và cách nó giúp bạn ra content nhanh hơn."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          {/* Menu giống sidebar của app */}
          <div className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0">
            <ul className="flex gap-2 lg:flex-col lg:gap-1.5">
              {appScreens.map((s) => {
                const Icon = icons[s.id] ?? Sparkles;
                const on = s.id === active;
                return (
                  <li key={s.id} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => select(s.id)}
                      className={cn(
                        "relative flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm font-medium transition",
                        on
                          ? "border-cyan-glow/40 bg-cyan-glow/10 text-white shadow-glow-sm"
                          : "border-white/[0.06] bg-panel/60 text-slate-400 hover:border-white/15 hover:text-white",
                      )}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0", on ? "text-cyan-glow" : "text-slate-500")} />
                      <span className="whitespace-nowrap">{s.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={screen.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {screen.shots.length > 1 ? (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {screen.shots.map((sh, i) => (
                      <button
                        key={sh.src}
                        type="button"
                        onClick={() => setShotIdx(i)}
                        className={cn(
                          "rounded-lg border px-3 py-1.5 text-xs font-semibold transition",
                          i === shotIdx
                            ? "border-neon-pink/40 bg-neon-pink/10 text-pink-200"
                            : "border-white/10 text-slate-400 hover:text-white",
                        )}
                      >
                        {sh.label}
                      </button>
                    ))}
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => setZoom(true)}
                  className="glow-border group relative block w-full overflow-hidden rounded-2xl bg-panel text-left shadow-[0_30px_100px_-40px_rgba(0,240,255,0.4)]"
                  aria-label={`Phóng to ảnh màn hình ${shot.label}`}
                >
                  <Image
                    key={shot.src}
                    src={shot.src}
                    alt={`Màn hình ${shot.label} trong app MeAI`}
                    width={shot.w}
                    height={shot.h}
                    sizes="(min-width: 1280px) 1000px, 100vw"
                    className="h-auto w-full"
                  />
                  <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg bg-ink/80 px-2.5 py-1.5 text-xs text-slate-200 opacity-0 backdrop-blur transition group-hover:opacity-100">
                    <Maximize2 className="h-3.5 w-3.5" /> Phóng to
                  </span>
                </button>

                <div className="mt-6 grid gap-6 md:grid-cols-[1fr_1.1fr]">
                  <div>
                    <h3 className="text-xl font-bold text-white sm:text-2xl">{screen.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base">{screen.desc}</p>
                  </div>
                  <ul className="space-y-2.5">
                    {screen.points.map((p) => (
                      <li key={p} className="flex gap-2.5 text-sm leading-6 text-slate-300">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-glow" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {zoom ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-3 backdrop-blur-sm sm:p-8"
            onClick={() => setZoom(false)}
            role="dialog"
            aria-modal="true"
            aria-label={shot.label}
          >
            <button
              type="button"
              onClick={() => setZoom(false)}
              aria-label="Đóng"
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-h-full w-full max-w-[1600px] overflow-auto rounded-xl"
            >
              <Image src={shot.full ?? shot.src} alt={shot.label} width={1920} height={1040} sizes="100vw" className="h-auto w-full" />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
