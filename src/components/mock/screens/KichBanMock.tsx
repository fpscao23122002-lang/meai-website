import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Music } from "lucide-react";
import { useScript } from "@/hooks/useScript";
import { AppFrame, Btn, Caret, Field, Label, Panel, ProgressBar, Seg, StatusPill } from "../atoms";
import { cn } from "@/lib/cn";

const SCRIPT = `0-10s: Cô gái Việt giơ hộp quà giữa kho hàng, đèn Noel lung linh
10-20s: Cả gia đình quây quần mở quà lịch Giáng Sinh
20-30s: Cận cảnh sản phẩm, chữ "Freeship toàn quốc" hiện lên`;

const OPTIONS = [
  { label: "Cách làm", value: "Làm video thẳng · nhanh ~3 phút", wide: true },
  { label: "Tỉ lệ", value: "9:16 · Dọc (TikTok, Reels)" },
  { label: "Thời lượng", value: "30 giây · gộp 1 lệnh" },
  { label: "Tiền tố câu lệnh", value: "Tạo video chân thực:" },
  { label: "Giọng đọc", value: "Husky Campfire — Nam · khàn" },
  { label: "Người dẫn", value: "Theo giọng đọc" },
  { label: "Nhân vật dẫn", value: "@Linh" },
];

type Row = { id: number; name: string; status: "wait" | "run" | "done"; progress: number };

