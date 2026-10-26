"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Combine,
  Cpu,
  FolderKanban,
  ImagePlus,
  LayoutTemplate,
  Library,
  ListOrdered,
  RefreshCw,
  ScrollText,
  Send,
  Shuffle,
  UserRound,
  Users,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { aspectRatios, engines } from "@/lib/data";
import { cn } from "@/lib/cn";

function Card({ className, delay = 0, children }: { className?: string; delay?: number; children: React.ReactNode }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className={cn(
        "glow-border group relative overflow-hidden rounded-3xl bg-panel p-6 shadow-panel sm:p-8",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-cyan-brand/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100 sm:opacity-60" />
      {children}
    </motion.article>
  );
}

function CardHead({
  icon: Icon,
  index,
  title,
  desc,
}: {
  icon: typeof Cpu;
  index: string;
  title: string;
  desc: string;
}) {
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
          description="Từ prompt đến video thành phẩm và lên sóng Reels — mọi khâu được gom về một Studio duy nhất. Không còn mở 20 tab, không còn copy-paste thủ công."
        />

        <div className="mt-16 grid gap-5 lg:grid-cols-6">
          {/* 1. Đa engine */}
          <Card className="lg:col-span-4">
            <CardHead
              icon={Cpu}
              index="01"
              title="Đa Engine AI Đỉnh Cao"
              desc="Tích hợp sẵn Muse, Google Flow và Seedance. Tạo ảnh & tạo video hàng loạt từ danh sách prompt — đổi engine chỉ bằng một cú click, không cần đổi workflow."
            />
            <div className="relative mt-7 grid gap-3 sm:grid-cols-3">
              {engines.map((e, i) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  className="rounded-2xl border border-white/[0.07] bg-[#0D1220] p-4"
                >
                  <div className={cn("h-1.5 w-12 rounded-full bg-gradient-to-r", e.color)} />
                  <p className="mt-3 font-semibold text-white">{e.name}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{e.tagline}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {e.modes.map((m) => (
                      <span key={m} className="rounded-md bg-white/[0.05] px-2 py-0.5 text-[11px] text-slate-300">
                        {m}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="relative mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-white/10 px-4 py-3 text-xs text-slate-400">
              <span className="rounded-md bg-white/[0.05] px-2 py-1 font-mono text-slate-300">
                prompts.txt · 120 dòng
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-cyan-brand" />
              <span className="rounded-md bg-white/[0.05] px-2 py-1">Muse · Flow · Seedance</span>
              <ArrowRight className="h-3.5 w-3.5 text-neon-pink" />
              <span className="rounded-md bg-brand-gradient-soft px-2 py-1 font-semibold text-white ring-1 ring-cyan-brand/30">
                120 ảnh / video thành phẩm
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
            <ul className="relative mt-6 space-y-3 text-sm">
              {[
                { Icon: UserRound, t: "Chế độ Người mẫu", d: "Khóa khuôn mặt & dáng người" },
                { Icon: Shuffle, t: "Ảnh luân phiên", d: "Xoay vòng nhiều góc chụp" },
                { Icon: ImagePlus, t: "Ảnh tham chiếu", d: "Tối đa 6 ảnh / prompt" },
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
            <div className="relative mt-6 grid grid-cols-6 gap-1.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-md bg-gradient-to-br from-cyan-brand/40 to-neon-pink/30 ring-1 ring-white/10"
                  style={{ opacity: 1 - i * 0.08 }}
                />
              ))}
            </div>
            <div className="relative mt-4 flex flex-wrap gap-1.5">
              {aspectRatios.map((r) => (
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
            <div className="relative mt-6 space-y-2">
              {[
                { acc: "flow_acc_01", s: "Đang chạy", c: "text-cyan-glow", dot: "bg-cyan-glow" },
                { acc: "flow_acc_02", s: "Rảnh → nhận task #57", c: "text-emerald-400", dot: "bg-emerald-400" },
                { acc: "muse_acc_07", s: "Lỗi → tự retry (1/3)", c: "text-amber-400", dot: "bg-amber-400" },
                { acc: "seed_acc_03", s: "Hoàn thành 24 task", c: "text-slate-400", dot: "bg-slate-500" },
              ].map((r) => (
                <div
                  key={r.acc}
                  className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-[#0D1220] px-3 py-2 text-xs"
                >
                  <span className="flex items-center gap-2 font-mono text-slate-300">
                    <span className={cn("h-1.5 w-1.5 animate-pulse-soft rounded-full", r.dot)} />
                    {r.acc}
                  </span>
                  <span className={r.c}>{r.s}</span>
                </div>
              ))}
            </div>
            <ul className="relative mt-5 space-y-2 text-sm text-slate-400">
              {[
                { Icon: ListOrdered, t: "Tự động phân bổ task cho tài khoản rảnh" },
                { Icon: RefreshCw, t: "Tự lọc & chạy lại task lỗi" },
                { Icon: Combine, t: "Ghép video trực tiếp trong app" },
              ].map(({ Icon, t }) => (
                <li key={t} className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-cyan-brand" /> {t}
                </li>
              ))}
            </ul>
          </Card>

          {/* 4. Hệ sinh thái */}
          <Card className="lg:col-span-4" delay={0.15}>
            <CardHead
              icon={LayoutTemplate}
              index="04"
              title="Hệ Sinh Thái Khép Kín"
              desc="Quản lý Tư liệu, Kịch bản, Thư viện ngay trong app. Đẩy thẳng thành phẩm lên LadiPage và tự động đăng Facebook Reels theo lịch — từ ý tưởng tới chuyển đổi, không rời khỏi MeAI."
            />
            <div className="relative mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              {[
                { Icon: FolderKanban, t: "Tư liệu", d: "Ảnh SP, model, logo" },
                { Icon: ScrollText, t: "Kịch bản", d: "Prompt & hook mẫu" },
                { Icon: Library, t: "Thư viện", d: "Ảnh / video đã tạo" },
                { Icon: LayoutTemplate, t: "LadiPage", d: "Đẩy lên landing" },
                { Icon: Send, t: "FB Reels", d: "Đăng tự động" },
              ].map(({ Icon, t, d }, i, arr) => (
                <div key={t} className="flex flex-1 items-center gap-3 sm:flex-col sm:gap-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl border border-white/[0.07] bg-[#0D1220] p-3 sm:flex-col sm:text-center",
                      i === arr.length - 1 && "border-neon-pink/30 shadow-glow-pink",
                    )}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04]">
                      <Icon className={cn("h-5 w-5", i === arr.length - 1 ? "text-neon-pink" : "text-cyan-glow")} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-white">{t}</span>
                      <span className="block text-[11px] text-slate-500">{d}</span>
                    </span>
                  </motion.div>
                </div>
              ))}
            </div>
            <div className="relative mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
              {["Lên lịch đăng đa fanpage", "Caption & hashtag riêng từng video", "Tái sử dụng kịch bản thắng"].map(
                (t) => (
                  <span key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {t}
                  </span>
                ),
              )}
            </div>
            <div className="relative mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-white/[0.06] bg-[#0D1220] px-4 py-3 text-xs">
              <CalendarClock className="h-4 w-4 text-neon-pink" />
              <span className="text-slate-400">Lịch đăng hôm nay:</span>
              {["11:30 · Page Mỹ phẩm", "18:30 · Page Đồ gia dụng", "21:00 · Page Review"].map((t) => (
                <span key={t} className="rounded-md bg-white/[0.05] px-2 py-1 text-slate-300">
                  {t}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
