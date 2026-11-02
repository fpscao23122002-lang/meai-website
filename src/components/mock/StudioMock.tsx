import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { FolderOpen, LoaderCircle, Plus } from "lucide-react";
import { engines, isVideoOnly, type EngineId } from "@/lib/data";
import { ALL_MEDIA, ENGINE_MEDIA, pickMedia, type Media } from "@/lib/showcase";
import { MockVideo } from "./MockVideo";
import { CONFIGS, DEFAULT_OPTS, type Kind, type OptValue } from "@/lib/studioConfig";
import { useDemoControl, useScript, useTask } from "@/hooks/useScript";
import { AppFrame, Btn, Caret, FakeCursor, Field, Interactive, Label, Panel, ProgressBar, Seg, StatusPill, Toast, Toggle } from "./atoms";
import { pointTo } from "./mockUtils";
import { useIndicator } from "@/hooks/useIndicator";
import { cn } from "@/lib/cn";

type Task = {
  id: number;
  title: string;
  engine: EngineId;
  kind: Kind;
  ratio: string;
  status: "wait" | "run" | "done" | "error";
  progress: number;
  account: number | null;
  media: Media;
  time: string;
};

/** Prompt mẫu khớp với thành phẩm của từng nền tảng (xem lib/showcase.ts) */
const PROMPTS: Record<EngineId, string> = {
  muse: "Cô gái váy đỏ cầm chai nước hoa,\ngiới thiệu trong cửa hàng\n\nCây thông, đèn bông tuyết,\nngười tuyết LED bừng sáng",
  flow: "Người đàn ông nhìn tấm ảnh cũ\nsau ô kính vỡ, hồi ức cánh đồng hoa\n\nPhi thuyền lao vào hố đen,\nrồng đen, thế giới giả tưởng",
  seedance: "Hai kiếm sĩ giao đấu\ndưới mưa hoa anh đào, tia lửa toé\n\nCận cảnh lưỡi kiếm chạm nhau,\ncánh hoa bay, quay chậm",
  kling: "Người mẫu váy satin đen,\ntạo dáng trước quán cà phê phố cổ\n\nChiến đấu cơ giữa mây lửa,\nphượng hoàng bay qua rừng nấm",
  dola: "Chú Samoyed mặc áo ông già Noel,\ncả nhà bật cười bên lò sưởi\n\nGia đình đón Noel ấm áp,\ncây thông lung linh phía sau",
};

const SEED_TASKS: Task[] = [
  {
    id: 2,
    title: ENGINE_MEDIA.muse[0].title,
    engine: "muse",
    kind: "video",
    ratio: "9:16",
    status: "done",
    progress: 100,
    account: 1,
    media: ENGINE_MEDIA.muse[0],
    time: "00:48",
  },
  {
    id: 1,
    title: ENGINE_MEDIA.dola[0].title,
    engine: "dola",
    kind: "video",
    ratio: "9:16",
    status: "done",
    progress: 100,
    account: 2,
    media: ENGINE_MEDIA.dola[0],
    time: "00:52",
  },
];

/** Demo tự chạy lần lượt qua 5 nền tảng; mỗi lượt chọn đúng khung hình của thành phẩm */
const ORDER: { engine: EngineId; kind: Kind; ratio: string }[] = [
  { engine: "muse", kind: "video", ratio: "9:16" },
  { engine: "flow", kind: "video", ratio: "16:9" },
  { engine: "seedance", kind: "video", ratio: "9:16" },
  { engine: "kling", kind: "video", ratio: "9:16" },
  { engine: "dola", kind: "video", ratio: "9:16" },
];

const engineOf = (id: EngineId) => engines.find((e) => e.id === id)!;

/**
 * Bản dựng màn hình Studio bằng code, tự chạy theo kịch bản:
 * gõ prompt → chọn tỉ lệ → Tạo & chạy → hàng đợi chia tài khoản → thành phẩm hiện ở khung xem trước.
 */
