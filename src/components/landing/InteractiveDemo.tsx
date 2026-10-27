import { useEffect, useMemo, useRef, useState } from "react";
import { Image } from "@/components/ui/Image";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  FolderOpen,
  LoaderCircle,
  Play,
  Plus,
  TriangleAlert,
  X,
} from "lucide-react";
import { engines, type EngineId } from "@/lib/data";
import { CONFIGS, DEFAULT_OPTS, type Kind, type OptValue, type Seg } from "@/lib/studioConfig";
import { cn } from "@/lib/cn";
import { ScreenMock } from "@/components/mock/ScreenMock";
import { BareFrame, SIDEBAR } from "@/components/mock/mockUtils";
import { useIndicator } from "@/hooks/useIndicator";

/* ------------------------------------------------------------------ */
/* Cấu hình tuỳ chọn — mô phỏng đúng panel trái của Studio trong app   */
/* ------------------------------------------------------------------ */

const TEMPLATES: { name: string; text: string }[] = [
  {
    name: "Chân dung KOC ảo",
    text: "Chân dung cận cảnh cô gái Việt 25 tuổi, da trắng hồng, tóc layer uốn sóng nhẹ,\nánh nắng sớm xuyên rèm, phong cách quảng cáo mỹ phẩm Hàn Quốc",
  },
  {
    name: "Review sản phẩm UGC",
    text: "Cô gái cầm lọ serum giơ lên camera, bàn trang điểm gỗ sáng, đèn ring light,\ntrung cảnh, phong cách UGC TikTok, nói chuyện tự nhiên",
  },
  {
    name: "Unbox sản phẩm",
    text: "Đôi tay mở hộp quà lịch Giáng Sinh trên bàn gỗ, đèn Noel lung linh phía sau,\ncận cảnh, máy đẩy chậm, ánh sáng ấm",
  },
];

const DEFAULT_PROMPT = `Ông lão tóc bạc mặc áo thun xám, đứng trong tủ quần áo gỗ,
mỉm cười cầm chiếc áo mới, ánh sáng ấm, cận trung cảnh

Cô gái Việt giơ hộp lịch Giáng Sinh giữa kho hàng đầy ắp,
cận cảnh lung linh đèn Noel, máy đẩy chậm

Ly cà phê muối trên bàn gỗ, khói bay nhẹ, macro shot, ánh nắng chiều`;

const THUMBS = ["/samples/anh-1.webp", "/samples/video-3.webp", "/samples/video-1.webp", "/samples/video-4.webp", "/samples/video-2.webp", "/samples/video-5.webp"];
const PORTRAIT_THUMBS = THUMBS.slice(1);
const RETRY_LIMIT = 1; // = "Số lần thử khi lỗi" trong Cài đặt

/* ------------------------------------------------------------------ */
/* Task                                                                */
/* ------------------------------------------------------------------ */

type Status = "queued" | "running" | "done" | "error";
type Task = {
  id: number;
  prompt: string;
  engine: EngineId;
  kind: Kind;
  ratio: string;
  extra: string;
  status: Status;
  progress: number;
  account: number | null;
  lastAccount: number | null;
  attempts: number;
  failPlan: number;
  elapsed: number;
  date: string;
  thumb: string;
};

const SEED_TASKS: Task[] = [
  {
    id: 2,
    prompt:
      "Chân dung bên trái ảnh là một cô gái trẻ Việt Nam (khoảng 32 tuổi) có gương mặt xinh đẹp, nét đẹp tự nhiên của người Việt Nam. Bên phải là bé trai đội mũ, phía sau là xe hơi đen.",
    engine: "muse",
    kind: "image",
    ratio: "16:9",
    extra: "",
    status: "done",
    progress: 100,
    account: null,
    lastAccount: 0,
    attempts: 0,
    failPlan: 0,
    elapsed: 20,
    date: "27/10",
    thumb: THUMBS[0],
  },
  {
    id: 1,
    prompt: "Ông lão tóc bạc mặc áo thun xám đứng trong tủ quần áo, mỉm cười nhìn camera, ánh sáng ấm.",
    engine: "muse",
    kind: "video",
    ratio: "9:16",
    extra: "",
    status: "done",
    progress: 100,
    account: null,
    lastAccount: 1,
    attempts: 0,
    failPlan: 0,
    elapsed: 48,
    date: "27/10",
    thumb: "/samples/video-4.webp",
  },
];

const engineInfo = (id: EngineId) => engines.find((e) => e.id === id)!;
const fmtTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const ratioToAspect = (r: string) => r.replace(":", " / ");

function splitPrompts(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 12);
}

