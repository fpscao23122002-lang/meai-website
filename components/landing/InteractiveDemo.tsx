"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Clapperboard,
  Combine,
  ImageIcon,
  ImagePlus,
  LoaderCircle,
  Minus,
  Pause,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Shuffle,
  TriangleAlert,
  UserRound,
  X,
} from "lucide-react";
import { aspectRatios, engines, type EngineId } from "@/lib/data";
import { cn } from "@/lib/cn";

type Mode = "image" | "video";
type RefMode = "model" | "rotate" | "reference";
type Status = "waiting" | "running" | "error" | "done";

type Task = {
  id: number;
  prompt: string;
  status: Status;
  progress: number;
  account: number | null;
  attempts: number;
};

const DEFAULT_PROMPTS = [
  "Cô gái thoa serum, nắng sớm xuyên rèm, cận mặt",
  "Unbox tai nghe chống ồn trên bàn gỗ, slow motion",
  "Người mẫu mặc áo khoác dạo phố đêm, ánh neon",
  "Ly cà phê muối, khói bay nhẹ, macro shot",
  "Xoay lọ nước hoa 360° trên nền đá cẩm thạch",
  "Shipper giao hàng dưới mưa, phong cách điện ảnh",
  "Đôi giày chạy bộ đạp nước, tia nước bắn chậm",
  "Review son môi, người mẫu mỉm cười vào camera",
].join("\n");

const ENGINE_PREFIX: Record<EngineId, string> = { muse: "muse", flow: "flow", seedance: "seed" };
const ENGINE_SPEED: Record<EngineId, [number, number]> = {
  muse: [9, 16],
  flow: [7, 13],
  seedance: [11, 19],
};
const ERROR_RATE = 0.1;
const MAX_RETRY = 2;

const ratioBox: Record<(typeof aspectRatios)[number], string> = {
  "9:16": "aspect-[9/16] h-40",
  "16:9": "aspect-[16/9] w-full max-w-[220px]",
  "1:1": "aspect-square h-32",
  "4:3": "aspect-[4/3] w-44",
  "3:4": "aspect-[3/4] h-36",
};

const refModes: { id: RefMode; label: string; desc: string; Icon: typeof UserRound }[] = [
  { id: "model", label: "Người mẫu", desc: "Khóa 1 gương mặt cho cả batch", Icon: UserRound },
  { id: "rotate", label: "Ảnh luân phiên", desc: "Xoay vòng ảnh theo từng prompt", Icon: Shuffle },
  { id: "reference", label: "Ảnh tham chiếu", desc: "Đính kèm tối đa 6 ảnh / prompt", Icon: ImagePlus },
];

function rand(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}

