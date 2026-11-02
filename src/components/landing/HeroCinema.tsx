import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Pause, Play, PlayCircle, Sparkles } from "lucide-react";
import { Link } from "@/components/ui/Link";
import { ButtonLink } from "@/components/ui/Button";
import { WindowsIcon } from "@/components/ui/WindowsIcon";
import { SplitText } from "@/components/fx/SplitText";
import { engines } from "@/lib/data";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/cn";

/** Hai đoạn phim mở đầu (16:9) phát nối tiếp nhau, chuyển cảnh mờ dần và lặp vô hạn */
const CLIPS = [
  { src: "/videos/intro-1.mp4", poster: "/videos/intro-1.webp" },
  { src: "/videos/intro-2.mp4", poster: "/videos/intro-2.webp" },
];
/** Bắt đầu chuyển sang đoạn kế tiếp khi đoạn hiện tại còn chừng này giây */
const FADE = 1.1;

const stats = [
  { value: "3", label: "Engine AI tích hợp", sub: "Muse · Flow · Seedance" },
  { value: "∞", label: "Tài khoản & luồng", sub: "chạy song song" },
  { value: "6", label: "Ảnh tham chiếu", sub: "giữ đồng nhất nhân vật" },
  { value: "4K", label: "Độ phân giải tối đa", sub: "ảnh & video" },
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
    <span className="relative inline-flex h-[1.5em] min-w-[9.5em] items-center overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={e.id}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
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

/**
 * Nền phim: 2 thẻ <video> chồng lên nhau, mỗi thẻ giữ 1 đoạn. Khi đoạn đang chiếu sắp hết, đoạn kia bắt đầu từ đầu và
 * hiện dần lên (cross-fade) → nối mạch liên tục, không giật khi lặp. Tự dừng khi cuộn khỏi màn hình / ẩn tab
 * (tiết kiệm pin, giữ FPS), tôn trọng "Giảm chuyển động" của hệ điều hành và có nút tạm dừng.
 */
function CinemaBackground({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const zoom = useRef<(HTMLDivElement | null)[]>([]);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState<boolean[]>([false, false]);
  const [paused, setPaused] = useState(false);
  const activeRef = useRef(0);
  const pausedRef = useRef(false);
  const visibleRef = useRef(true);
  const reduce = useRef(typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  // Phóng chậm (Ken Burns) cho đoạn đang chiếu — chạy bằng CSS trên compositor
  const restartZoom = (i: number) => {
    const el = zoom.current[i];
    if (!el || reduce.current) return;
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "hero-zoom 11s linear forwards";
  };

  const playClip = (i: number) => {
    const v = vids.current[i];
    if (!v) return;
    if (v.preload !== "auto") v.preload = "auto";
    void v.play().catch(() => {
      /* trình duyệt chặn tự phát (VD: chế độ tiết kiệm pin) → giữ ảnh poster */
    });
  };

  const switchTo = (i: number) => {
    const v = vids.current[i];
    if (v) v.currentTime = 0;
    activeRef.current = i;
    setActive(i);
    restartZoom(i);
    if (!pausedRef.current && visibleRef.current) playClip(i);
  };

  // Theo dõi tiến độ đoạn đang chiếu (sự kiện timeupdate ~4 lần/giây, không chạy vòng lặp mỗi khung hình):
  // chuyển cảnh trước khi hết đoạn, cập nhật thanh tiến độ bằng cách ghi thẳng vào DOM
  const onTime = (i: number) => {
    const v = vids.current[i];
    if (!v || i !== activeRef.current || !v.duration) return;
    const bar = bars.current[i];
    if (bar) bar.style.transform = `scaleX(${Math.min(1, (v.currentTime + 0.25) / v.duration)})`;
    if (v.duration - v.currentTime <= FADE) switchTo((i + 1) % CLIPS.length);
  };

  // Đoạn vừa bị thay: dừng hẳn sau khi đã mờ đi, đưa về đầu cho lần sau
  useEffect(() => {
    const prev = (active + 1) % CLIPS.length;
    const t = window.setTimeout(() => {
      const v = vids.current[prev];
      if (v && prev !== activeRef.current) {
        v.pause();
        v.currentTime = 0;
      }
      const bar = bars.current[prev];
      if (bar) bar.style.transform = "scaleX(0)";
    }, FADE * 1000 + 200);
    return () => window.clearTimeout(t);
  }, [active]);

  // Khởi động + tự dừng khi ra khỏi màn hình / ẩn tab
  useEffect(() => {
    if (reduce.current) {
      pausedRef.current = true;
      setPaused(true);
    } else {
      restartZoom(0);
      playClip(0);
    }
    const sync = () => {
      const v = vids.current[activeRef.current];
      if (!v) return;
      if (visibleRef.current && !pausedRef.current && !document.hidden) playClip(activeRef.current);
      else v.pause();
    };
    const io = new IntersectionObserver(([e]) => {
      visibleRef.current = e.isIntersecting;
      sync();
    });
    if (sectionRef.current) io.observe(sectionRef.current);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePause = () => {
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    const v = vids.current[activeRef.current];
    const z = zoom.current[activeRef.current];
    if (z) z.style.animationPlayState = next ? "paused" : "running";
    if (next) v?.pause();
    else playClip(activeRef.current);
  };

  return (
    <>
      <div aria-hidden className="absolute inset-0 overflow-hidden bg-ink">
        {CLIPS.map((c, i) => (
          <div
            key={c.src}
            className={cn("absolute inset-0 transition-opacity ease-linear", active === i ? "opacity-100" : "opacity-0")}
            style={{ transitionDuration: `${FADE}s` }}
          >
            <div
              ref={(el) => {
                zoom.current[i] = el;
              }}
              className="absolute inset-0 will-change-transform"
            >
              {/* Ảnh poster hiện ngay, video mờ dần lên khi đã sẵn sàng phát */}
              <img src={c.poster} alt="" className="absolute inset-0 h-full w-full object-cover" fetchPriority={i === 0 ? "high" : "low"} />
              <video
                ref={(el) => {
                  vids.current[i] = el;
                }}
                src={c.src}
                muted
                playsInline
                preload={i === 0 ? "auto" : "metadata"}
                onTimeUpdate={() => onTime(i)}
                onPlaying={() => setReady((r) => (r[i] ? r : r.map((x, k) => (k === i ? true : x))))}
                className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-700", ready[i] ? "opacity-100" : "opacity-0")}
              />
            </div>
          </div>
        ))}
        {/* Lớp phủ: giữ chữ dễ đọc, hoà vào nền trang, tông màu thương hiệu */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/35 to-transparent max-lg:bg-ink/45" />
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-ink via-ink/70 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(11,11,20,0.65))]" />
        <div className="absolute -bottom-32 -left-24 h-[420px] w-[620px] bg-[radial-gradient(closest-side,rgba(0,240,255,0.16),transparent)]" />
        <div className="absolute -bottom-40 right-0 h-[420px] w-[620px] bg-[radial-gradient(closest-side,rgba(252,49,153,0.14),transparent)]" />
      </div>

      {/* Điều khiển phim: đoạn đang chiếu + tạm dừng */}
      <div className="absolute bottom-5 right-4 z-10 flex items-center gap-3 sm:bottom-7 sm:right-6 lg:right-8">
        <div className="flex items-center gap-1.5">
          {CLIPS.map((c, i) => (
            <span key={c.src} className="relative h-1 w-8 overflow-hidden rounded-full bg-white/20 sm:w-12">
              <span
                ref={(el) => {
                  bars.current[i] = el;
                }}
                className={cn(
                  "absolute inset-0 origin-left scale-x-0 rounded-full transition-transform duration-300 ease-linear",
                  active === i ? "bg-cyan-glow" : "bg-white/60",
                )}
              />
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={togglePause}
          aria-label={paused ? "Phát phim nền" : "Tạm dừng phim nền"}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white/90 transition hover:bg-black/75"
        >
          {paused ? <Play className="h-4 w-4 fill-current" /> : <Pause className="h-4 w-4 fill-current" />}
        </button>
      </div>
    </>
  );
}

export function HeroCinema() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section ref={ref} className="relative isolate flex min-h-[640px] items-end overflow-hidden pb-24 pt-28 sm:pb-28 [min-height:100svh]">
      <CinemaBackground sectionRef={ref} />

      <div className="container relative z-10">
        <div className="grid items-end gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
          <div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
              <Link
                href="/dashboard#changelog"
                className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/55 px-4 py-1.5 text-xs font-medium text-slate-200 transition hover:border-cyan-glow/50 hover:text-white"
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

            <h1 className="mt-6 text-balance text-[2.6rem] font-extrabold leading-[1.05] tracking-tight text-white [text-shadow:0_4px_30px_rgba(0,0,0,0.5)] sm:text-6xl lg:text-7xl">
              <SplitText inView={false} delay={0.1} parts={[{ text: "MeAI Studio", className: "text-gradient" }]} className="block" />
              <SplitText inView={false} delay={0.25} stagger={0.05} parts={["Xưởng video AI hàng loạt"]} className="block" />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75, ease }}
              className="mt-5 flex flex-wrap items-center gap-x-2 text-lg font-medium text-slate-200 sm:text-xl"
            >
              Tạo ảnh & video theo lô trên <RotatingEngine />
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.85, ease }}
              className="mt-3 max-w-xl text-pretty leading-7 text-slate-300"
            >
              Dán danh sách prompt, bấm <strong className="text-white">Tạo &amp; chạy</strong> — nhiều tài khoản cùng làm việc, thành phẩm
              về thẳng máy bạn và lên Facebook Reels trong một chạm.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1, ease }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <ButtonLink href="/tai-ve" size="lg" className="w-full sm:w-auto">
                <WindowsIcon className="h-5 w-5" />
                Tải MeAI cho Windows
              </ButtonLink>
              <ButtonLink href="#demo" variant="outline" size="lg" className="w-full bg-black/55 sm:w-auto">
                <PlayCircle className="h-5 w-5 text-cyan-glow" />
                Bấm thử Studio ngay
              </ButtonLink>
            </motion.div>
          </div>

          {/* Bảng thông số kính mờ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease }}
            className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]"
          >
            {/* Nền mờ đặc thay cho backdrop-blur: kính mờ trên video đang phát rất tốn GPU */}
            {stats.map((s) => (
              <div key={s.label} className="bg-ink/80 p-4 sm:p-6">
                <p className="text-gradient text-3xl font-extrabold tabular-nums sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-sm font-semibold text-white">{s.label}</p>
                <p className="text-xs text-slate-400">{s.sub}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <a
        href="#studio"
        aria-label="Cuộn xuống"
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-white sm:flex"
      >
        Khám phá
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </a>
    </section>
  );
}
