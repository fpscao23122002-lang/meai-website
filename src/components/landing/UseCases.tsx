import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clapperboard, Film, Play, ShoppingBag, Sparkles, Upload } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { trackSpotlight } from "@/components/fx/spotlight";
import { cn } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;

type UseCase = {
  tag: string;
  title: string;
  desc: string;
  points: string[];
  fits: string[];
  Visual: () => ReactNode;
};

/* ------------------------------------------------------------------ */
/* Minh hoạ dựng bằng code (luôn nét, tự co giãn theo màn hình)          */
/* ------------------------------------------------------------------ */

/** Một nhân vật, một sản phẩm → loạt biến thể để test quảng cáo */
function UgcVisual() {
  const variants = [
    { src: "/samples/video-3.webp", hook: "Áo này mặc 3 năm chưa xù!", tag: "A" },
    { src: "/samples/video-5.webp", hook: "Freeship hôm nay thôi nha", tag: "B" },
    { src: "/samples/video-1.webp", hook: "Chọn size thế nào cho chuẩn?", tag: "C" },
  ];
  return (
    <div className="flex items-end justify-center gap-3 sm:gap-4">
      {variants.map((v, i) => (
        <motion.div
          key={v.tag}
          initial={{ opacity: 0, y: 40, rotate: (i - 1) * 6 }}
          whileInView={{ opacity: 1, y: i === 1 ? -14 : 0, rotate: (i - 1) * 4 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.15 + i * 0.12, ease }}
          className={cn(
            "relative aspect-[9/16] w-[30%] max-w-[150px] overflow-hidden rounded-2xl bg-black ring-1",
            i === 1 ? "ring-cyan-glow/60 shadow-glow" : "ring-white/10",
          )}
        >
          <img src={v.src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
          <span className="absolute left-1.5 top-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-cyan-glow">
            Biến thể {v.tag}
          </span>
          <p className="absolute inset-x-1.5 top-7 text-center text-[9px] font-bold leading-tight text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.9)] sm:text-[10px]">
            {v.hook}
          </p>
          <span className="absolute inset-0 m-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/40">
            <Play className="h-3.5 w-3.5 fill-white text-white" />
          </span>
          <span className="absolute inset-x-1.5 bottom-1.5 flex items-center justify-between text-[8px] text-white/80">
            <span>Muse · 9:16</span>
            <span className="font-mono">0:0{6 + i}</span>
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/** Kịch bản → nhiều cảnh nối liền → một file phim */
function FilmVisual() {
  const scenes = [
    { src: "/samples/video-2.webp", t: "Cảnh 1 · Mở đầu" },
    { src: "/samples/video-4.webp", t: "Cảnh 2 · Cao trào" },
    { src: "/samples/video-1.webp", t: "Cảnh 3 · Kết" },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {scenes.map((s, i) => (
          <motion.div
            key={s.t}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.15 + i * 0.15, ease }}
            className="relative"
          >
            <div className="relative aspect-video overflow-hidden rounded-xl ring-1 ring-white/10">
              <img src={s.src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute bottom-1 left-1.5 text-[9px] font-semibold text-white sm:text-[10px]">{s.t}</span>
            </div>
            {i < scenes.length - 1 ? (
              <span className="absolute -right-2 top-1/2 z-10 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full bg-brand-gradient text-[9px] font-bold text-white shadow-glow-sm sm:-right-2.5 sm:h-5 sm:w-5">
                +
              </span>
            ) : null}
          </motion.div>
        ))}
      </div>
      {/* Thanh dựng phim: các cảnh nối thành một file */}
      <div className="rounded-xl border border-white/[0.08] bg-black/40 p-3">
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Film className="h-3.5 w-3.5 text-cyan-glow" /> Ghép video · 3 cảnh
          </span>
          <span className="font-mono text-white">phim-tap-01.mp4</span>
        </div>
        <div className="mt-2 flex h-6 gap-1 overflow-hidden rounded-md">
          {["bg-cyan-brand/70", "bg-violet-500/70", "bg-neon-pink/70"].map((c, i) => (
            <motion.span
              key={c}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 + i * 0.25, ease }}
              className={cn("h-full flex-1 origin-left rounded-sm", c)}
            />
          ))}
        </div>
        <div className="mt-2 flex h-3 items-end gap-px">
          {Array.from({ length: 48 }).map((_, i) => (
            <span key={i} className="flex-1 rounded-full bg-white/25" style={{ height: `${30 + ((i * 37) % 70)}%` }} />
          ))}
        </div>
        <p className="mt-1.5 text-[10px] text-slate-500">Giọng đọc AI + nhạc nền · xuất 1 file duy nhất</p>
      </div>
    </div>
  );
}

/** Danh sách sản phẩm → hàng đợi đa tài khoản → đăng Reels */
function AffiliateVisual() {
  const rows = [
    { p: "Áo thun cotton nam form rộng", acc: "TK1", done: true },
    { p: "Nồi chiên không dầu 6L", acc: "TK2", done: true },
    { p: "Serum cấp ẩm cho da khô", acc: "TK3", done: false },
    { p: "Giày chạy bộ đế êm", acc: "TK1", done: false },
  ];
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-3 sm:p-4">
      <div className="flex items-center justify-between text-[11px]">
        <span className="flex items-center gap-1.5 font-semibold text-white">
          <ShoppingBag className="h-3.5 w-3.5 text-neon-pink" /> 24 sản phẩm · hàng đợi
        </span>
        <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">3 tài khoản chạy song song</span>
      </div>
      <ul className="mt-3 space-y-2">
        {rows.map((r, i) => (
          <motion.li
            key={r.p}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease }}
            className="flex items-center gap-2 rounded-lg bg-white/[0.03] px-2.5 py-2"
          >
            <span className="rounded bg-cyan-brand/15 px-1.5 py-0.5 font-mono text-[9px] font-bold text-cyan-glow">{r.acc}</span>
            <span className="min-w-0 flex-1 truncate text-[11px] text-slate-200">{r.p}</span>
            {r.done ? (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-300">
                <CheckCircle2 className="h-3 w-3" /> Xong
              </span>
            ) : (
              <span className="relative h-1.5 w-14 overflow-hidden rounded-full bg-white/10">
                <motion.span
                  initial={{ scaleX: 0.1 }}
                  whileInView={{ scaleX: 0.75 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, delay: 0.5 + i * 0.1, ease }}
                  className="absolute inset-0 origin-left rounded-full bg-brand-gradient"
                />
              </span>
            )}
          </motion.li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between rounded-lg border border-neon-pink/25 bg-neon-pink/10 px-2.5 py-2 text-[10px]">
        <span className="flex items-center gap-1.5 text-pink-200">
          <Upload className="h-3.5 w-3.5" /> Đăng FB Reels kèm caption chốt đơn
        </span>
        <span className="font-semibold text-white">12 video sẵn sàng đăng</span>
      </div>
    </div>
  );
}

const cases: UseCase[] = [
  {
    tag: "UGC · Dropship & POD",
    title: "Video UGC, review sản phẩm",
    desc: "Nhân vật AI cầm sản phẩm, nói đúng nỗi đau của khách — không cần thuê người quay hay chờ mẫu về. Mỗi sản phẩm có ngay một loạt video để test.",
    points: [
      "Một sản phẩm ra nhiều biến thể hook/góc quay để test Ads, tìm creative thắng",
      "Giữ nguyên gương mặt nhân vật & sản phẩm nhờ Tư liệu, Người mẫu cố định",
      "Làm số lượng lớn để kéo traffic tự nhiên (organic) mỗi ngày",
    ],
    fits: ["TikTok Ads", "Facebook Ads", "Reels", "Organic"],
    Visual: UgcVisual,
  },
  {
    tag: "Phim AI · Xây kênh",
    title: "Làm phim AI ngắn để xây kênh",
    desc: "Viết kịch bản theo phân cảnh, MeAI dựng từng cảnh với nhân vật nhất quán rồi ghép thành một tập hoàn chỉnh có giọng đọc và nhạc nền.",
    points: [
      "Kịch bản phân cảnh → video có giọng đọc, người dẫn, nhạc nền",
      "Ảnh đầu / Ảnh cuối (Flow, Seedance) để nối mạch cảnh mượt hơn",
      "Thư viện: ghép nhiều cảnh thành một file, lưu lại để làm tập sau",
    ],
    fits: ["YouTube", "TikTok", "Facebook Reels"],
    Visual: FilmVisual,
  },
  {
    tag: "Affiliate",
    title: "Video affiliate TikTok, Shopee",
    desc: "Affiliate thắng ở số lượng và tốc độ bắt trend. Đổ cả danh sách sản phẩm hoặc dán link LadiPage, hàng đợi chia cho nhiều tài khoản chạy suốt đêm.",
    points: [
      "LadiPage → 3 kịch bản bán hàng tự sinh cho mỗi sản phẩm",
      "Hết hạn mức tự chuyển tài khoản, dính bộ lọc tự tối ưu prompt",
      "Lưu prompt ra đơn làm mẫu — nhân bản cho sản phẩm tiếp theo",
    ],
    fits: ["TikTok Shop", "Shopee Video", "Affiliate", "Reels"],
    Visual: AffiliateVisual,
  },
];

export function UseCases() {
  return (
    <section id="ung-dung" className="relative scroll-mt-20 py-24">
      <div className="container">
        <SectionHeading
          eyebrow="Ứng dụng"
          tone="pink"
          title={["Một xưởng video ", { text: "cho mọi kiểu kiếm tiền", className: "text-gradient" }]}
          description="Bạn lo ý tưởng và chốt đơn — phần sản xuất hàng chục, hàng trăm video mỗi ngày để MeAI chạy."
        />

        <div className="mt-16 space-y-8">
          {cases.map((c, i) => (
            <motion.article
              key={c.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease }}
              onMouseMove={trackSpotlight}
              className="spotlight glow-border grid items-center gap-8 overflow-hidden rounded-3xl bg-panel p-5 shadow-panel sm:p-8 lg:grid-cols-2 lg:gap-12"
            >
              <div className={cn("relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-brand/10 via-ink to-neon-pink/10 p-5 sm:p-8", i % 2 === 1 && "lg:order-2")}>
                <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2 py-0.5 font-mono text-[10px] font-bold text-white ring-1 ring-white/10">
                  0{i + 1}
                </span>
                <c.Visual />
              </div>
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-glow">
                  {i === 1 ? <Clapperboard className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                  {c.tag}
                </p>
                <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{c.title}</h3>
                <p className="mt-4 leading-7 text-slate-400">{c.desc}</p>
                <ul className="mt-5 space-y-2.5">
                  {c.points.map((p, k) => (
                    <motion.li
                      key={p}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + k * 0.08 }}
                      className="flex gap-2.5 text-sm text-slate-300"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-glow" />
                      {p}
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Phù hợp</span>
                  {c.fits.map((f) => (
                    <span key={f} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-300">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
