import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, FolderOpen, Play } from "lucide-react";
import { useDemoControl, useScript, useTask } from "@/hooks/useScript";
import { AppFrame, Btn, Field, Interactive, PTitle, ProgressBar, Seg, Toast } from "../atoms";
import { cn } from "@/lib/cn";

const ITEMS = [
  { src: "/samples/video-1.webp", video: true },
  { src: "/samples/anh-1.webp", video: false, wide: true },
  { src: "/samples/video-3.webp", video: true },
  { src: "/samples/video-4.webp", video: true },
  { src: "/samples/video-5.webp", video: true },
  { src: "/samples/video-2.webp", video: true },
];

/** Thư viện: thành phẩm lưu trên máy, chọn nhiều video → Ghép video */
export function ThuVienMock({ play }: { play: boolean }) {
  const [shown, setShown] = useState(0);
  const [filter, setFilter] = useState("Mọi dự án");
  const [selected, setSelected] = useState<number[]>([]);
  const [merging, setMerging] = useState(-1);
  const [toast, setToast] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [toastText, setToastText] = useState("");
  const ctl = useDemoControl(play);
  const task = useTask();

  const merge = async (wait: (ms: number) => Promise<void>, count: number) => {
    if (count < 2) {
      setToastText("Chọn ít nhất 2 video để ghép");
      setToast(true);
      await wait(1600);
      setToast(false);
      return;
    }
    setPressed(true);
    await wait(250);
    setPressed(false);
    for (let p = 0; p <= 100; p += 10) {
      setMerging(p);
      await wait(110);
    }
    setToastText(`Đã ghép ${count} video → Thư viện`);
    setToast(true);
    await wait(2000);
    setToast(false);
    setMerging(-1);
  };

  const toggleSel = (i: number) => setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

  useScript(ctl.active, async ({ wait }) => {
    setShown(0);
    setFilter("Mọi dự án");
    setSelected([]);
    setMerging(-1);
    setToast(false);
    for (let i = 1; i <= ITEMS.length; i++) {
      await wait(160);
      setShown(i);
    }
    await wait(700);
    setFilter("Video");
    await wait(700);
    for (const i of [0, 2, 3]) {
      setSelected((s) => [...s, i]);
      await wait(380);
    }
    await wait(300);
    await merge(wait, 3);
    await wait(500);
  });

  const visible = ITEMS.map((it, i) => ({ ...it, i })).filter(
    (it) => filter === "Mọi dự án" || (filter === "Video" && it.video) || (filter === "Ảnh" && !it.video),
  );

  return (
    <Interactive user={ctl.user} onTakeOver={ctl.takeOver} onReplay={ctl.replay}>
    <div className="relative">
      <AppFrame title="Thư viện" active="thu-vien">
        <div className="flex flex-wrap items-center gap-2">
          <div>
            <PTitle>Thư viện</PTitle>
            <p className="font-mono text-[10px] text-slate-500">D:\MeAI\output</p>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-1.5">
            <Field className="hidden text-slate-300 sm:block">Mọi dự án</Field>
            <Seg
              layoutKey="tv-filter"
              options={["Mọi dự án", "Ảnh", "Video"]}
              value={filter}
              onPick={(f) => {
                setFilter(f);
                setShown(ITEMS.length);
              }}
              className="w-48"
            />
            <Btn>
              <FolderOpen className="h-3 w-3" /> Mở thư mục
            </Btn>
          </div>
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="text-[10.5px] text-slate-400">Đã chọn {selected.length}</span>
          <Btn variant={selected.length >= 2 ? "primary" : "default"} pressed={pressed} onClick={() => task((w) => merge(w, selected.length))}>
            Ghép video
          </Btn>
          <Btn
            onClick={() =>
              task(async (w) => {
                setToastText(selected.length ? `Đã lưu ${selected.length} mục vào Tư liệu` : "Chọn ảnh/video để lưu vào Tư liệu");
                setToast(true);
                await w(1600);
                setToast(false);
              })
            }
          >
            Lưu vào Tư liệu…
          </Btn>
          {merging >= 0 ? <ProgressBar value={merging} className="ml-auto w-28" /> : null}
        </div>
        <motion.div layout className="mt-2.5 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          <AnimatePresence>
            {visible.slice(0, shown).map((it) => {
              const sel = selected.includes(it.i);
              return (
                <motion.div
                  key={it.src}
                  layout
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleSel(it.i)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleSel(it.i)}
                  initial={{ opacity: 0, scale: 0.7, rotate: -4 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className={cn(
                    "group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-lg ring-1 transition-shadow",
                    sel ? "ring-2 ring-cyan-glow shadow-[0_0_18px_-4px_rgba(0,240,255,0.8)]" : "ring-white/10",
                  )}
                >
                  <img src={it.src} alt="" className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110" />
                  {it.video ? (
                    <span className="absolute bottom-1 left-1 flex items-center gap-0.5 rounded bg-black/60 px-1 text-[9px] text-white">
                      <Play className="h-2 w-2 fill-current" /> 0:08
                    </span>
                  ) : null}
                  <AnimatePresence>
                    {sel ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-glow text-ink"
                      >
                        <Check className="h-2.5 w-2.5" strokeWidth={4} />
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                  <span className="absolute inset-x-1 bottom-1 hidden justify-end sm:flex">
                    <span className="rounded bg-ink/80 px-1 text-[8.5px] font-semibold text-pink-300 opacity-0 transition group-hover:opacity-100">
                      Đăng FB Reels
                    </span>
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </AppFrame>
      <Toast show={toast}>{toastText || "Đã ghép 3 video → Thư viện"}</Toast>
    </div>
    </Interactive>
  );
}
