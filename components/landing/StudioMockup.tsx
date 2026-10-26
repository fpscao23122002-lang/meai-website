"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Clapperboard,
  FolderKanban,
  ImageIcon,
  Layers,
  Library,
  ListOrdered,
  Play,
  ScrollText,
  Send,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/lib/cn";

const sidebar = [
  { label: "Studio", Icon: Sparkles, active: true },
  { label: "Tư liệu", Icon: FolderKanban },
  { label: "Kịch bản", Icon: ScrollText },
  { label: "Thư viện", Icon: Library },
  { label: "Tài khoản", Icon: Users },
  { label: "Hàng đợi", Icon: ListOrdered },
  { label: "Ghép video", Icon: Layers },
  { label: "Đăng Reels", Icon: Send },
];

const prompts = [
  "Cô gái cầm serum, ánh nắng sớm, cận mặt 9:16",
  "Unbox tai nghe trên bàn gỗ, slow motion",
  "Người mẫu đi dạo phố đêm Sài Gòn, neon",
  "Ly cà phê muối, khói bay, macro shot",
  "Review son, xoay sản phẩm 360°",
  "Shipper giao hàng, trời mưa, cinematic",
  "Giày chạy bộ đạp nước, tia nước bắn chậm",
  "KOC ảo mở hộp đồng hồ, ánh nắng chiều",
];

const tiles = [
  "from-cyan-500/70 via-sky-700/50 to-indigo-900/60",
  "from-fuchsia-500/60 via-rose-600/40 to-slate-900/60",
  "from-amber-400/50 via-orange-600/40 to-rose-900/60",
  "from-emerald-400/50 via-teal-700/40 to-slate-900/60",
];

export function StudioMockup({ className }: { className?: string }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 900);
    return () => window.clearInterval(id);
  }, []);

  // Mô phỏng tiến độ: mỗi tile hoàn thành lệch pha nhau
  const progressOf = (i: number) => Math.min(100, (tick * 9 + i * 23) % 140);

  return (
    <div
      className={cn(
        "glow-border overflow-hidden rounded-2xl bg-[#0D1220] shadow-[0_40px_120px_-30px_rgba(6,182,212,0.35)]",
        className,
      )}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#0A0E18] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
          <span className="ml-3 text-xs font-medium text-slate-400">MeAI Studio — Dự án: Skincare Q4</span>
        </div>
        <span className="hidden text-[10px] text-slate-500 sm:block">v2.6.0 · License: Gói Năm</span>
      </div>

      <div className="flex min-h-[380px]">
        {/* Sidebar */}
        <aside className="hidden w-44 shrink-0 border-r border-white/[0.06] bg-[#0B101C] p-3 md:block">
          {sidebar.map(({ label, Icon, active }) => (
            <div
              key={label}
              className={cn(
                "mb-1 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium",
                active ? "bg-brand-gradient-soft text-white ring-1 ring-cyan-brand/30" : "text-slate-500",
              )}
            >
              <Icon className={cn("h-3.5 w-3.5", active && "text-cyan-glow")} />
              {label}
            </div>
          ))}
          <div className="mt-4 rounded-lg border border-white/[0.06] p-2.5">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Tài khoản</p>
            <p className="mt-1 text-sm font-semibold text-white">
              12 <span className="text-[10px] font-normal text-emerald-400">● 8 rảnh</span>
            </p>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.06] px-4 py-3">
            {["Muse", "Google Flow", "Seedance"].map((e, i) => (
              <span
                key={e}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold",
                  i === 1 ? "bg-brand-gradient text-white shadow-glow-sm" : "bg-white/[0.04] text-slate-400",
                )}
              >
                {e}
              </span>
            ))}
            <span className="mx-1 hidden h-5 w-px bg-white/10 sm:block" />
            <span className="hidden items-center gap-1 rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-xs text-slate-300 sm:inline-flex">
              <Clapperboard className="h-3.5 w-3.5 text-neon-pink" /> Video
            </span>
            <span className="hidden rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-xs text-slate-300 sm:inline-flex">
              9:16
            </span>
            <span className="ml-auto inline-flex items-center gap-1 rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-xs text-slate-300">
              <ImageIcon className="h-3.5 w-3.5 text-cyan-glow" /> 4/6 ảnh tham chiếu
            </span>
          </div>

          <div className="grid flex-1 items-start gap-3 p-4 lg:grid-cols-[1fr_1.5fr]">
            {/* Prompt list */}
            <div className="rounded-xl border border-white/[0.06] bg-[#0B101C] p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Danh sách prompt</p>
                <span className="text-[10px] text-slate-500">120 dòng</span>
              </div>
              <ol className="space-y-1.5">
                {prompts.map((p, i) => (
                  <li
                    key={p}
                    className="flex items-start gap-2 rounded-md bg-white/[0.02] px-2 py-1.5 text-[11px] leading-snug text-slate-400"
                  >
                    <span className="font-mono text-[10px] text-cyan-brand/80">{String(i + 1).padStart(2, "0")}</span>
                    <span className="truncate">{p}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Output grid */}
            <div>
              <div className="grid grid-cols-4 gap-2">
                {tiles.map((g, i) => {
                  const p = progressOf(i);
                  const done = p >= 100;
                  return (
                    <div
                      key={g}
                      className={cn("relative aspect-[9/16] overflow-hidden rounded-lg bg-gradient-to-br", g)}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.25),transparent_45%)]" />
                      <div className="absolute bottom-[18%] left-1/2 h-1/3 w-1/2 -translate-x-1/2 rounded-t-full bg-black/25" />
                      <div className="absolute left-1/2 top-[22%] h-[16%] w-[28%] -translate-x-1/2 rounded-full bg-black/25" />
                      {done ? (
                        <motion.div
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-base">
                            <Play className="h-3.5 w-3.5 fill-current" />
                          </span>
                        </motion.div>
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />
                          <div className="absolute inset-0 overflow-hidden">
                            <div className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                          </div>
                          <div className="absolute inset-x-2 bottom-2">
                            <div className="h-1 overflow-hidden rounded-full bg-white/15">
                              <div
                                className="h-full bg-brand-gradient transition-all duration-700"
                                style={{ width: `${p}%` }}
                              />
                            </div>
                            <p className="mt-1 text-center text-[9px] font-medium text-white/80">{p}%</p>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 rounded-xl border border-white/[0.06] bg-[#0B101C] p-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-slate-400">
                    <Layers className="h-3.5 w-3.5 text-neon-pink" /> Ghép video
                  </span>
                  <span className="text-slate-500">00:42 · 9:16 · nhạc nền</span>
                </div>
                <div className="mt-2 flex h-7 gap-1">
                  {[22, 14, 18, 26, 20].map((w, i) => (
                    <div
                      key={i}
                      style={{ flexGrow: w }}
                      className={cn("rounded-md bg-gradient-to-r ring-1 ring-white/10", tiles[i % tiles.length])}
                    />
                  ))}
                </div>
                <div className="mt-1 h-3 rounded bg-[repeating-linear-gradient(90deg,rgba(6,182,212,0.35)_0_2px,transparent_2px_5px)] opacity-60" />
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-white/[0.06] bg-[#0A0E18] px-4 py-2 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-emerald-400" /> Đang chạy 6 luồng
            </span>
            <span>Hoàn thành: {48 + (tick % 20)}/120</span>
            <span className="text-amber-400/80">Tự retry: 3 task</span>
            <span className="ml-auto hidden sm:inline">Tự đăng Reels: 18:30 hôm nay</span>
          </div>
        </div>
      </div>
    </div>
  );
}