/** Kịch bản: viết theo mốc thời gian → giọng đọc, nhạc nền → render trên Muse, tự ghép */
export function KichBanMock({ play }: { play: boolean }) {
  const [text, setText] = useState("");
  const [optIdx, setOptIdx] = useState(-1);
  const [autoMerge, setAutoMerge] = useState(false);
  const [music, setMusic] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [filter, setFilter] = useState("Tất cả");

  useScript(play, async ({ wait, type }) => {
    setText("");
    setOptIdx(-1);
    setAutoMerge(false);
    setMusic(false);
    setPressed(false);
    setRows([]);
    setFilter("Tất cả");
    await wait(400);
    await type(SCRIPT, setText, 14);
    for (let i = 0; i < OPTIONS.length; i++) {
      await wait(120);
      setOptIdx(i);
    }
    await wait(300);
    setAutoMerge(true);
    await wait(300);
    setMusic(true);
    await wait(500);
    setPressed(true);
    setRows([1, 2, 3].map((id) => ({ id, name: `Cảnh ${id} · ${id * 10 - 10}–${id * 10}s`, status: "wait", progress: 0 })));
    setFilter("Đang làm");
    await wait(500);
    setPressed(false);
    for (let r = 0; r < 3; r++) {
      for (let p = 0; p <= 100; p += 20) {
        setRows((rs) => rs.map((x, i) => (i === r ? { ...x, status: p >= 100 ? "done" : "run", progress: p } : x)));
        await wait(110);
      }
    }
    setFilter("Xong");
    await wait(2200);
  });

  const count = (s: Row["status"]) => rows.filter((r) => r.status === s).length;

  return (
    <AppFrame title="Kịch bản" active="kich-ban">
      <Panel className="grid gap-3 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <Seg layoutKey="kb-tab" options={["Kịch bản", "Từ ảnh"]} value="Kịch bản" className="w-40" />
          <Field className="mt-2 h-[96px] overflow-hidden whitespace-pre-wrap leading-4">
            {text || <span className="text-slate-600">VD: 0-10s: …</span>}
            <Caret show={Boolean(text) && optIdx < 0} />
          </Field>
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-dashed border-white/10 px-2 py-1.5">
            <span className="text-[10px] text-slate-400">
              <b className="text-slate-200">Ảnh sản phẩm</b> · mỗi ảnh làm ra 1 bộ video riêng
            </span>
            <Btn className="ml-auto">Chọn ảnh</Btn>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 sm:grid-cols-3">
          {OPTIONS.map((o, i) => (
            <motion.div
              key={o.label}
              animate={{ opacity: i <= optIdx ? 1 : 0.35 }}
              className={cn(o.wide && "col-span-2 sm:col-span-3")}
            >
              <Label className="text-[10px]">{o.label}</Label>
              <Field
                className={cn(
                  "mt-0.5 truncate transition-colors duration-300",
                  i === optIdx && "border-cyan-glow/60 shadow-[0_0_10px_-2px_rgba(0,240,255,0.6)]",
                )}
              >
                {o.value}
              </Field>
            </motion.div>
          ))}
          <div>
            <Label className="text-[10px]">Từng cảnh</Label>
            <span className="mt-1 flex items-center gap-1.5 text-[10.5px] text-slate-200">
              <span className={cn("flex h-3.5 w-3.5 items-center justify-center rounded transition-colors", autoMerge ? "bg-cyan-glow text-ink" : "border border-white/20")}>
                {autoMerge ? <Check className="h-2.5 w-2.5" strokeWidth={4} /> : null}
              </span>
              Tự ghép khi xong
            </span>
          </div>
          <div className="col-span-2 flex items-end gap-2">
            <span className="flex items-center gap-1.5 text-[10.5px] text-slate-200">
              <span className={cn("flex h-3.5 w-3.5 items-center justify-center rounded transition-colors", music ? "bg-cyan-glow text-ink" : "border border-white/20")}>
                {music ? <Check className="h-2.5 w-2.5" strokeWidth={4} /> : null}
              </span>
              <Music className="h-3 w-3 text-neon-pink" /> Ghép nhạc
            </span>
            {/* sóng âm giọng đọc */}
            <span className="flex h-5 items-end gap-0.5">
              {Array.from({ length: 14 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="w-0.5 rounded-full bg-gradient-to-t from-cyan-glow to-neon-pink"
                  animate={music ? { height: [4, 6 + ((i * 7) % 14), 4] } : { height: 3 }}
                  transition={{ duration: 0.6 + (i % 4) * 0.12, repeat: music ? Infinity : 0, ease: "easeInOut" }}
                />
              ))}
            </span>
            <Btn variant="primary" className="ml-auto py-1.5" pressed={pressed}>
              Đưa vào hàng đợi
            </Btn>
          </div>
        </div>
      </Panel>

      <div className="mt-2.5 flex flex-wrap gap-1">
        {(["Tất cả", "Chờ", "Đang làm", "Xong", "Lỗi"] as const).map((f) => {
          const n = { "Tất cả": rows.length, Chờ: count("wait"), "Đang làm": count("run"), Xong: count("done"), Lỗi: 0 }[f];
          return (
            <span
              key={f}
              className={cn(
                "relative rounded-full border px-2 py-0.5 text-[10.5px] font-semibold",
                f === filter ? "border-cyan-glow/60 text-cyan-glow" : "border-white/10 text-slate-400",
              )}
            >
              {f === filter ? <motion.span layoutId="kb-filter" className="absolute inset-0 rounded-full bg-cyan-glow/10" /> : null}
              <span className="relative">
                {f} {n}
              </span>
            </span>
          );
        })}
      </div>
      <Panel className="mt-2 min-h-[86px] p-0">
        <AnimatePresence initial={false} mode="popLayout">
          {rows.length === 0 ? (
            <p key="empty" className="p-4 text-center text-[11px] text-slate-500">
              Chưa có video nào. Soạn kịch bản ở trên rồi bấm “Đưa vào hàng đợi”.
            </p>
          ) : (
            rows.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-2 border-b border-white/[0.04] px-2.5 py-1.5 text-[11px]"
              >
                <span className="w-4 text-slate-500">{r.id}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-slate-100">{r.name}</span>
                  {r.status === "run" ? <ProgressBar value={r.progress} className="mt-1" /> : null}
                </span>
                <StatusPill status={r.status} progress={r.progress} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </Panel>
    </AppFrame>
  );
}