export function StudioMock({ fixedEngine, className }: { fixedEngine?: { engine: EngineId; kind: Kind }; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { margin: "-10% 0px" });
  const reduce = useReducedMotion();

  const [mode, setMode] = useState<{ engine: EngineId; kind: Kind }>(fixedEngine ?? ORDER[0]);
  const cfgKey = `${mode.engine}-${mode.kind}`;
  const cfg = CONFIGS[cfgKey];
  const [opts, setOpts] = useState<Record<string, OptValue>>(DEFAULT_OPTS[cfgKey]);
  const [prompt, setPrompt] = useState("");
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS);
  const [preview, setPreview] = useState<Task>(SEED_TASKS[0]);
  const [cursor, setCursor] = useState({ x: 40, y: 40, click: 0, visible: false });
  const [pressed, setPressed] = useState<string | null>(null);
  const [toastOn, setToastOn] = useState(false);
  const [toastText, setToastText] = useState("");
  const setToast = (t: string | null) => {
    if (t) setToastText(t);
    setToastOn(Boolean(t));
  };
  const cycle = useRef(0);
  const nextId = useRef(3);

  const busy = tasks.filter((t) => t.status === "run").length;
  const ctl = useDemoControl(Boolean(inView && !reduce));
  const engInd = useIndicator(mode.engine);
  const task = useTask();

  // Người dùng tự thao tác
  const pickEngine = (engine: EngineId) => {
    const kind: Kind = isVideoOnly(engine) ? "video" : mode.kind;
    setMode({ engine, kind });
    setOpts({ ...DEFAULT_OPTS[`${engine}-${kind}`] });
  };
  const pickKind = (label: string) => {
    const kind: Kind = label === "Tạo ảnh" ? "image" : "video";
    setMode((m) => ({ ...m, kind }));
    setOpts({ ...DEFAULT_OPTS[`${mode.engine}-${kind}`] });
  };
  const setOpt = (key: string, v: OptValue) => setOpts((o) => ({ ...o, [key]: v }));

  const moveTo = (selector: string) => {
    const el = wrapRef.current?.querySelector<HTMLElement>(selector) ?? null;
    const p = pointTo(wrapRef.current, el);
    if (p) setCursor((c) => ({ ...c, ...p, visible: true }));
  };
  const click = (id?: string) => {
    setCursor((c) => ({ ...c, click: c.click + 1 }));
    if (id) setPressed(`${id}-${Date.now()}`);
  };

  /** Tạo task từ prompt → chia tài khoản → chạy tiến độ → hiện thành phẩm (dùng chung cho demo tự chạy & khi người dùng bấm) */
  const runQueue = async (wait: (ms: number) => Promise<void>, m: { engine: EngineId; kind: Kind }, ratioOpt: string, text: string) => {
    const titles = text
      .split(/\n\s*\n/)
      .map((p) => p.replace(/\n/g, " ").trim())
      .filter(Boolean)
      .slice(0, 3);
    if (!titles.length) {
      setToast("Nhập ít nhất 1 prompt (mỗi prompt cách nhau 1 dòng trống)");
      await wait(1800);
      setToast(null);
      return;
    }
    const created: Task[] = titles.map((title, i) => ({
      id: nextId.current++,
      title,
      engine: m.engine,
      kind: m.kind,
      ratio: ratioOpt,
      status: "wait",
      progress: 0,
      account: null,
      media: pickMedia(m.engine, ratioOpt, i),
      time: "00:00",
    }));
    const ids = created.map((t) => t.id);
    setTasks((prev) => [...created.slice().reverse(), ...prev].slice(0, 5));
    setToast(`Đã tạo ${created.length} task — đang chia cho tài khoản rảnh`);
    await wait(700);

    setTasks((prev) => prev.map((t) => (ids.includes(t.id) ? { ...t, status: "run", account: ids.indexOf(t.id) + 1 } : t)));
    await wait(300);
    setToast(null);

    let progress = titles.map(() => 0);
    let secs = 0;
    let shown = false;
    while (progress.some((p) => p < 100)) {
      progress = progress.map((p, i) => Math.min(100, p + (i === 0 ? 7 : 5 - Math.min(i, 2)) + Math.round(Math.random() * 5)));
      secs += 2;
      const snap = progress;
      setTasks((prev) =>
        prev.map((t) => {
          const i = ids.indexOf(t.id);
          if (i < 0) return t;
          const p = snap[i];
          const time = `00:${String(Math.min(59, 8 + secs)).padStart(2, "0")}`;
          return p >= 100 ? { ...t, status: "done", progress: 100, time } : { ...t, progress: p, time };
        }),
      );
      if (snap[0] >= 100 && !shown) {
        // Task đầu xong → hiện ngay lên khung xem trước
        shown = true;
        setPreview({ ...created[0], status: "done", progress: 100, account: 1 });
      }
      await wait(170);
    }
    setToast("Xong · đã lưu vào Thư viện");
    await wait(2600);
    setToast(null);
  };

  useScript(ctl.active, async ({ wait, type }) => {
    const step = ORDER[cycle.current % ORDER.length];
    const m = fixedEngine ?? step;
    const key = `${m.engine}-${m.kind}`;
    cycle.current += 1;
    setMode(m);
    setOpts({ ...DEFAULT_OPTS[key] });
    setPrompt("");
    await wait(700);

    moveTo('[data-target="prompt"]');
    await wait(700);
    click();
    await type(PROMPTS[m.engine], setPrompt, 20);
    await wait(350);

    // Chọn khung hình có trong tuỳ chọn của engine (Flow video: 16:9 / 9:16…)
    const ratioOpts = CONFIGS[key].segs.find((sg) => sg.key === "ratio")?.options ?? ["9:16"];
    const wanted = fixedEngine ? (m.kind === "image" ? "16:9" : "9:16") : step.ratio;
    const ratioOpt = ratioOpts.includes(wanted) ? wanted : ratioOpts[0];
    moveTo(`[data-opt="${uid}-ratio:${ratioOpt}"]`);
    await wait(750);
    click();
    setOpts((o) => ({ ...o, ratio: ratioOpt }));
    await wait(500);

    moveTo('[data-target="run"]');
    await wait(800);
    click("run");

    setCursor((c) => ({ ...c, visible: false }));
    await runQueue(wait, m, ratioOpt, PROMPTS[m.engine]);
    await wait(600);
  });

  const modeSeg = cfg.segs.find((s) => s.key === "mode");
  const otherSegs = cfg.segs.filter((s) => s.key !== "mode");

  return (
    <Interactive user={ctl.user} onTakeOver={ctl.takeOver} onReplay={ctl.replay}>
    <div ref={wrapRef} className={cn("relative", className)}>
      <AppFrame title="Studio" active="studio" free={2 - busy} total={2}>
        <div className="grid gap-2.5 md:grid-cols-[232px_minmax(0,1fr)] xl:grid-cols-[232px_minmax(0,1fr)_190px]">
          {/* Panel cấu hình */}
          <Panel className="space-y-2.5 p-2.5">
            <div ref={engInd.containerRef} className="relative flex gap-0.5 rounded-md border border-white/[0.06] bg-ink/50 p-0.5">
              <span
                aria-hidden
                style={{ ...engInd.style, boxShadow: `inset 0 0 0 1px ${engineOf(mode.engine).hex}` }}
                className="pointer-events-none absolute left-0 top-0 rounded bg-white/[0.06] will-change-transform"
              />
              {engines.map((en) => (
                <button
                  type="button"
                  key={en.id}
                  data-ind={en.id}
                  onClick={() => pickEngine(en.id)}
                  className={cn(
                    "relative flex flex-1 items-center justify-center gap-0.5 whitespace-nowrap rounded px-0.5 py-1 text-[9.5px] font-semibold tracking-tight",
                    en.id === mode.engine ? "text-white" : "text-slate-500 hover:text-white",
                  )}
                >
                  <span className={cn("relative h-1.5 w-1.5 rounded-full", en.dot)} />
                  <span className="relative">{en.short}</span>
                </button>
              ))}
            </div>

            {!isVideoOnly(mode.engine) ? (
              <Seg
                layoutKey={`${uid}-kind`}
                options={["Tạo ảnh", "Tạo video"]}
                value={mode.kind === "image" ? "Tạo ảnh" : "Tạo video"}
                onPick={pickKind}
                className="w-36"
              />
            ) : null}

            <div>
              <Label>Prompt</Label>
              {ctl.user ? (
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Mỗi prompt cách nhau 1 dòng trống"
                  spellCheck={false}
                  className="mt-1 h-[88px] w-full resize-none rounded-md border border-cyan-glow/40 bg-ink/60 px-2 py-1 text-[11px] leading-[15px] text-slate-200 outline-none placeholder:text-slate-600 focus:border-cyan-glow/70"
                />
              ) : (
                <Field className="mt-1 h-[88px] overflow-hidden whitespace-pre-wrap leading-[15px]">
                  <span data-target="prompt">
                    {prompt ? prompt : <span className="text-slate-600">Mỗi prompt cách nhau 1 dòng trống</span>}
                    <Caret show={Boolean(prompt)} />
                  </span>
                </Field>
              )}
            </div>
            <div className="hidden gap-1.5 sm:flex">
              <Field className="min-w-0 flex-1 truncate text-slate-300">Chèn mẫu prompt…</Field>
              <Btn>Lưu làm mẫu</Btn>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={cfgKey}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                {modeSeg ? (
                  <div>
                    <Label>{modeSeg.label}</Label>
                    <Seg layoutKey={`${uid}-mode`} options={modeSeg.options} value={String(opts.mode)} onPick={(o) => setOpt("mode", o)} className="mt-1" />
                  </div>
                ) : null}
                {cfg.model ? (
                  <div className="hidden sm:block">
                    <Label>Model</Label>
                    <Field className="mt-1">{cfg.model}</Field>
                  </div>
                ) : null}
                {cfg.refs === "reference" ? (
                  <div className="hidden space-y-1.5 sm:block">
                    <Toggle on={false} label="Người mẫu" hint="0 ảnh" />
                    <Toggle on label="Ảnh luân phiên" hint="1 ảnh" />
                    <Label>Ảnh tham chiếu (tối đa 6)</Label>
                    <div className="flex gap-1">
                      {ALL_MEDIA.slice(0, 3).map((md) => (
                        <img key={md.poster} src={md.poster} alt="" className="h-8 w-8 rounded object-cover ring-1 ring-white/15" />
                      ))}
                      <span className="flex h-8 w-8 items-center justify-center rounded border border-dashed border-white/15 text-slate-500">
                        <Plus className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                ) : null}
                {otherSegs.map((sg) => (
                  <div key={sg.key} className={cn(sg.key !== "ratio" && "hidden sm:block")}>
                    <Label>{sg.label}</Label>
                    <Seg
                      layoutKey={`${uid}-${sg.key}`}
                      options={sg.options}
                      value={String(opts[sg.key])}
                      className="mt-1"
                      dataKey={`${uid}-${sg.key}`}
                      onPick={(o) => setOpt(sg.key, o)}
                    />
                  </div>
                ))}
                {cfg.refs === "firstLast" ? (
                  <div className="hidden gap-1.5 sm:flex">
                    {["+ Đầu", "+ Cuối"].map((t) => (
                      <span key={t} className="flex h-10 w-10 items-center justify-center rounded-md border border-dashed border-white/15 text-[10px] text-slate-400">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
                {cfg.refs !== "reference" ? (
                  <div className="hidden space-y-1.5 sm:block">
                    {cfg.toggles.map((t) => (
                      <Toggle key={t.key} on={Boolean(opts[t.key])} label={t.label} onChange={(v) => setOpt(t.key, v)} />
                    ))}
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>

            <div className="space-y-1.5 pt-1">
              <span data-target="run" className="block">
                <Btn
                  variant="primary"
                  className="w-full py-1.5 text-[12px]"
                  pressed={pressed?.startsWith("run")}
                  onClick={() => task((w) => runQueue(w, mode, String(opts.ratio ?? "9:16"), prompt))}
                >
                  Tạo &amp; chạy
                </Btn>
              </span>
              <Btn className="hidden w-full py-1.5 sm:flex">Chỉ thêm vào hàng đợi</Btn>
            </div>
          </Panel>

          {/* Hàng đợi */}
          <Panel className="flex min-w-0 flex-col p-0">
            <div className="space-y-1.5 border-b border-white/[0.06] p-2.5">
              <div className="flex gap-1.5">
                <Field className="flex-1 text-slate-600">Tìm prompt…</Field>
                <Field className="text-slate-300">Mọi trạng thái</Field>
              </div>
              <div className="flex items-center gap-1.5">
                <Btn>Chọn lỗi</Btn>
                <Btn>Chọn chưa chạy</Btn>
                <span className="ml-auto text-[10.5px] text-slate-400">{tasks.length} task · Mới nhất</span>
              </div>
            </div>
            <div className="min-h-[188px] flex-1">
              <AnimatePresence initial={false}>
                {tasks.map((t) => {
                  const en = engineOf(t.engine);
                  const active = t.id === preview.id;
                  return (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, x: -24, height: 0, backgroundColor: "rgba(0,240,255,0.18)" }}
                      animate={{ opacity: 1, x: 0, height: "auto", backgroundColor: active ? "rgba(0,240,255,0.06)" : "rgba(0,0,0,0)" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      onClick={() => t.status === "done" && setPreview(t)}
                      className="relative flex cursor-pointer items-center gap-2 overflow-hidden border-b border-white/[0.04] px-2.5 py-1.5"
                    >
                      <span
                        className={cn(
                          "absolute inset-y-0 left-0 w-0.5 origin-top bg-cyan-glow transition-transform duration-300",
                          active ? "scale-y-100" : "scale-y-0",
                        )}
                      />
                      <span className="h-3 w-3 shrink-0 rounded-[3px] border border-white/20" />
                      <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md bg-white/5">
                        <AnimatePresence>
                          {t.status === "done" ? (
                            <motion.img
                              key="img"
                              src={t.media.poster}
                              alt=""
                              initial={{ opacity: 0, scale: 1.4, filter: "blur(6px)" }}
                              animate={{ opacity: 1, scale: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
                              className="absolute inset-0 h-full w-full object-cover object-top"
                            />
                          ) : t.status === "run" ? (
                            <LoaderCircle className="absolute inset-0 m-auto h-3.5 w-3.5 animate-spin text-violet-300" />
                          ) : null}
                        </AnimatePresence>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[11px] font-semibold text-slate-100">{t.title}</span>
                        <span className="mt-0.5 flex items-center gap-1 text-[9.5px] text-slate-500">
                          <span className={cn("rounded px-1 font-bold ring-1 ring-current", en.text)}>{en.short}</span>
                          <span className="truncate">
                            {t.kind === "image" ? "Ảnh" : "Video"} · {t.ratio}
                            {t.account ? ` · Tài khoản ${t.account}` : ""} · {t.time}
                          </span>
                        </span>
                        {t.status === "run" ? <ProgressBar value={t.progress} className="mt-1" /> : null}
                      </span>
                      <StatusPill status={t.status} progress={t.progress} />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            <div className="hidden flex-wrap gap-1.5 border-t border-white/[0.06] p-2.5 sm:flex">
              <Btn>Chạy</Btn>
              <Btn>Dừng</Btn>
              <Btn variant="danger">Xoá</Btn>
              <Btn>Chạy lại lỗi</Btn>
              <Btn>Ghép video</Btn>
            </div>
          </Panel>

          {/* Xem trước */}
          <Panel className="hidden p-2.5 xl:block">
            <div className="flex justify-center rounded-lg bg-ink/50 p-1.5">
              <div
                className="relative w-full overflow-hidden rounded-md bg-white/5"
                style={{ aspectRatio: preview.ratio.replace(":", " / "), maxHeight: 220, maxWidth: preview.ratio === "9:16" ? 124 : undefined }}
              >
                {/* Task xong → thành phẩm hiện lên; video tự phát (tắt tiếng, lặp) */}
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={preview.id}
                    initial={{ opacity: 0, scale: 1.12 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0"
                  >
                    {preview.kind === "video" ? (
                      <MockVideo media={preview.media} />
                    ) : (
                      <img src={preview.media.poster} alt="Thành phẩm" className="absolute inset-0 h-full w-full object-cover object-top" />
                    )}
                  </motion.div>
                </AnimatePresence>
                {preview.kind === "video" ? (
                  <span className="absolute left-1 top-1 flex items-center gap-1 rounded bg-black/55 px-1 py-0.5 text-[8.5px] font-semibold text-white">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Đang phát
                  </span>
                ) : null}
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1 text-[9.5px] text-slate-500">
              <StatusPill status="done" />
              <span className={cn("rounded px-1 font-bold ring-1 ring-current", engineOf(preview.engine).text)}>{engineOf(preview.engine).short}</span>
              {preview.kind === "image" ? "Ảnh" : "Video"} · {preview.ratio}
            </div>
            <Label className="mt-2">Prompt</Label>
            <p className="mt-0.5 line-clamp-4 text-[10.5px] leading-4 text-slate-400">{preview.title}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              <Btn>
                <FolderOpen className="h-3 w-3" /> Mở file
              </Btn>
              <Btn>Tạo lại</Btn>
              <Btn>Chỉnh sửa</Btn>
            </div>
          </Panel>
        </div>
      </AppFrame>
      <FakeCursor {...cursor} visible={cursor.visible && !ctl.user} />
      <Toast show={toastOn}>{toastText}</Toast>
    </div>
    </Interactive>
  );
}
