import { Image } from "@/components/ui/Image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  LoaderCircle,
  AtSign,
  CheckCircle2,
  Clapperboard,
  Combine,
  Cpu,
  Globe,
  ImagePlus,
  LayoutGrid,
  ListRestart,
  Mic,
  Music,
  Search,
  ShieldCheck,
  Shuffle,
  SkipForward,
  UserRound,
  Users,
  Volume2,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/fx/TiltCard";
import { useTicker } from "@/hooks/useTicker";
import { engines, platforms } from "@/lib/data";
import { cn } from "@/lib/cn";

function Card({ className, delay = 0, children }: { className?: string; delay?: number; children: React.ReactNode }) {
  return (
    <TiltCard
      wrapperClassName={className}
      max={4}
      initial={{ opacity: 0, y: 36, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className="glow-border group relative h-full overflow-hidden rounded-3xl bg-panel p-6 shadow-panel transition-shadow duration-500 hover:shadow-[0_0_0_1px_rgba(0,240,255,0.25),0_30px_80px_-30px_rgba(0,240,255,0.45)] sm:p-8"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-cyan-brand/10 blur-3xl transition-transform duration-700 group-hover:scale-150" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-neon-pink/0 blur-3xl transition-colors duration-700 group-hover:bg-neon-pink/10" />
      {children}
    </TiltCard>
  );
}

function CardHead({ icon: Icon, index, title, desc }: { icon: typeof Cpu; index: string; title: string; desc: string }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient-soft ring-1 ring-cyan-brand/30 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">
          <Icon className="h-5 w-5 text-cyan-glow" />
        </span>
        <span className="font-mono text-xs text-slate-500">{index}</span>
      </div>
      <h3 className="mt-5 text-xl font-bold text-white sm:text-2xl">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base">{desc}</p>
    </div>
  );
}

const Chip = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={cn("rounded-md bg-white/[0.05] px-2 py-1 text-[11px] text-slate-300", className)}>{children}</span>
);

const FLOW_STEPS = ["Prompt · cách nhau 1 dòng trống", "Tạo & chạy", "Ảnh / video tự lưu vào Thư viện"];
const RATIOS = ["9:16", "16:9", "1:1", "4:3", "3:4", "21:9"];
const ECO = [
  { Icon: UserRound, t: "Tư liệu", d: "Nhân vật, người mẫu, mẫu prompt" },
  { Icon: Clapperboard, t: "Kịch bản", d: "Phân cảnh → video có giọng đọc" },
  { Icon: Search, t: "LadiPage", d: "Link → 3 kịch bản cho Muse" },
  { Icon: LayoutGrid, t: "Thư viện", d: "Ghép video, lưu Tư liệu" },
  { Icon: Volume2, t: "Đăng FB Reels", d: "Chọn video, caption, đăng" },
];
const ACC_STATES = [
  ["Đang chạy", "1/1 rảnh", "0/0", "0/0"],
  ["Đang chạy", "Đang chạy", "0/0", "0/0"],
  ["1/1 rảnh", "Đang chạy", "0/0", "0/0"],
  ["1/1 rảnh", "1/1 rảnh", "0/0", "0/0"],
];