export function InteractiveDemo() {
  const [engine, setEngine] = useState<EngineId>("muse");
  const [kinds, setKinds] = useState<Record<"muse" | "flow", Kind>>({ muse: "image", flow: "image" });
  const [opts, setOpts] = useState(DEFAULT_OPTS);
  const [refCount, setRefCount] = useState(0);
  const [firstLast, setFirstLast] = useState({ first: false, last: false });
  const [seed, setSeed] = useState("");
  const [promptText, setPromptText] = useState(DEFAULT_PROMPT);
  const [templates, setTemplates] = useState(TEMPLATES);

  const [accTotal, setAccTotal] = useState(2);
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS);
  const [running, setRunning] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [activeId, setActiveId] = useState<number>(2);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [sort, setSort] = useState<"new" | "old">("new");
  const [toast, setToast] = useState<string | null>(null);

  const nextId = useRef(3);
  const [screen, setScreen] = useState("studio");
  const sbInd = useIndicator<HTMLElement>(screen);
  const sbIndM = useIndicator(screen);
  const demoRef = useRef<HTMLDivElement>(null);
  const demoInView = useInView(demoRef, { margin: "-15% 0px" });
  const screenLabel = SIDEBAR.find((x) => x.id === screen)?.label ?? "Studio";
  const promptRef = useRef<HTMLTextAreaElement>(null);

  const kind: Kind = engine === "seedance" ? "video" : kinds[engine];
  const cfgKey = `${engine}-${kind}`;
  const cfg = CONFIGS[cfgKey];
  const cur = opts[cfgKey];
  const modeSeg = cfg.segs.find((sg) => sg.key === "mode");
  const otherSegs = cfg.segs.filter((sg) => sg.key !== "mode");
  const prompts = useMemo(() => splitPrompts(promptText), [promptText]);

  const busyAccounts = tasks.filter((t) => t.status === "running").length;
  const freeAccounts = Math.max(0, accTotal - busyAccounts);
  const active = tasks.find((t) => t.id === activeId) ?? tasks[0];

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((m) => (m === msg ? null : m)), 2600);
  };

  const setOpt = (key: string, value: OptValue) => setOpts((o) => ({ ...o, [cfgKey]: { ...o[cfgKey], [key]: value } }));

  /* ---------------- Vòng lặp hàng đợi ---------------- */
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setTasks((prev) => {
        const next = prev.map((t) => ({ ...t }));
        for (const t of next) {
          if (t.status !== "running") continue;
          const speed = t.kind === "video" ? 9 : 16;
          t.progress = Math.min(100, t.progress + speed + Math.round(Math.random() * 6));
          t.elapsed += t.kind === "video" ? 4 : 2;
          if (t.progress >= 100) {
            if (t.failPlan > 0) {
              t.failPlan -= 1;
              t.attempts += 1;
              t.lastAccount = t.account;
              t.account = null;
              t.progress = 0;
              t.status = t.attempts <= RETRY_LIMIT ? "queued" : "error";
            } else {
              t.status = "done";
              t.lastAccount = t.account;
              t.account = null;
            }
          }
        }
        // Chia task cho tài khoản rảnh, task cũ nhất chạy trước
        const busy = new Set(next.filter((t) => t.status === "running").map((t) => t.account));
        const queue = next.filter((t) => t.status === "queued").sort((a, b) => a.id - b.id);
        for (const t of queue) {
          const free = Array.from({ length: accTotal }, (_, i) => i).find((i) => !busy.has(i));
          if (free === undefined) break;
          t.status = "running";
          t.account = free;
          busy.add(free);
        }
        return next;
      });
    }, 420);
    return () => window.clearInterval(id);
  }, [running, accTotal]);

  useEffect(() => {
    if (running && !tasks.some((t) => t.status === "queued" || t.status === "running")) setRunning(false);
  }, [running, tasks]);

  /* ---------------- Hành động ---------------- */
  const extraLabel = () => {
    if (cfgKey === "muse-image" && cur.perPrompt !== "1") return `${cur.perPrompt} ảnh`;
    if (cfgKey === "flow-image") return String(cur.res);
    if (cfgKey === "flow-video") return `${cur.quality} · ${cur.duration}`;
    if (cfgKey === "seedance-video") return `${cur.res} · ${cur.duration}`;
    return "";
  };

  const enqueue = (run: boolean) => {
    if (prompts.length === 0) return;
    const now = new Date();
    const date = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}`;
    const ratio = String(cur.ratio);
    const [rw, rh] = ratio.split(":").map(Number);
    const created: Task[] = prompts.map((p, i) => {
      const id = nextId.current++;
      return {
        id,
        prompt: p,
        engine,
        kind,
        ratio,
        extra: extraLabel(),
        status: "queued",
        progress: 0,
        account: null,
        lastAccount: null,
        attempts: 0,
        // Prompt thứ 2 của mỗi lượt luôn "dính lỗi" 2 lần để demo cơ chế thử lại & Chạy lại lỗi
        failPlan: i === 1 ? 2 : Math.random() < 0.15 ? 1 : 0,
        elapsed: 0,
        date,
        // Khung ngang dùng ảnh ngang, khung dọc/vuông dùng ảnh dọc
        thumb: rw > rh ? THUMBS[0] : PORTRAIT_THUMBS[id % PORTRAIT_THUMBS.length],
      };
    });
    setTasks((t) => [...t, ...created]);
    setActiveId(created[0].id);
    if (run) setRunning(true);
    showToast(run ? `Đã tạo ${created.length} task và bắt đầu chạy` : `Đã thêm ${created.length} task vào hàng đợi`);
  };

  const stop = () => {
    setRunning(false);
    setTasks((prev) =>
      prev.map((t) => (t.status === "running" ? { ...t, status: "queued", progress: 0, account: null } : t)),
    );
  };

  const run = () => {
    if (!tasks.some((t) => t.status === "queued")) return showToast("Không có task nào đang chờ");
    setRunning(true);
  };

  const retryErrors = () => {
    const ids = new Set(
      tasks.filter((t) => t.status === "error" && (selected.size === 0 || selected.has(t.id))).map((t) => t.id),
    );
    if (ids.size === 0) return showToast("Không có task lỗi");
    setTasks((prev) =>
      prev.map((t) => (ids.has(t.id) ? { ...t, status: "queued", progress: 0, attempts: 0, failPlan: 0 } : t)),
    );
    setRunning(true);
    showToast(`Chạy lại ${ids.size} task lỗi`);
  };

  const remove = () => {
    if (selected.size === 0) return showToast("Chọn task cần xoá trước");
    setTasks((prev) => prev.filter((t) => !selected.has(t.id) || t.status === "running"));
    setSelected(new Set());
  };

  const merge = () => {
    const pool = tasks.filter((t) => t.status === "done" && t.kind === "video");
    const picked = selected.size ? pool.filter((t) => selected.has(t.id)) : pool;
    if (picked.length < 2) return showToast("Cần ít nhất 2 video đã xong để ghép");
    showToast(`Đã ghép ${picked.length} video → Thư viện`);
  };

  const recreate = (t: Task) => {
    const id = nextId.current++;
    setTasks((prev) => [...prev, { ...t, id, status: "queued", progress: 0, account: null, attempts: 0, failPlan: 0, elapsed: 0 }]);
    setActiveId(id);
    setRunning(true);
  };

  const edit = (t: Task) => {
    setPromptText(t.prompt);
    promptRef.current?.focus();
    showToast("Đã đưa prompt lên ô soạn — sửa rồi bấm Tạo & chạy");
  };

  /* ---------------- Danh sách hiển thị ---------------- */
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = tasks.filter(
      (t) => (statusFilter === "all" || t.status === statusFilter) && (!q || t.prompt.toLowerCase().includes(q)),
    );
    return list.sort((a, b) => (sort === "new" ? b.id - a.id : a.id - b.id));
  }, [tasks, query, statusFilter, sort]);

  const allVisibleSelected = visible.length > 0 && visible.every((t) => selected.has(t.id));
  const toggleSel = (id: number) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <section id="demo" className="relative py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-0 top-1/3 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(252,49,153,0.10),rgba(252,49,153,0.055)_45%,transparent)] scale-[1.5]" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(14,230,250,0.10),rgba(14,230,250,0.055)_45%,transparent)] scale-[1.5]" />
      </div>
      <div className="container max-w-[1400px]">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-neon-pink/30 bg-neon-pink/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-pink-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-pink" /> Demo tương tác
          </span>
          <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Bấm thử <span className="text-gradient">Studio MeAI</span> ngay trên trình duyệt
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-400 sm:text-lg">
            Mô phỏng đúng app MeAI: đổi engine, dán prompt (mỗi prompt cách nhau 1 dòng trống), bấm{" "}
            <strong className="text-white">Tạo &amp; chạy</strong> rồi thử <em>Chọn lỗi → Chạy lại lỗi</em>, <em>Ghép video</em>. Bấm menu{" "}
            <strong className="text-white">Tư liệu, Kịch bản, Thư viện, Tài khoản, LadiPage, Đăng Reels, Cài đặt</strong> để thử mọi chức
            năng.
          </p>
        </div>

        <div
          ref={demoRef}
          className="glow-border relative mt-14 overflow-hidden rounded-2xl bg-ink shadow-[0_40px_120px_-40px_rgba(252,49,153,0.35)]"
        >
          {/* Thanh trên cùng */}
          <div className="flex flex-wrap items-center gap-2 border-b border-cyan-glow/30 bg-[#0B0B14] px-4 py-2.5 text-xs">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={screen}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="font-semibold text-white"
              >
                {screenLabel}
              </motion.span>
            </AnimatePresence>
            <span className="ml-auto hidden rounded-md border border-white/10 bg-panel px-2.5 py-1 text-slate-300 sm:inline">
              Mặc định
            </span>
            <label className="flex items-center gap-1.5 rounded-full border border-cyan-glow/50 bg-cyan-glow/10 px-2.5 py-1 font-semibold text-cyan-glow">
              <span className={cn("h-1.5 w-1.5 rounded-full bg-cyan-glow", running && "animate-pulse")} />
              Tài khoản: {freeAccounts}/{accTotal} rảnh
              <select
                aria-label="Số tài khoản"
                value={accTotal}
                onChange={(e) => setAccTotal(Number(e.target.value))}
                className="cursor-pointer bg-transparent text-cyan-glow outline-none"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n} className="bg-panel text-white">
                    {n} TK
                  </option>
                ))}
              </select>
            </label>
            <button type="button" onClick={run} className="rounded-md border border-white/10 bg-panel px-2.5 py-1 font-semibold text-white hover:bg-white/10">
              Chạy tiếp
            </button>
            <button type="button" onClick={stop} className="rounded-md border border-white/10 bg-panel px-2.5 py-1 font-semibold text-neon-pink hover:bg-white/10">
              Dừng tất cả
            </button>
          </div>

          <div className="flex">
            {/* Menu trái giống app: bấm để chuyển màn hình */}
            <aside ref={sbInd.containerRef} className="relative hidden w-16 shrink-0 flex-col items-center gap-1 border-r border-white/[0.06] bg-[#0B0B14] py-3 lg:flex">
              <span
                aria-hidden
                style={sbInd.style}
                className="pointer-events-none absolute left-0 top-0 rounded-lg bg-cyan-glow/10 ring-1 ring-cyan-glow/40 will-change-transform"
              />
              <Image src="/brand/meai-logo.webp" alt="" width={36} height={36} className="mb-2 rounded-lg" />
              {SIDEBAR.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  data-ind={id}
                  onClick={() => setScreen(id)}
                  title={label}
                  className={cn(
                    "relative flex w-14 flex-col items-center gap-1 rounded-lg py-1.5 text-center text-[9px] leading-tight transition-colors",
                    screen === id ? "text-cyan-glow" : "text-slate-500 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <Icon className="relative h-3.5 w-3.5" />
                  <span className="relative">{label}</span>
                </button>
              ))}
            </aside>

            <div className="min-w-0 flex-1">
            {/* Menu dạng thanh trượt ngang (mobile / màn hình nhỏ) */}
            <div ref={sbIndM.containerRef} className="relative flex gap-1.5 overflow-x-auto border-b border-white/[0.06] px-3 py-2 lg:hidden">
              <span aria-hidden style={sbIndM.style} className="pointer-events-none absolute left-0 top-0 rounded-full bg-cyan-glow/10 will-change-transform" />
              {SIDEBAR.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  data-ind={id}
                  onClick={() => setScreen(id)}
                  className={cn(
                    "relative flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                    screen === id ? "border-cyan-glow/50 text-cyan-glow" : "border-white/10 text-slate-400",
                  )}
                >
                  <Icon className="relative h-3.5 w-3.5" />
                  <span className="relative">{label}</span>
                </button>
              ))}
            </div>

            {screen !== "studio" ? (
              <motion.div
                key={screen}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="p-3"
              >
                <BareFrame.Provider value={true}>
                  <ScreenMock id={screen} play={demoInView} />
                </BareFrame.Provider>
              </motion.div>
            ) : (

            <div className="grid min-w-0 flex-1 gap-3 p-3 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_280px]">
              {/* ---------------- Panel cấu hình ---------------- */}
              <div className="flex flex-col rounded-xl border border-white/[0.06] bg-panel p-3">
                <div className="flex gap-1 rounded-lg border border-white/[0.06] bg-ink/50 p-1">
                  {engines.map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => setEngine(e.id)}
                      style={engine === e.id ? { boxShadow: `inset 0 0 0 1px ${e.hex}` } : undefined}
                      className={cn(
                        "flex flex-auto items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1.5 text-[11px] font-semibold transition",
                        engine === e.id ? "bg-white/[0.06] text-white" : "text-slate-400 hover:text-white",
                      )}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", e.dot)} />
                      {e.name}
                    </button>
                  ))}
                </div>

                {engine !== "seedance" ? (
                  <div className="mt-3 inline-flex w-fit gap-1 rounded-lg border border-white/[0.06] p-1">
                    {(["image", "video"] as const).map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setKinds((s) => ({ ...s, [engine]: k }))}
                        className={cn(
                          "rounded-md px-3 py-1 text-xs font-semibold transition",
                          kind === k ? "bg-cyan-glow/10 text-cyan-glow ring-1 ring-cyan-glow/50" : "text-slate-400 hover:text-white",
                        )}
                      >
                        {k === "image" ? "Tạo ảnh" : "Tạo video"}
                      </button>
                    ))}
                  </div>
                ) : null}

                <Label className="mt-3">Prompt</Label>
                <textarea
                  ref={promptRef}
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Mỗi prompt cách nhau 1 dòng trống"
                  rows={7}
                  spellCheck={false}
                  className="mt-1.5 w-full resize-y rounded-lg border border-white/[0.08] bg-ink/60 p-2.5 text-[12px] leading-5 text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-cyan-glow/50"
                />
                <p className="mt-1 text-[10px] text-slate-500">{prompts.length} prompt · mỗi prompt cách nhau 1 dòng trống</p>
                <div className="mt-2 flex gap-2">
                  <select
                    aria-label="Chèn mẫu prompt"
                    value=""
                    onChange={(e) => {
                      const tpl = templates.find((t) => t.name === e.target.value);
                      if (tpl) setPromptText((p) => (p.trim() ? `${p.trim()}\n\n${tpl.text}` : tpl.text));
                    }}
                    className="min-w-0 flex-1 rounded-lg border border-white/[0.08] bg-ink/60 px-2 py-1.5 text-xs text-slate-200 outline-none"
                  >
                    <option value="">Chèn mẫu prompt...</option>
                    {templates.map((t) => (
                      <option key={t.name} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const first = prompts[0];
                      if (!first) return;
                      setTemplates((t) => [...t, { name: `Mẫu của tôi ${t.length - TEMPLATES.length + 1}`, text: first }]);
                      showToast("Đã lưu prompt đầu tiên làm mẫu");
                    }}
                    className="rounded-lg border border-white/[0.08] px-2.5 text-xs font-semibold text-slate-200 hover:bg-white/5"
                  >
                    Lưu làm mẫu
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={cfgKey}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 space-y-3"
                  >
                    {modeSeg ? <SegGroup seg={modeSeg} value={cur[modeSeg.key]} onPick={(o) => setOpt(modeSeg.key, o)} /> : null}

                    {cfg.model ? (
                      <div>
                        <Label>Model</Label>
                        <div className="mt-1.5 rounded-lg border border-white/[0.08] bg-ink/60 px-2.5 py-1.5 text-xs text-slate-200">
                          {cfg.model}
                        </div>
                      </div>
                    ) : null}

                    {cfg.refs === "reference" ? (
                      <div className="space-y-2">
                        {cfg.toggles.map((tg) => (
                          <Toggle key={tg.key} label={tg.label} hint={tg.hint} on={Boolean(cur[tg.key])} onChange={(v) => setOpt(tg.key, v)} />
                        ))}
                        <Label>Ảnh tham chiếu (tối đa 6)</Label>
                        <div className="flex flex-wrap gap-1.5">
                          {Array.from({ length: refCount }).map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              aria-label={`Bỏ ảnh tham chiếu ${i + 1}`}
                              onClick={() => setRefCount((c) => c - 1)}
                              className="group relative h-10 w-10 overflow-hidden rounded-md ring-1 ring-white/15"
                            >
                              <Image src={THUMBS[(i + 1) % THUMBS.length]} alt="" fill sizes="40px" className="object-cover" />
                              <span className="absolute inset-0 hidden items-center justify-center bg-black/60 group-hover:flex">
                                <X className="h-3 w-3 text-white" />
                              </span>
                            </button>
                          ))}
                          {refCount < 6 ? (
                            <button
                              type="button"
                              onClick={() => setRefCount((c) => c + 1)}
                              className="flex h-10 items-center gap-1 rounded-md border border-dashed border-white/15 px-2 text-[11px] text-slate-400 hover:border-cyan-glow/50 hover:text-cyan-glow"
                            >
                              <Plus className="h-3 w-3" /> Ảnh
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ) : null}

                    {cfg.perPrompt || otherSegs.length ? (
                      <div className={cn(cfg.perPrompt && "grid grid-cols-[72px_1fr] gap-2")}>
                        {cfg.perPrompt ? (
                          <div>
                            <Label>Số ảnh</Label>
                            <select
                              aria-label="Số ảnh mỗi prompt"
                              value={String(cur.perPrompt)}
                              onChange={(e) => setOpt("perPrompt", e.target.value)}
                              className="mt-1.5 w-full rounded-lg border border-white/[0.08] bg-ink/60 px-2 py-1.5 text-xs text-slate-200 outline-none"
                            >
                              {["1", "2", "3", "4"].map((n) => (
                                <option key={n}>{n}</option>
                              ))}
                            </select>
                          </div>
                        ) : null}
                        <div className="space-y-3">
                          {otherSegs.map((sg) => (
                            <SegGroup key={sg.key} seg={sg} value={cur[sg.key]} onPick={(o) => setOpt(sg.key, o)} />
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {cfg.refs === "firstLast" ? (
                      <div>
                        <Label>
                          Ảnh đầu / Ảnh cuối <span className="font-normal normal-case italic text-slate-500">(tuỳ chọn)</span>
                        </Label>
                        <div className="mt-1.5 flex gap-2">
                          {(["first", "last"] as const).map((k) => (
                            <button
                              key={k}
                              type="button"
                              onClick={() => setFirstLast((s) => ({ ...s, [k]: !s[k] }))}
                              className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg border border-dashed border-white/15 text-[11px] text-slate-400 hover:border-cyan-glow/50"
                            >
                              {firstLast[k] ? (
                                <Image src={k === "first" ? THUMBS[2] : THUMBS[5]} alt="" fill sizes="56px" className="object-cover" />
                              ) : (
                                `+ ${k === "first" ? "Đầu" : "Cuối"}`
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {cfg.refs !== "reference"
                      ? cfg.toggles.map((tg) => (
                          <Toggle key={tg.key} label={tg.label} hint={tg.hint} on={Boolean(cur[tg.key])} onChange={(v) => setOpt(tg.key, v)} />
                        ))
                      : null}

                    {cfg.seed ? (
                      <div>
                        <Label>
                          Seed <span className="font-normal normal-case italic text-slate-500">(để trống = ngẫu nhiên)</span>
                        </Label>
                        <input
                          value={seed}
                          onChange={(e) => setSeed(e.target.value.replace(/\D/g, ""))}
                          placeholder="VD: 12345"
                          className="mt-1.5 w-full rounded-lg border border-white/[0.08] bg-ink/60 px-2.5 py-1.5 text-xs text-slate-200 outline-none placeholder:text-slate-600"
                        />
                      </div>
                    ) : null}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-auto space-y-2 pt-4">
                  <button
                    type="button"
                    onClick={() => enqueue(true)}
                    disabled={prompts.length === 0}
                    className="w-full rounded-lg bg-brand-gradient py-2.5 text-sm font-bold text-ink shadow-glow transition hover:brightness-110 disabled:opacity-50"
                  >
                    Tạo &amp; chạy
                  </button>
                  <button
                    type="button"
                    onClick={() => enqueue(false)}
                    disabled={prompts.length === 0}
                    className="w-full rounded-lg border border-white/[0.08] bg-ink/40 py-2 text-xs font-semibold text-slate-200 hover:bg-white/5 disabled:opacity-50"
                  >
                    Chỉ thêm vào hàng đợi
                  </button>
                </div>
              </div>

              {/* ---------------- Danh sách task ---------------- */}
              <div className="flex min-h-[300px] min-w-0 flex-col rounded-xl lg:min-h-[460px] border border-white/[0.06] bg-panel">
                <div className="space-y-2 border-b border-white/[0.06] p-3">
                  <div className="flex gap-2">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Tìm prompt..."
                      className="min-w-0 flex-1 rounded-lg border border-white/[0.08] bg-ink/60 px-2.5 py-1.5 text-xs text-slate-200 outline-none placeholder:text-slate-600 focus:border-cyan-glow/50"
                    />
                    <select
                      aria-label="Lọc trạng thái"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as "all" | Status)}
                      className="rounded-lg border border-white/[0.08] bg-ink/60 px-2 text-xs text-slate-200 outline-none"
                    >
                      <option value="all">Mọi trạng thái</option>
                      <option value="queued">Đang chờ</option>
                      <option value="running">Đang chạy</option>
                      <option value="done">Xong</option>
                      <option value="error">Lỗi</option>
                    </select>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <SmallBtn onClick={() => setSelected(new Set(tasks.filter((t) => t.status === "error").map((t) => t.id)))}>
                      Chọn lỗi
                    </SmallBtn>
                    <SmallBtn onClick={() => setSelected(new Set(tasks.filter((t) => t.status === "queued").map((t) => t.id)))}>
                      Chọn chưa chạy
                    </SmallBtn>
                    <label className="ml-1 flex items-center gap-1.5 text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={() => setSelected(allVisibleSelected ? new Set() : new Set(visible.map((t) => t.id)))}
                        className="h-3.5 w-3.5 accent-cyan-400"
                      />
                      {visible.length} task{selected.size ? ` · đã chọn ${selected.size}` : ""}
                    </label>
                    <select
                      aria-label="Sắp xếp"
                      value={sort}
                      onChange={(e) => setSort(e.target.value as "new" | "old")}
                      className="ml-auto rounded-lg border border-white/[0.08] bg-ink/60 px-2 py-1 text-xs text-slate-200 outline-none"
                    >
                      <option value="new">Mới nhất</option>
                      <option value="old">Cũ nhất</option>
                    </select>
                  </div>
                </div>

                <div className="max-h-[420px] flex-1 overflow-y-auto">
                  {visible.length === 0 ? (
                    <p className="p-8 text-center text-xs text-slate-500">Không có task phù hợp.</p>
                  ) : (
                    visible.map((t) => (
                      <TaskRow
                        key={t.id}
                        task={t}
                        active={t.id === active?.id}
                        checked={selected.has(t.id)}
                        onCheck={() => toggleSel(t.id)}
                        onClick={() => setActiveId(t.id)}
                      />
                    ))
                  )}
                </div>

                <div className="flex flex-wrap gap-2 border-t border-white/[0.06] p-3">
                  <SmallBtn onClick={run}>Chạy</SmallBtn>
                  <SmallBtn onClick={stop}>Dừng</SmallBtn>
                  <SmallBtn onClick={remove} className="text-neon-pink">
                    Xoá
                  </SmallBtn>
                  <SmallBtn onClick={retryErrors}>Chạy lại lỗi</SmallBtn>
                  <SmallBtn onClick={merge}>Ghép video</SmallBtn>
                </div>
              </div>

              {/* ---------------- Xem trước ---------------- */}
              <div className="rounded-xl border border-white/[0.06] bg-panel p-3 lg:col-span-2 xl:col-span-1">
                {active ? (
                  <Preview
                    task={active}
                    onOpen={() => showToast("Trong app: mở file tại D:\\MeAI\\output")}
                    onRecreate={() => recreate(active)}
                    onEdit={() => edit(active)}
                  />
                ) : (
                  <p className="p-6 text-center text-xs text-slate-500">Chưa có task nào.</p>
                )}
              </div>
            </div>
            )}
            </div>
          </div>

          <AnimatePresence>
            {toast ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-cyan-glow/40 bg-ink/95 px-4 py-2 text-xs font-medium text-cyan-glow shadow-glow-sm"
              >
                {toast}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <p className="mt-4 text-center text-xs text-slate-500">
          Bản demo dùng dữ liệu mô phỏng. Ảnh xem trước lấy từ thành phẩm thật tạo bằng MeAI.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-[11px] font-semibold text-slate-300", className)}>{children}</p>;
}

function SegGroup({ seg, value, onPick }: { seg: Seg; value: OptValue; onPick: (o: string) => void }) {
  return (
    <div>
      <Label>{seg.label}</Label>
      <div className="mt-1.5 flex gap-1 rounded-lg border border-white/[0.06] p-1">
        {seg.options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onPick(o)}
            className={cn(
              "min-w-0 flex-1 whitespace-nowrap rounded-md px-1 py-1 text-[11px] font-medium transition",
              value === o ? "bg-cyan-glow/10 text-cyan-glow ring-1 ring-cyan-glow/60" : "text-slate-400 hover:text-white",
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function SmallBtn({ children, onClick, className }: { children: React.ReactNode; onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md border border-white/[0.08] bg-ink/50 px-2.5 py-1 text-[11px] font-semibold text-slate-200 transition hover:bg-white/10",
        className,
      )}
    >
      {children}
    </button>
  );
}

function Toggle({ label, hint, on, onChange }: { label: string; hint?: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!on)} className="flex items-center gap-2.5 text-left text-xs text-slate-200">
      <span
        className={cn(
          "relative h-4 w-7 shrink-0 rounded-full transition",
          on ? "bg-gradient-to-r from-cyan-glow to-neon-pink" : "bg-white/15",
        )}
      >
        <span className={cn("absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all", on ? "left-3.5" : "left-0.5")} />
      </span>
      {label}
      {hint ? <span className="text-[10px] text-slate-500">({hint})</span> : null}
    </button>
  );
}

function StatusPill({ task }: { task: Task }) {
  const map: Record<Status, { cls: string; text: string }> = {
    queued: { cls: "border-white/15 text-slate-400", text: task.attempts ? `Thử lại ${task.attempts}/${RETRY_LIMIT}` : "Chờ" },
    running: { cls: "border-violet-400/40 text-violet-300", text: `${task.progress}%` },
    done: { cls: "border-cyan-glow/50 bg-cyan-glow/10 text-cyan-glow", text: "Xong" },
    error: { cls: "border-neon-pink/50 bg-neon-pink/10 text-neon-pink", text: "Lỗi" },
  };
  const s = map[task.status];
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold", s.cls)}>
      {task.status === "running" ? <LoaderCircle className="h-3 w-3 animate-spin" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {s.text}
    </span>
  );
}

function metaOf(t: Task) {
  const acc = t.account ?? t.lastAccount;
  return [
    t.kind === "image" ? "Ảnh" : "Video",
    t.ratio,
    t.extra,
    acc !== null ? `Tài khoản ${acc + 1}` : null,
    t.elapsed ? `${fmtTime(t.elapsed)} ${t.date}` : t.date,
  ]
    .filter(Boolean)
    .join(" · ");
}

function EngineBadge({ id }: { id: EngineId }) {
  const e = engineInfo(id);
  return (
    <span className={cn("rounded px-1.5 py-px text-[9px] font-bold ring-1 ring-current", e.text)}>{e.short}</span>
  );
}

function TaskRow({
  task,
  active,
  checked,
  onCheck,
  onClick,
}: {
  task: Task;
  active: boolean;
  checked: boolean;
  onCheck: () => void;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onClick}
      className={cn(
        "relative flex cursor-pointer items-center gap-2.5 border-b border-white/[0.04] px-3 py-2 transition",
        active ? "bg-cyan-glow/[0.07]" : "hover:bg-white/[0.02]",
      )}
    >
      {active ? <span className="absolute inset-y-0 left-0 w-0.5 bg-cyan-glow" /> : null}
      <input
        type="checkbox"
        checked={checked}
        onChange={onCheck}
        onClick={(e) => e.stopPropagation()}
        aria-label={`Chọn task ${task.id}`}
        className="h-3.5 w-3.5 shrink-0 accent-cyan-400"
      />
      <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-white/5">
        {task.status === "done" ? (
          <Image src={task.thumb} alt="" fill sizes="36px" className="object-cover" />
        ) : task.status === "error" ? (
          <TriangleAlert className="absolute inset-0 m-auto h-4 w-4 text-neon-pink" />
        ) : task.status === "running" ? (
          <LoaderCircle className="absolute inset-0 m-auto h-4 w-4 animate-spin text-violet-300" />
        ) : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-semibold text-slate-100">{task.prompt}</span>
        <span className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[10px] text-slate-500">
          <EngineBadge id={task.engine} />
          <span className="truncate">{metaOf(task)}</span>
        </span>
        {task.status === "running" ? (
          <span className="mt-1 block h-0.5 overflow-hidden rounded-full bg-white/[0.06]">
            <span className="block h-full w-full origin-left bg-brand-gradient transition-transform duration-300" style={{ transform: `scaleX(${task.progress / 100})` }} />
          </span>
        ) : null}
      </span>
      <StatusPill task={task} />
    </motion.div>
  );
}

function Preview({ task, onOpen, onRecreate, onEdit }: { task: Task; onOpen: () => void; onRecreate: () => void; onEdit: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-center rounded-lg bg-ink/50 p-2">
        <div
          className="relative w-full max-w-[260px] overflow-hidden rounded-md bg-white/5"
          style={{ aspectRatio: ratioToAspect(task.ratio), maxHeight: 280 }}
        >
          {task.status === "done" ? (
            <>
              <Image src={task.thumb} alt="Ảnh xem trước thành phẩm" fill sizes="260px" className="object-cover object-top" />
              {task.kind === "video" ? (
                <span className="absolute inset-0 m-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink">
                  <Play className="h-4 w-4 fill-current" />
                </span>
              ) : null}
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 text-center text-[11px] text-slate-400">
              {task.status === "running" ? (
                <>
                  <LoaderCircle className="h-6 w-6 animate-spin text-cyan-glow" />
                  Đang tạo trên Tài khoản {(task.account ?? 0) + 1}… {task.progress}%
                </>
              ) : task.status === "error" ? (
                <>
                  <TriangleAlert className="h-6 w-6 text-neon-pink" />
                  Lỗi sau {task.attempts} lần thử — bấm “Chạy lại lỗi”
                </>
              ) : (
                <>Đang chờ tài khoản rảnh</>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
        <StatusPill task={task} />
        <EngineBadge id={task.engine} />
        <span>{metaOf(task)}</span>
      </div>
      <p className="mt-3 text-[11px] font-semibold text-slate-300">Prompt</p>
      <p className="mt-1 max-h-28 overflow-y-auto whitespace-pre-line text-[11px] leading-5 text-slate-400">{task.prompt}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <SmallBtn onClick={onOpen}>
          <FolderOpen className="mr-1 inline h-3 w-3" />
          Mở file
        </SmallBtn>
        <SmallBtn onClick={onRecreate}>Tạo lại</SmallBtn>
        <SmallBtn onClick={onEdit}>Chỉnh sửa</SmallBtn>
      </div>
    </div>
  );
}
