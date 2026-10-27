import { useEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowRight, CheckCircle2, HardDrive, PlayCircle, Sparkles, Users } from "lucide-react";
import { Link } from "@/components/ui/Link";
import { ButtonLink } from "@/components/ui/Button";
import { WindowsIcon } from "@/components/ui/WindowsIcon";
import { SplitText } from "@/components/fx/SplitText";
import { CountUp } from "@/components/fx/CountUp";
import { ZoomImage } from "@/components/fx/ZoomImage";
import { engines, screenSet } from "@/lib/data";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/cn";

const stats = [
  { value: "3", label: "Engine AI: Muse · Flow · Seedance" },
  { value: "4", label: "Nền tảng tài khoản (có Dola)" },
  { value: "6", label: "Ảnh tham chiếu / prompt" },
  { value: "4K", label: "Độ phân giải tối đa" },
];

/** Các điểm nóng trên ảnh Studio: rê để xem cận cảnh, hiển thị đúng tỉ lệ 1:1 với ảnh gốc nên chữ rõ nét */
const hotspots = [
  {
    id: "config",
    x: 10,
    y: 22,
    title: "Chọn engine & tuỳ chọn",
    desc: "Muse · Google Flow · Seedance, mỗi prompt cách nhau 1 dòng trống",
    img: { src: "/screens/detail-config.webp", w: 318, h: 560 },
    width: 318,
    card: "left-[calc(10%+28px)] top-[4%]",
  },
  {
    id: "queue",
    x: 40,
    y: 14,
    title: "Hàng đợi thông minh",
    desc: "Lọc trạng thái, Chọn lỗi, Chạy lại lỗi — tự chia cho tài khoản rảnh",
    img: { src: "/screens/detail-queue.webp", w: 710, h: 269 },
    width: 710,
    card: "left-[18%] top-[calc(14%+30px)]",
  },
  {
    id: "preview",
    x: 92,
    y: 22,
    title: "Xem trước thành phẩm",
    desc: "Mở file, Tạo lại, Chỉnh sửa prompt ngay tại chỗ",
    img: { src: "/screens/detail-preview.webp", w: 339, h: 550 },
    width: 339,
    card: "right-[calc(8%+28px)] top-[6%]",
  },
  {
    id: "topbar",
    x: 79,
    y: 1.4,
    title: "Điều khiển toàn xưởng",
    desc: "Tài khoản rảnh, Chạy tiếp, Dừng tất cả — chỉ một chạm",
    img: { src: "/screens/detail-topbar.webp", w: 653, h: 36 },
    width: 653,
    card: "right-[3%] top-[calc(1.4%+30px)]",
  },
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

function StudioShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const [active, setActive] = useState<string | null>(null);
  const [userTouched, setUserTouched] = useState(false);

  // Tự giới thiệu lần lượt từng khu vực khi người xem chưa tương tác
  useEffect(() => {
    if (!inView || userTouched) return;
    let i = 0;
    const start = window.setTimeout(() => setActive(hotspots[0].id), 1800);
    const id = window.setInterval(() => {
      i = (i + 1) % (hotspots.length + 1);
      setActive(i === hotspots.length ? null : hotspots[i].id);
    }, 3200);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(id);
    };
  }, [inView, userTouched]);

  return (
    <div ref={ref} className="relative">
      <div
        onPointerEnter={(e) => {
          // Người xem tự khám phá bằng kính lúp → dừng tự giới thiệu
          if (e.pointerType === "mouse" && !userTouched) {
            setUserTouched(true);
            setActive(null);
          }
        }}
        className="glow-border relative rounded-2xl bg-panel p-1.5 shadow-[0_40px_140px_-30px_rgba(0,240,255,0.4)] sm:p-2">
        <ZoomImage
          src="/screens/studio-muse-anh.webp"
          srcSet={screenSet("studio-muse-anh", 2558)}
          sizes="(min-width: 1280px) 1216px, 100vw"
          alt="Giao diện Studio của phần mềm MeAI: chọn engine Muse, nhập prompt, hàng đợi task và xem trước kết quả"
          w={2558}
          h={1384}
          priority
          className="rounded-xl"
        />

        {/* Điểm nóng (máy tính) */}
        <div className="pointer-events-none absolute inset-1.5 hidden sm:inset-2 md:block">
          {hotspots.map((h) => {
            const on = active === h.id;
            return (
              <div key={h.id}>
                <button
                  type="button"
                  className="pointer-events-auto absolute z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  onMouseEnter={() => {
                    setUserTouched(true);
                    setActive(h.id);
                  }}
                  onFocus={() => {
                    setUserTouched(true);
                    setActive(h.id);
                  }}
                  onMouseLeave={() => setActive(null)}
                  onBlur={() => setActive(null)}
                  aria-label={h.title}
                >
                  <span className="relative flex h-6 w-6 items-center justify-center">
                    <span className="absolute inset-0 animate-ping rounded-full bg-cyan-glow/50" />
                    <span
                      className={cn(
                        "relative flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-bold transition",
                        on ? "border-white bg-neon-pink text-white" : "border-cyan-glow bg-ink/90 text-cyan-glow",
                      )}
                    >
                      +
                    </span>
                  </span>
                </button>
                <AnimatePresence>
                  {on ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92, y: 8, filter: "blur(6px)" }}
                      animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
                      exit={{ opacity: 0, scale: 0.95, y: 4, filter: "blur(4px)" }}
                      transition={{ duration: 0.35, ease }}
                      className={cn(
                        "absolute z-20 overflow-hidden rounded-xl border border-cyan-glow/40 bg-ink/95 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.9),0_0_40px_-10px_rgba(0,240,255,0.5)] backdrop-blur",
                        h.card,
                      )}
                      style={{ width: h.width }}
                    >
                      <img src={h.img.src} alt={h.title} width={h.img.w} height={h.img.h} className="block h-auto w-full" />
                      <div className="border-t border-white/10 px-3 py-2">
                        <p className="text-xs font-bold text-white">{h.title}</p>
                        <p className="text-[11px] leading-4 text-slate-400">{h.desc}</p>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cận cảnh dạng băng trượt (điện thoại) */}
      <div className="-mx-4 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:hidden">
        {hotspots.map((h) => (
          <figure key={h.id} className="w-[78%] shrink-0 snap-center overflow-hidden rounded-xl border border-white/10 bg-panel">
            <div className="flex max-h-56 items-start justify-center overflow-hidden bg-ink">
              <img src={h.img.src} alt={h.title} width={h.img.w} height={h.img.h} loading="lazy" className="h-auto w-full object-contain object-top" />
            </div>
            <figcaption className="px-3 py-2">
              <p className="text-xs font-bold text-white">{h.title}</p>
              <p className="text-[11px] text-slate-400">{h.desc}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  const trackGlow = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--hx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--hy", `${e.clientY - r.top}px`);
  };

  return (
    <section onMouseMove={trackGlow} className="relative overflow-hidden pb-20 pt-32 sm:pt-36">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
        <Beams />
        <div className="absolute inset-0 bg-[radial-gradient(600px_circle_at_var(--hx,50%)_var(--hy,20%),rgba(0,240,255,0.08),transparent_60%)]" />
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-brand/15 blur-[120px]" />
        <div className="absolute right-[-10%] top-40 h-[420px] w-[520px] rounded-full bg-neon-pink/15 blur-[120px]" />
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
            <div className="absolute -inset-x-10 -inset-y-6 -z-10 animate-pulse-soft rounded-[40px] bg-brand-gradient opacity-20 blur-3xl" />
            <StudioShowcase />

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8, duration: 0.6 }}
              className="pointer-events-none absolute -left-4 top-[58%] hidden xl:block"
            >
              <div className="flex animate-float items-center gap-2 rounded-xl border border-cyan-glow/30 bg-ink/90 px-3 py-2 text-xs font-semibold text-cyan-glow shadow-glow-sm backdrop-blur">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-glow" /> Tài khoản: 2/2 rảnh
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2, duration: 0.6 }}
              className="pointer-events-none absolute -right-4 bottom-[18%] hidden xl:block"
            >
              <div
                style={{ animationDelay: "1.2s" }}
                className="flex animate-float items-center gap-2 rounded-xl border border-neon-pink/30 bg-ink/90 px-3 py-2 text-xs font-semibold text-pink-300 shadow-glow-pink backdrop-blur"
              >
                <CheckCircle2 className="h-4 w-4" /> Xong · tự lưu vào Thư viện
              </div>
            </motion.div>
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
