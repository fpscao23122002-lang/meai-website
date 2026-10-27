import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AtSign, FolderPlus, Plus } from "lucide-react";
import { useDemoControl, useScript } from "@/hooks/useScript";
import { AppFrame, Btn, Interactive, Label, Panel, PTitle, Toggle } from "../atoms";
import { cn } from "@/lib/cn";
import { useIndicator } from "@/hooks/useIndicator";

const FACES = ["/samples/video-1.webp", "/samples/video-3.webp", "/samples/video-4.webp", "/samples/video-5.webp", "/samples/video-2.webp", "/samples/anh-1.webp"];
const CHARACTERS = [
  { name: "Linh", img: "/samples/anh-1.webp" },
  { name: "Ông Tư", img: "/samples/video-4.webp" },
  { name: "Bác Ba", img: "/samples/video-1.webp" },
  { name: "Chú Năm", img: "/samples/video-5.webp" },
];
const TEMPLATES = ["Chân dung KOC ảo", "Review sản phẩm UGC", "Unbox sản phẩm"];

/** Tư liệu: nhân vật @tên, mẫu prompt, người mẫu cố định, ảnh luân phiên */
export function TuLieuMock({ play }: { play: boolean }) {
  const [chars, setChars] = useState(1);
  const [tpl, setTpl] = useState(1);
  const [modelOn, setModelOn] = useState(false);
  const [modelImgs, setModelImgs] = useState(0);
  const [rotateImgs, setRotateImgs] = useState(3);
  const [next, setNext] = useState(0);
  const [inserted, setInserted] = useState<string | null>(null);
  const ctl = useDemoControl(play);
  const nextInd = useIndicator(String(next));

  const toggleModel = (v: boolean) => {
    setModelOn(v);
    if (v && modelImgs === 0) setModelImgs(1);
  };

  useScript(ctl.active, async ({ wait }) => {
    setInserted(null);
    setChars(1);
    setTpl(1);
    setModelOn(false);
    setModelImgs(0);
    setRotateImgs(3);
    setNext(0);
    await wait(600);
    setChars(2);
    await wait(700);
    setTpl(2);
    await wait(400);
    setTpl(3);
    await wait(600);
    setModelOn(true);
    for (let i = 1; i <= 3; i++) {
      await wait(350);
      setModelImgs(i);
    }
    await wait(500);
    setRotateImgs(6);
    for (let i = 1; i <= 6; i++) {
      await wait(550);
      setNext(i % 6);
    }
    await wait(800);
  });

  return (
    <Interactive user={ctl.user} onTakeOver={ctl.takeOver} onReplay={ctl.replay}>
    <AppFrame title="Tư liệu" active="tu-lieu">
      <PTitle>Tư liệu</PTitle>
      <p className="text-[10.5px] text-slate-500">Nhân vật, mẫu prompt, người mẫu cố định và ảnh luân phiên</p>
      <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
        <Panel>
          <div className="flex items-center justify-between">
            <Label>Nhân vật</Label>
            <Btn onClick={() => setChars((c) => Math.min(CHARACTERS.length, c + 1))} disabled={chars >= CHARACTERS.length}>
              <Plus className="h-3 w-3" /> Thêm
            </Btn>
          </div>
          <p className="mt-1 text-[10px] text-slate-500">
            Prompt có tên nhân vật (viết hoa đúng tên, hoặc <span className="text-cyan-glow">@tên</span>) sẽ tự gắn ảnh.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <AnimatePresence>
              {CHARACTERS.slice(0, chars).map((c) => (
                <motion.button
                  type="button"
                  key={c.name}
                  title="Bấm để xoá nhân vật"
                  onClick={() => setChars((n) => Math.max(0, n - 1))}
                  initial={{ opacity: 0, scale: 0.6, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="flex items-center gap-1.5 rounded-full border border-cyan-glow/30 bg-cyan-glow/10 py-0.5 pl-0.5 pr-2 text-[11px] font-semibold text-cyan-glow"
                >
                  <img src={c.img} alt="" className="h-6 w-6 rounded-full object-cover object-top" />
                  <AtSign className="h-3 w-3" />
                  {c.name}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </Panel>

        <Panel>
          <Label>Mẫu prompt</Label>
          <p className="mt-1 text-[10px] text-slate-500">Lưu từ ô prompt ở Studio, chèn lại bằng “Chèn mẫu prompt…”</p>
          <div className="mt-2 space-y-1">
            <AnimatePresence>
              {TEMPLATES.slice(0, tpl).map((t) => (
                <motion.button
                  type="button"
                  key={t}
                  onClick={() => setInserted(t)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md border px-2 py-1 text-left text-[11px] text-slate-200 transition-colors hover:border-cyan-glow/40",
                    inserted === t ? "border-cyan-glow/60 bg-cyan-glow/10" : "border-white/[0.06] bg-ink/50",
                  )}
                >
                  {t}
                  <span className={cn("text-[10px]", inserted === t ? "font-semibold text-cyan-glow" : "text-slate-500")}>
                    {inserted === t ? "✓ Đã chèn" : "Chèn"}
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </Panel>

        <Panel>
          <div className="flex items-center justify-between">
            <Label>Người mẫu cố định</Label>
            <Toggle on={modelOn} onChange={toggleModel} />
          </div>
          <p className="mt-1 text-[10px] text-slate-500">Khi bật, gắn vào mọi task (tối đa 3 ảnh)</p>
          <div className="mt-2 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <button
                type="button"
                key={i}
                onClick={() => setModelImgs((n) => (i < n ? i : i + 1))}
                className="relative h-12 w-12 overflow-hidden rounded-lg border border-dashed border-white/15 transition-colors hover:border-cyan-glow/50"
              >
                <AnimatePresence>
                  {i < modelImgs ? (
                    <motion.img
                      src={FACES[i]}
                      alt=""
                      initial={{ opacity: 0, scale: 1.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 h-full w-full object-cover object-top"
                    />
                  ) : null}
                  {i >= modelImgs ? <Plus className="absolute inset-0 m-auto h-3.5 w-3.5 text-slate-500" /> : null}
                </AnimatePresence>
              </button>
            ))}
          </div>
        </Panel>

        <Panel>
          <div className="flex items-center justify-between">
            <Label>Ảnh luân phiên</Label>
            <span className="flex gap-1">
              <Btn onClick={() => setRotateImgs((n) => Math.min(FACES.length, n + 1))} disabled={rotateImgs >= FACES.length}>
                <Plus className="h-3 w-3" /> Ảnh
              </Btn>
              <Btn onClick={() => setRotateImgs(FACES.length)}>
                <FolderPlus className="h-3 w-3" /> Folder
              </Btn>
            </span>
          </div>
          <p className="mt-1 text-[10px] text-slate-500">
            Mỗi task lấy 1 ảnh kế tiếp · <span className="text-cyan-glow">Ảnh tiếp theo: #{next + 1}</span>
          </p>
          <div ref={nextInd.containerRef} className="relative mt-2 grid grid-cols-6 gap-1">
            <span aria-hidden style={nextInd.style} className="pointer-events-none absolute left-0 top-0 z-10 rounded-md bg-cyan-glow/20 will-change-transform" />
            {FACES.slice(0, rotateImgs).map((src, i) => (
              <motion.button
                type="button"
                key={src}
                data-ind={String(i)}
                onClick={() => setNext(i)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-md ring-1 transition-all duration-300 hover:ring-cyan-glow/60",
                  i === next ? "ring-2 ring-cyan-glow" : "ring-white/10",
                )}
              >
                <img src={src} alt="" className="h-full w-full object-cover object-top" />
              </motion.button>
            ))}
          </div>
        </Panel>
      </div>
    </AppFrame>
    </Interactive>
  );
}
