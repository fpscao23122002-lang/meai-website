"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
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
import { engines, platforms } from "@/lib/data";
import { cn } from "@/lib/cn";

function Card({ className, delay = 0, children }: { className?: string; delay?: number; children: React.ReactNode }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn("glow-border group relative overflow-hidden rounded-3xl bg-panel p-6 shadow-panel sm:p-8", className)}
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-cyan-brand/10 blur-3xl" />
      {children}
    </motion.article>
  );
}

function CardHead({ icon: Icon, index, title, desc }: { icon: typeof Cpu; index: string; title: string; desc: string }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient-soft ring-1 ring-cyan-brand/30">
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

export function BentoFeatures() {
  return (
    <section id="tinh-nang" className="relative py-24">
      <div className="container">
        <SectionHeading
          eyebrow="Tính năng cốt lõi"
          title={
            <>
              Một app thay cả <span className="text-gradient">team sản xuất content</span>
            </>
          }
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
                  className="flex flex-col rounded-2xl border border-white/[0.07] bg-ink/60 p-4"
                >
                  <p className="flex items-center gap-2 font-semibold text-white">
                    <span className={cn("h-2.5 w-2.5 rounded-full", e.dot)} /> {e.name}
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
            <div className="relative mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-white/10 px-4 py-3 text-xs text-slate-400">
              <Chip className="font-mono">Prompt · cách nhau 1 dòng trống</Chip>
              <ArrowRight className="h-3.5 w-3.5 text-cyan-brand" />
              <Chip>Tạo & chạy</Chip>
              <ArrowRight className="h-3.5 w-3.5 text-neon-pink" />
              <span className="rounded-md bg-brand-gradient-soft px-2 py-1 font-semibold text-white ring-1 ring-cyan-brand/30">
                Ảnh / video tự lưu vào Thư viện
              </span>
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
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="relative aspect-[3/4] overflow-hidden rounded-md ring-1 ring-white/10">
                  <Image src={`/samples/video-${n}.webp`} alt="" fill sizes="80px" className="object-cover" />
                </div>
              ))}
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
              {["9:16", "16:9", "1:1", "4:3", "3:4", "21:9"].map((r) => (
                <span
                  key={r}
                  className="rounded-md border border-cyan-brand/25 bg-cyan-brand/10 px-2 py-0.5 font-mono text-[11px] text-cyan-glow"
                >
                  {r}
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
                  <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-slate-400">
                    {i < 2 ? "1/1 rảnh" : "0/0"}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative mt-3 flex items-center gap-2 rounded-lg border border-white/[0.06] bg-ink/60 p-2 text-[11px] text-slate-400">
              Chia việc:
              <span className="rounded-md border border-cyan-glow/50 bg-cyan-glow/10 px-2 py-0.5 font-semibold text-cyan-glow">
                Luân phiên
              </span>
              <span className="px-1">Lần lượt</span>
            </div>
            <ul className="relative mt-5 space-y-2 text-sm text-slate-400">
              {[
                { Icon: SkipForward, t: "Tự chuyển tài khoản khi chạm Daily Limit" },
                { Icon: ShieldCheck, t: "Tự tối ưu prompt khi dính Safety Filter" },
                { Icon: Globe, t: "Proxy riêng từng tài khoản" },
                { Icon: ListRestart, t: "Chọn lỗi → Chạy lại lỗi một chạm" },
                { Icon: Combine, t: "Ghép video ngay trong hàng đợi" },
              ].map(({ Icon, t }) => (
                <li key={t} className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 shrink-0 text-cyan-brand" /> {t}
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
              {[
                { Icon: UserRound, t: "Tư liệu", d: "Nhân vật, người mẫu, mẫu prompt" },
                { Icon: Clapperboard, t: "Kịch bản", d: "Phân cảnh → video có giọng đọc" },
                { Icon: Search, t: "LadiPage", d: "Link → 3 kịch bản cho Muse" },
                { Icon: LayoutGrid, t: "Thư viện", d: "Ghép video, lưu Tư liệu" },
                { Icon: Volume2, t: "Đăng FB Reels", d: "Chọn video, caption, đăng" },
              ].map(({ Icon, t, d }, i, arr) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-ink/60 p-3 sm:flex-col sm:text-center",
                    i === arr.length - 1 && "border-neon-pink/30 shadow-glow-pink",
                  )}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04]">
                    <Icon className={cn("h-5 w-5", i === arr.length - 1 ? "text-neon-pink" : "text-cyan-glow")} />
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
              <Chip>
                <Mic className="mr-1 inline h-3 w-3 text-neon-pink" />
                Giọng đọc AI
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