export function InteractiveDemo() {
  const [engine, setEngine] = useState<EngineId>("flow");
  const [mode, setMode] = useState<Mode>("video");
  const [ratio, setRatio] = useState<(typeof aspectRatios)[number]>("9:16");
  const [refMode, setRefMode] = useState<RefMode>("reference");
  const [refCount, setRefCount] = useState(3);
  const [accounts, setAccounts] = useState(3);
  const [promptText, setPromptText] = useState(DEFAULT_PROMPTS);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [running, setRunning] = useState(false);
  const [merged, setMerged] = useState(false);

  const engineInfo = engines.find((e) => e.id === engine)!;
  const supportsImage = engineInfo.modes.includes("Tạo ảnh");
  const effectiveMode: Mode = supportsImage ? mode : "video";

  const promptList = useMemo(
    () =>
      promptText
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean)
        .slice(0, 20),
    [promptText],
  );

  const done = tasks.filter((t) => t.status === "done").length;
  const retried = tasks.reduce((sum, t) => sum + t.attempts, 0);
  const allDone = tasks.length > 0 && done === tasks.length;

  // Vòng lặp mô phỏng hàng đợi
  useEffect(() => {
    if (!running) return;
    const [minSpeed, maxSpeed] = ENGINE_SPEED[engine];
    const id = window.setInterval(() => {
      setTasks((prev) => {
        const next = prev.map((t) => ({ ...t }));

        for (const t of next) {
          if (t.status === "error") {
            // Task lỗi được lọc ra và đưa lại vào hàng đợi
            t.status = "waiting";
            t.progress = 0;
            t.account = null;
            t.attempts += 1;
          } else if (t.status === "running") {
            t.progress = Math.min(100, t.progress + rand(minSpeed, maxSpeed));
            if (t.progress >= 100) {
              // Task #3 luôn lỗi ở lần đầu để demo luôn thể hiện cơ chế tự retry
              const fails = t.attempts === 0 && t.id === 3 ? true : Math.random() < ERROR_RATE;
              if (t.attempts < MAX_RETRY && fails) {
                t.status = "error";
                t.progress = rand(40, 90);
              } else {
                t.status = "done";
              }
              t.account = t.status === "done" ? t.account : null;
            }
          }
        }

        // Phân bổ task cho tài khoản rảnh
        const busy = new Set(next.filter((t) => t.status === "running").map((t) => t.account));
        for (const t of next) {
          if (t.status !== "waiting") continue;
          const free = Array.from({ length: accounts }, (_, i) => i).find((i) => !busy.has(i));
          if (free === undefined) break;
          t.status = "running";
          t.account = free;
          t.progress = 0;
          busy.add(free);
        }
        return next;
      });
    }, 450);
    return () => window.clearInterval(id);
  }, [running, engine, accounts]);

  useEffect(() => {
    if (allDone) setRunning(false);
  }, [allDone]);

  const start = () => {
    if (tasks.length === 0 || allDone) {
      setMerged(false);
      setTasks(
        promptList.map((p, i) => ({ id: i + 1, prompt: p, status: "waiting", progress: 0, account: null, attempts: 0 })),
      );
    }
    setRunning(true);
  };

  const reset = () => {
    setRunning(false);
    setTasks([]);
    setMerged(false);
  };

  const locked = running || (tasks.length > 0 && !allDone);
  const accountName = (i: number) => `${ENGINE_PREFIX[engine]}_acc_${String(i + 1).padStart(2, "0")}`;

  return (
    <section id="demo" className="relative py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-0 top-1/3 h-[420px] w-[420px] rounded-full bg-neon-pink/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-cyan-brand/10 blur-[120px]" />
      </div>
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-neon-pink/30 bg-neon-pink/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-pink-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-pink" /> Demo tương tác
          </span>
          <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Bấm thử <span className="text-gradient">Studio MeAI</span> ngay trên trình duyệt
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-400 sm:text-lg">
            Đổi engine, chọn tỉ lệ, thêm ảnh tham chiếu, sửa danh sách prompt rồi bấm <strong className="text-white">Chạy hàng đợi</strong>{" "}
            để xem MeAI tự chia task cho nhiều tài khoản, tự bắt lỗi và chạy lại như trong app thật.
          </p>
        </div>

        <div className="glow-border mt-14 overflow-hidden rounded-3xl bg-[#0D1220] shadow-[0_40px_120px_-40px_rgba(236,72,153,0.35)]">
          {/* Title bar */}
          <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#0A0E18] px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
              <span className="h-3 w-3 rounded-full bg-[#28C840]" />
              <span className="ml-3 text-xs font-medium text-slate-400">MeAI Studio — Chế độ demo</span>
            </div>
            <span className="hidden text-[11px] text-slate-500 sm:inline">Dữ liệu mô phỏng</span>
          </div>

          <div className="grid lg:grid-cols-[340px_1fr]">
            {/* Control panel */}
            <div className="space-y-6 border-b border-white/[0.06] p-5 lg:border-b-0 lg:border-r">
              <fieldset disabled={locked} className="space-y-6 disabled:opacity-60">
                <div>
                  <Label>Engine AI</Label>
                  <div className="relative mt-2 grid grid-cols-3 gap-1 rounded-xl bg-black/30 p-1">
                    {engines.map((e) => (
                      <button
                        key={e.id}
                        type="button"
                        onClick={() => setEngine(e.id)}
                        className={cn(
                          "relative z-10 rounded-lg px-2 py-2 text-xs font-semibold transition-colors",
                          engine === e.id ? "text-white" : "text-slate-400 hover:text-white",
                        )}
                      >
                        {engine === e.id ? (
                          <motion.span
                            layoutId="engine-pill"
                            className="absolute inset-0 -z-10 rounded-lg bg-brand-gradient shadow-glow-sm"
                            transition={{ type: "spring", stiffness: 400, damping: 32 }}
                          />
                        ) : null}
                        {e.name}
                      </button>
                    ))}
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={engine}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="mt-2 text-xs leading-5 text-slate-500"
                    >
                      {engineInfo.tagline} · <span className="text-cyan-glow">{engineInfo.speed}</span>
                    </motion.p>
                  </AnimatePresence>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Chế độ</Label>
                    <div className="mt-2 flex gap-1 rounded-xl bg-black/30 p-1">
                      {(
                        [
                          { id: "image", label: "Ảnh", Icon: ImageIcon },
                          { id: "video", label: "Video", Icon: Clapperboard },
                        ] as const
                      ).map(({ id, label, Icon }) => {
                        const disabled = id === "image" && !supportsImage;
                        return (
                          <button
                            key={id}
                            type="button"
                            disabled={disabled}
                            title={disabled ? `${engineInfo.name} chỉ hỗ trợ tạo video` : undefined}
                            onClick={() => setMode(id)}
                            className={cn(
                              "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition",
                              effectiveMode === id ? "bg-white/10 text-white" : "text-slate-400 hover:text-white",
                              disabled && "cursor-not-allowed opacity-40",
                            )}
                          >
                            <Icon className="h-3.5 w-3.5" /> {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <Label>Tài khoản chạy</Label>
                    <div className="mt-2 flex items-center justify-between rounded-xl bg-black/30 p-1">
                      <button
                        type="button"
                        aria-label="Bớt tài khoản"
                        onClick={() => setAccounts((a) => Math.max(1, a - 1))}
                        className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-sm font-bold text-white">{accounts}</span>
                      <button
                        type="button"
                        aria-label="Thêm tài khoản"
                        onClick={() => setAccounts((a) => Math.min(6, a + 1))}
                        className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Tỉ lệ khung hình</Label>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {aspectRatios.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRatio(r)}
                        className={cn(
                          "rounded-lg border px-3 py-1.5 font-mono text-xs transition",
                          ratio === r
                            ? "border-cyan-glow/60 bg-cyan-brand/15 text-cyan-glow shadow-glow-sm"
                            : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white",
                        )}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Đồng nhất nhân vật & sản phẩm</Label>
                  <div className="mt-2 space-y-1.5">
                    {refModes.map(({ id, label, desc, Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setRefMode(id)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition",
                          refMode === id
                            ? "border-neon-pink/40 bg-neon-pink/10"
                            : "border-white/[0.06] hover:border-white/15",
                        )}
                      >
                        <Icon className={cn("h-4 w-4", refMode === id ? "text-neon-pink" : "text-slate-500")} />
                        <span>
                          <span className="block text-xs font-semibold text-white">{label}</span>
                          <span className="block text-[11px] text-slate-500">{desc}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-6 gap-1.5">
                    {Array.from({ length: 6 }).map((_, i) =>
                      i < refCount ? (
                        <button
                          key={i}
                          type="button"
                          aria-label={`Bỏ ảnh tham chiếu ${i + 1}`}
                          onClick={() => setRefCount((c) => c - 1)}
                          className="group relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-cyan-brand/50 to-neon-pink/40 ring-1 ring-white/15"
                        >
                          <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                            <X className="h-3.5 w-3.5 text-white" />
                          </span>
                        </button>
                      ) : (
                        <button
                          key={i}
                          type="button"
                          aria-label="Thêm ảnh tham chiếu"
                          onClick={() => setRefCount((c) => Math.min(6, c + 1))}
                          className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-white/15 text-slate-600 transition hover:border-cyan-brand/50 hover:text-cyan-glow"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      ),
                    )}
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-500">{refCount}/6 ảnh tham chiếu</p>
                </div>
              </fieldset>
            </div>

            {/* Workspace */}
            <div className="grid min-w-0 gap-5 p-5 xl:grid-cols-[1fr_1.1fr]">
              <div className="flex min-w-0 flex-col">
                <div className="flex items-center justify-between">
                  <Label>Danh sách prompt (mỗi dòng = 1 task)</Label>
                  <span className="text-[11px] text-slate-500">{promptList.length}/20</span>
                </div>
                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  disabled={locked}
                  rows={9}
                  spellCheck={false}
                  className="mt-2 w-full flex-1 resize-none rounded-xl border border-white/[0.08] bg-black/30 p-3 font-mono text-xs leading-6 text-slate-300 outline-none transition focus:border-cyan-brand/50 focus:shadow-glow-sm disabled:opacity-60"
                />

                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
                  <div className="flex h-40 w-full shrink-0 items-center justify-center sm:w-[220px] rounded-xl border border-white/[0.06] bg-black/20 p-2">
                    <motion.div
                      layout
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                      className={cn(
                        "relative max-h-full overflow-hidden rounded-lg bg-gradient-to-br ring-1 ring-white/15",
                        engineInfo.color,
                        ratioBox[ratio],
                      )}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.35),transparent_50%)]" />
                      <span className="absolute bottom-1.5 left-1.5 rounded bg-black/50 px-1.5 py-0.5 font-mono text-[10px] text-white">
                        {ratio}
                      </span>
                      <span className="absolute right-1.5 top-1.5 rounded bg-black/50 p-1 text-white">
                        {effectiveMode === "video" ? <Clapperboard className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                      </span>
                    </motion.div>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    {running ? (
                      <button
                        type="button"
                        onClick={() => setRunning(false)}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 text-sm font-semibold text-white transition hover:bg-white/10"
                      >
                        <Pause className="h-4 w-4" /> Tạm dừng
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={start}
                        disabled={promptList.length === 0}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-gradient text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 disabled:opacity-50"
                      >
                        <Play className="h-4 w-4 fill-current" />
                        {tasks.length > 0 && !allDone ? "Tiếp tục" : `Chạy hàng đợi (${promptList.length})`}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={reset}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl text-xs font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Làm mới
                    </button>
                  </div>
                </div>
              </div>

              {/* Queue */}
              <div className="flex min-w-0 flex-col rounded-2xl border border-white/[0.06] bg-black/20 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Label>Hàng đợi</Label>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-emerald-400">
                      ✓ {done}/{tasks.length || promptList.length}
                    </span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <RefreshCw className="h-3 w-3" /> Retry: {retried}
                    </span>
                  </div>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    className="h-full bg-brand-gradient"
                    animate={{ width: tasks.length ? `${(done / tasks.length) * 100}%` : "0%" }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {Array.from({ length: accounts }).map((_, i) => {
                    const busy = tasks.some((t) => t.status === "running" && t.account === i);
                    return (
                      <span
                        key={i}
                        className={cn(
                          "flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[10px]",
                          busy ? "border-cyan-brand/40 text-cyan-glow" : "border-white/10 text-slate-500",
                        )}
                      >
                        <span className={cn("h-1.5 w-1.5 rounded-full", busy ? "animate-pulse bg-cyan-glow" : "bg-emerald-400")} />
                        {accountName(i)}
                      </span>
                    );
                  })}
                </div>

                <div className="mt-3 max-h-[300px] min-h-[200px] flex-1 space-y-1.5 overflow-y-auto pr-1">
                  {tasks.length === 0 ? (
                    <div className="flex h-full min-h-[200px] flex-col items-center justify-center text-center text-xs text-slate-500">
                      <Play className="mb-2 h-6 w-6 text-slate-600" />
                      Bấm “Chạy hàng đợi” để xem MeAI phân bổ {promptList.length} task
                      <br />
                      cho {accounts} tài khoản {engineInfo.name}.
                    </div>
                  ) : (
                    tasks.map((t) => <TaskRow key={t.id} task={t} accountName={accountName} />)
                  )}
                </div>

                <AnimatePresence>
                  {allDone ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-3 flex flex-col gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <p className="text-xs text-emerald-300">
                        {merged
                          ? `Đã ghép ${tasks.length} clip thành 1 video ${ratio} — sẵn sàng đăng Reels!`
                          : `Hoàn tất ${tasks.length} task${retried ? `, tự xử lý ${retried} lỗi` : ""}.`}
                      </p>
                      {effectiveMode === "video" && !merged ? (
                        <button
                          type="button"
                          onClick={() => setMerged(true)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/15"
                        >
                          <Combine className="h-3.5 w-3.5" /> Ghép video
                        </button>
                      ) : null}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{children}</p>;
}

function TaskRow({ task, accountName }: { task: Task; accountName: (i: number) => string }) {
  const statusEl = {
    waiting: <span className="text-slate-500">{task.attempts > 0 ? `Chờ retry (${task.attempts})` : "Đang chờ"}</span>,
    running: (
      <span className="flex items-center gap-1 text-cyan-glow">
        <LoaderCircle className="h-3 w-3 animate-spin" /> {task.progress}%
      </span>
    ),
    error: (
      <span className="flex items-center gap-1 text-amber-400">
        <TriangleAlert className="h-3 w-3" /> Lỗi → requeue
      </span>
    ),
    done: (
      <span className="flex items-center gap-1 text-emerald-400">
        <CheckCircle2 className="h-3 w-3" /> Xong
      </span>
    ),
  }[task.status];

  return (
    <motion.div
      layout
      className={cn(
        "rounded-lg border px-3 py-2",
        task.status === "running" && "border-cyan-brand/25 bg-cyan-brand/5",
        task.status === "error" && "border-amber-400/30 bg-amber-400/5",
        task.status === "done" && "border-white/[0.04] bg-white/[0.02]",
        task.status === "waiting" && "border-white/[0.04]",
      )}
    >
      <div className="flex items-center justify-between gap-3 text-[11px]">
        <span className="min-w-0 truncate text-slate-300">
          <span className="mr-1.5 font-mono text-slate-500">#{String(task.id).padStart(2, "0")}</span>
          {task.prompt}
        </span>
        <span className="shrink-0">{statusEl}</span>
      </div>
      {task.status === "running" ? (
        <div className="mt-1.5 flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full bg-brand-gradient transition-all duration-300" style={{ width: `${task.progress}%` }} />
          </div>
          {task.account !== null ? (
            <span className="font-mono text-[9px] text-slate-500">{accountName(task.account)}</span>
          ) : null}
        </div>
      ) : null}
    </motion.div>
  );
}