export function BentoFeatures() {
  const { ref, tick } = useTicker<HTMLElement>(1700);

  return (
    <section ref={ref} id="tinh-nang" className="relative py-24">
      <div className="container">
        <SectionHeading
          eyebrow="Tính năng cốt lõi"
          title={["Một app thay cả ", { text: "team sản xuất content", className: "text-gradient" }]}
          description="Từ prompt, kịch bản hay một link LadiPage đến video thành phẩm và lên sóng Reels — mọi khâu gom về một Studio duy nhất."
        />

        <div className="mt-16 grid gap-5 lg:grid-cols-6">
          {/* 1. Đa engine */}
          <Card className="lg:col-span-4">
            <CardHead
              icon={Cpu}
              index="01"
              title="Đa Engine AI Đỉnh Cao"
              desc="Muse, Google Flow và Seedance tích hợp sẵn trong Studio. Tạo ảnh & tạo video hàng loạt từ danh sách prompt — đổi engine chỉ một click, các tuỳ chọn tự đổi theo đúng engine."
            />
            <div className="relative mt-7 grid gap-3 sm:grid-cols-3">
              {engines.map((e, i) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  style={
                    tick % 3 === i
                      ? { borderColor: `${e.hex}99`, boxShadow: `0 0 0 1px ${e.hex}55, 0 12px 40px -12px ${e.hex}88` }
                      : undefined
                  }
                  className="relative flex flex-col rounded-2xl border border-white/[0.07] bg-ink/60 p-4 transition-[border-color,box-shadow] duration-500"
                >
                  <p className="flex items-center gap-2 font-semibold text-white">
                    <span className={cn("h-2.5 w-2.5 rounded-full", e.dot, tick % 3 === i && "animate-pulse")} /> {e.name}
                    <AnimatePresence>
                      {tick % 3 === i ? (
                        <motion.span
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 6 }}
                          className={cn("ml-auto flex items-center gap-1 rounded-full px-1.5 py-px text-[10px] font-semibold ring-1 ring-current", e.text)}
                        >
                          <LoaderCircle className="h-2.5 w-2.5 animate-spin" /> Đang tạo
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                  </p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{e.tagline}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {e.modes.map((m) => (
                      <Chip key={m}>{m}</Chip>
                    ))}
                  </div>
                  <ul className="mt-3 space-y-1 border-t border-white/[0.06] pt-3">
                    {e.specs.map((s) => (
                      <li key={s} className={cn("text-[11px] font-medium", e.text)}>
                        • {s}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
            {/* Quy trình: chấm sáng chạy từ prompt tới thành phẩm */}
            <div className="relative mt-4 overflow-hidden rounded-2xl border border-dashed border-white/10 px-4 py-3 text-xs text-slate-400">
              <div className="relative flex flex-wrap items-center gap-2">
                {FLOW_STEPS.map((step, i) => (
                  <span key={step} className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-md px-2 py-1 transition-all duration-500",
                        i === FLOW_STEPS.length - 1 ? "font-semibold text-white ring-1 ring-cyan-brand/30" : "text-slate-300",
                        tick % 3 === i ? "bg-brand-gradient-soft text-white shadow-glow-sm ring-1 ring-cyan-glow/50" : "bg-white/[0.05]",
                        i === 0 && "font-mono",
                      )}
                    >
                      {step}
                    </span>
                    {i < FLOW_STEPS.length - 1 ? <ArrowRight className={cn("h-3.5 w-3.5", i === 0 ? "text-cyan-brand" : "text-neon-pink")} /> : null}
                  </span>
                ))}
              </div>
              <motion.span
                aria-hidden
                className="absolute bottom-0 left-0 h-px w-24 bg-gradient-to-r from-transparent via-cyan-glow to-transparent"
                animate={{ x: ["-100%", "900%"] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </Card>

          {/* 2. Đồng nhất nhân vật */}
          <Card className="lg:col-span-2" delay={0.1}>
            <CardHead
              icon={UserRound}
              index="02"
              title="Giữ Đồng Nhất Nhân Vật & Sản Phẩm"
              desc="Một gương mặt, một bao bì — xuyên suốt cả trăm video."
            />
            <div className="relative mt-5 grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((n, i) => {
                const on = tick % 5 === i;
                return (
                  <motion.div
                    key={n}
                    animate={{ y: on ? -4 : 0, scale: on ? 1.06 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={cn(
                      "relative aspect-[3/4] overflow-hidden rounded-md ring-1 transition-shadow duration-500",
                      on ? "z-10 ring-2 ring-cyan-glow shadow-[0_0_18px_-2px_rgba(0,240,255,0.8)]" : "ring-white/10",
                    )}
                  >
                    <Image src={`/samples/video-${n}.webp`} alt="" fill sizes="80px" className="object-cover" />
                    {on ? (
                      <>
                        <motion.span
                          initial={{ y: "-100%" }}
                          animate={{ y: "100%" }}
                          transition={{ duration: 1.2, ease: "linear" }}
                          className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-transparent via-cyan-glow/40 to-transparent"
                        />
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-0.5 top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-cyan-glow text-[8px] font-bold text-ink"
                        >
                          ✓
                        </motion.span>
                      </>
                    ) : null}
                  </motion.div>
                );
              })}
            </div>
            <p className="relative mt-1.5 text-[11px] text-slate-500">5 video khác nhau, cùng một nhân vật — tạo bằng Muse.</p>
            <ul className="relative mt-5 space-y-2.5 text-sm">
              {[
                { Icon: AtSign, t: "Nhân vật @tên", d: "Prompt có tên nhân vật tự gắn ảnh" },
                { Icon: UserRound, t: "Người mẫu cố định", d: "Gắn vào mọi task (tối đa 3 ảnh)" },
                { Icon: Shuffle, t: "Ảnh luân phiên", d: "Mỗi task lấy 1 ảnh kế tiếp, nạp cả Folder" },
                { Icon: ImagePlus, t: "Ảnh tham chiếu & Ảnh đầu/cuối", d: "Tối đa 6 ảnh / prompt" },
              ].map(({ Icon, t, d }) => (
                <li key={t} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-neon-pink" />
                  <span>
                    <span className="font-semibold text-slate-100">{t}</span>
                    <span className="block text-xs text-slate-500">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="relative mt-5 flex flex-wrap gap-1.5">
              {RATIOS.map((r, i) => (
                <span
                  key={r}
                  className={cn(
                    "relative rounded-md border px-2 py-0.5 font-mono text-[11px] transition-colors duration-500",
                    tick % RATIOS.length === i ? "border-cyan-glow text-ink" : "border-cyan-brand/25 bg-cyan-brand/10 text-cyan-glow",
                  )}
                >
                  {tick % RATIOS.length === i ? (
                    <motion.span layoutId="bento-ratio" className="absolute inset-0 rounded-[5px] bg-cyan-glow" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                  ) : null}
                  <span className="relative">{r}</span>
                </span>
              ))}
            </div>
          </Card>

          {/* 3. Đa tài khoản & hàng đợi */}
          <Card className="lg:col-span-2" delay={0.1}>
            <CardHead
              icon={Users}
              index="03"
              title="Đa Tài Khoản & Hàng Đợi Thông Minh"
              desc="Cắm càng nhiều tài khoản, xưởng chạy càng nhanh."
            />
            <div className="relative mt-6 grid grid-cols-2 gap-2">
              {platforms.map((p, i) => (
                <div
                  key={p.name}
                  className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-ink/60 px-3 py-2 text-xs"
                >
                  <span className="flex items-center gap-2 font-semibold text-slate-200">
                    <span className={cn("h-2 w-2 rounded-full", p.dot)} /> {p.name}
                  </span>
                  <motion.span
                    key={ACC_STATES[tick % 4][i]}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px]",
                      ACC_STATES[tick % 4][i] === "Đang chạy" ? "bg-violet-500/15 text-violet-300" : "bg-white/[0.06] text-slate-400",
                    )}
                  >
                    {ACC_STATES[tick % 4][i] === "Đang chạy" ? <span className="h-1 w-1 animate-pulse rounded-full bg-current" /> : null}
                    {ACC_STATES[tick % 4][i]}
                  </motion.span>
                </div>
              ))}
            </div>
            <div className="relative mt-3 flex items-center gap-2 rounded-lg border border-white/[0.06] bg-ink/60 p-2 text-[11px] text-slate-400">
              Chia việc:
              {["Luân phiên", "Lần lượt"].map((m, i) => {
                const on = Math.floor(tick / 3) % 2 === i;
                return (
                  <span key={m} className={cn("relative rounded-md px-2 py-0.5 font-semibold transition-colors", on ? "text-cyan-glow" : "text-slate-400")}>
                    {on ? (
                      <motion.span
                        layoutId="bento-split"
                        className="absolute inset-0 rounded-md border border-cyan-glow/50 bg-cyan-glow/10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    ) : null}
                    <span className="relative">{m}</span>
                  </span>
                );
              })}
            </div>
            <ul className="relative mt-5 space-y-2 text-sm text-slate-400">
              {[
                { Icon: SkipForward, t: "Tự chuyển tài khoản khi chạm Daily Limit" },
                { Icon: ShieldCheck, t: "Tự tối ưu prompt khi dính Safety Filter" },
                { Icon: Globe, t: "Proxy riêng từng tài khoản" },
                { Icon: ListRestart, t: "Chọn lỗi → Chạy lại lỗi một chạm" },
                { Icon: Combine, t: "Ghép video ngay trong hàng đợi" },
              ].map(({ Icon, t }, i) => (
                <li
                  key={t}
                  className={cn("flex items-center gap-2.5 transition-colors duration-500", tick % 5 === i && "text-white")}
                >
                  <Icon className={cn("h-4 w-4 shrink-0 transition-transform duration-500", tick % 5 === i ? "scale-125 text-cyan-glow" : "text-cyan-brand")} /> {t}
                </li>
              ))}
            </ul>
          </Card>

          {/* 4. Hệ sinh thái */}
          <Card className="lg:col-span-4" delay={0.15}>
            <CardHead
              icon={LayoutGrid}
              index="04"
              title="Hệ Sinh Thái Khép Kín"
              desc="Tư liệu, Kịch bản, Thư viện ngay trong app. Dán link LadiPage để AI tự viết kịch bản bán hàng, rồi đăng thẳng thành phẩm lên Facebook Reels — từ ý tưởng tới chốt đơn, không rời MeAI."
            />
            <div className="relative mt-7 grid gap-3 sm:grid-cols-5">
              {/* đường nối các khâu + tiến độ theo khâu đang sáng (PC) */}
              <div className="pointer-events-none absolute left-[10%] right-[10%] top-[34px] hidden h-px bg-white/10 sm:block">
                <motion.div
                  className="h-full origin-left bg-brand-gradient shadow-[0_0_10px_rgba(0,240,255,0.8)]"
                  animate={{ scaleX: (tick % ECO.length) / (ECO.length - 1) }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              {ECO.map(({ Icon, t, d }, i, arr) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className={cn(
                    "relative flex items-center gap-3 rounded-2xl border bg-ink/80 p-3 transition-all duration-500 sm:flex-col sm:text-center",
                    i === arr.length - 1 ? "border-neon-pink/30 shadow-glow-pink" : "border-white/[0.07]",
                    i <= tick % arr.length && "border-cyan-glow/50",
                    i === tick % arr.length && "-translate-y-1 shadow-[0_10px_30px_-10px_rgba(0,240,255,0.7)]",
                  )}
                >
                  <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04]">
                    {i === tick % arr.length ? <span className="absolute inset-0 animate-ping rounded-xl bg-cyan-glow/25" /> : null}
                    <Icon className={cn("relative h-5 w-5", i === arr.length - 1 ? "text-neon-pink" : "text-cyan-glow")} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{t}</span>
                    <span className="block text-[11px] leading-4 text-slate-500">{d}</span>
                  </span>
                </motion.div>
              ))}
            </div>
            <div className="relative mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-white/[0.06] bg-ink/60 px-4 py-3 text-xs">
              <span className="font-semibold text-slate-300">Kịch bản:</span>
              <Chip className="inline-flex items-center gap-1.5">
                <Mic className="h-3 w-3 text-neon-pink" />
                Giọng đọc AI
                <span aria-hidden className="flex h-3 items-end gap-px">
                  {[0, 1, 2, 3, 4, 5].map((b) => (
                    <motion.span
                      key={b}
                      className="w-0.5 rounded-full bg-gradient-to-t from-cyan-glow to-neon-pink"
                      animate={{ height: [3, 6 + ((b * 5) % 7), 3] }}
                      transition={{ duration: 0.5 + b * 0.08, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ))}
                </span>
              </Chip>
              <Chip>Người dẫn · Nhân vật dẫn</Chip>
              <Chip>
                <Music className="mr-1 inline h-3 w-3 text-cyan-glow" />
                Ghép nhạc nền
              </Chip>
              <Chip>Tự ghép khi xong</Chip>
              <Chip>Mỗi ảnh sản phẩm ra 1 bộ video</Chip>
            </div>
            <div className="relative mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
              {["Thành phẩm lưu tại thư mục bạn chọn", "Page Access Token (Graph API v20)", "Caption chốt đơn kèm hashtag"].map(
                (t) => (
                  <span key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {t}
                  </span>
                ),
              )}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
