import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AtSign, FolderPlus, Plus } from "lucide-react";
import { useScript } from "@/hooks/useScript";
import { AppFrame, Btn, Label, Panel, PTitle, Toggle } from "../atoms";
import { cn } from "@/lib/cn";

const FACES = ["/samples/video-1.webp", "/samples/video-3.webp", "/samples/video-4.webp", "/samples/video-5.webp", "/samples/video-2.webp", "/samples/anh-1.webp"];
const CHARACTERS = [
  { name: "Linh", img: "/samples/anh-1.webp" },
  { name: "Ông Tư", img: "/samples/video-4.webp" },
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

  useScript(play, async ({ wait }) => {
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
    <AppFrame title="Tư liệu" active="tu-lieu">
      <PTitle>Tư liệu</PTitle>
      <p className="text-[10.5px] text-slate-500">Nhân vật, mẫu prompt, người mẫu cố định và ảnh luân phiên</p>
      <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
        <Panel>
          <div className="flex items-center justify-between">
            <Label>Nhân vật</Label>
            <Btn>
              <Plus className="h-3 w-3" /> Thêm
            </Btn>
          </div>
          <p className="mt-1 text-[10px] text-slate-500">
            Prompt có tên nhân vật (viết hoa đúng tên, hoặc <span className="text-cyan-glow">@tên</span>) sẽ tự gắn ảnh.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <AnimatePresence>
              {CHARACTERS.slice(0, chars).map((c) => (
                <motion.span
                  key={c.name}
                  initial={{ opacity: 0, scale: 0.6, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="flex items-center gap-1.5 rounded-full border border-cyan-glow/30 bg-cyan-glow/10 py-0.5 pl-0.5 pr-2 text-[11px] font-semibold text-cyan-glow"
                >
                  <img src={c.img} alt="" className="h-6 w-6 rounded-full object-cover object-top" />
                  <AtSign className="h-3 w-3" />
                  {c.name}
                </motion.span>
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
                <motion.div
                  key={t}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between rounded-md border border-white/[0.06] bg-ink/50 px-2 py-1 text-[11px] text-slate-200"
                >
                  {t}
                  <span className="text-[10px] text-slate-500">Chèn</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Panel>

        <Panel>
          <div className="flex items-center justify-between">
            <Label>Người mẫu cố định</Label>
            <Toggle on={modelOn} />
          </div>
          <p className="mt-1 text-[10px] text-slate-500">Khi bật, gắn vào mọi task (tối đa 3 ảnh)</p>
          <div className="mt-2 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="relative h-12 w-12 overflow-hidden rounded-lg border border-dashed border-white/15">
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
                </AnimatePresence>
              </span>
            ))}
          </div>
        </Panel>

        <Panel>
          <div className="flex items-center justify-between">
            <Label>Ảnh luân phiên</Label>
            <span className="flex gap-1">
              <Btn>
                <Plus className="h-3 w-3" /> Ảnh
              </Btn>
              <Btn>
                <FolderPlus className="h-3 w-3" /> Folder
              </Btn>
            </span>
          </div>
          <p className="mt-1 text-[10px] text-slate-500">
            Mỗi task lấy 1 ảnh kế tiếp · <span className="text-cyan-glow">Ảnh tiếp theo: #{next + 1}</span>
          </p>
          <div className="mt-2 grid grid-cols-6 gap-1">
            {FACES.slice(0, rotateImgs).map((src, i) => (
              <motion.span
                key={src}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-md ring-1 transition-all duration-300",
                  i === next ? "ring-2 ring-cyan-glow" : "ring-white/10",
                )}
              >
                <img src={src} alt="" className="h-full w-full object-cover object-top" />
                {i === next ? <motion.span layoutId="tl-next" className="absolute inset-0 bg-cyan-glow/20" /> : null}
              </motion.span>
            ))}
          </div>
        </Panel>
      </div>
    </AppFrame>
  );
}
