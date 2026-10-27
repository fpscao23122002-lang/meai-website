import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Link2 } from "lucide-react";
import { useDemoControl, useScript, useTask } from "@/hooks/useScript";
import { AppFrame, Btn, Interactive, Label, Panel, PTitle } from "../atoms";
import { cn } from "@/lib/cn";

const STEPS = ["Dán link", "Chọn ảnh sản phẩm", "Sửa kịch bản", "Đưa vào hàng đợi"];
const PRODUCTS = ["/samples/video-1.webp", "/samples/video-3.webp", "/samples/video-5.webp", "/samples/video-2.webp"];
const SCRIPTS = [
  { title: "Kịch bản 1 · Nỗi đau → giải pháp", line: "0-10s: Cô gái than da xỉn màu… 10-20s: Serum thẩm thấu…" },
  { title: "Kịch bản 2 · Review thật", line: "0-10s: Mở hộp, cận cảnh chai serum… 10-20s: Sau 7 ngày…" },
  { title: "Kịch bản 3 · Ưu đãi chốt đơn", line: "0-10s: Giá chỉ 299K, freeship… 10-20s: Đặt ngay hôm nay…" },
];

/** LadiPage: dán link → quét ảnh gốc, giá, chính sách → 3 kịch bản cho Muse → hàng đợi */
export function LadiPageMock({ play }: { play: boolean }) {
  const [step, setStep] = useState(0);
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [imgs, setImgs] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [facts, setFacts] = useState(0);
  const [scripts, setScripts] = useState(0);
  const [queued, setQueued] = useState(false);
  const ctl = useDemoControl(play);
  const task = useTask();

  const scan = async (wait: (ms: number) => Promise<void>, autoPick: boolean) => {
    setStep(0);
    setImgs(0);
    setPicked([]);
    setFacts(0);
    setScripts(0);
    setQueued(false);
    setScanning(true);
    await wait(1100);
    setScanning(false);
    for (let i = 1; i <= PRODUCTS.length; i++) {
      await wait(130);
      setImgs(i);
    }
    for (let i = 1; i <= 3; i++) {
      await wait(160);
      setFacts(i);
    }
    setStep(1);
    await wait(500);
    if (autoPick) {
      for (const i of [0, 2]) {
        await wait(350);
        setPicked((p) => [...p, i]);
      }
    } else {
      setPicked([0]);
    }
    setStep(2);
    for (let i = 1; i <= 3; i++) {
      await wait(380);
      setScripts(i);
    }
  };
  const togglePick = (i: number) => {
    if (i >= imgs) return;
    setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
  };

  useScript(ctl.active, async ({ wait, type }) => {
    setStep(0);
    setUrl("");
    setScanning(false);
    setImgs(0);
    setPicked([]);
    setFacts(0);
    setScripts(0);
    setQueued(false);
    await wait(400);
    await type("https://serum-duong-trang.ladipage.vn", setUrl, 26);
    await wait(300);
    await scan(wait, true);
    await wait(700);
    setStep(3);
    setQueued(true);
    await wait(2200);
  });

  return (
    <Interactive user={ctl.user} onTakeOver={ctl.takeOver} onReplay={ctl.replay}>
    <AppFrame title="LadiPage" active="ladipage">
      <PTitle>LadiPage → kịch bản video</PTitle>
      <p className="text-[10.5px] text-slate-500">Dán link, AI lấy ảnh gốc, giá, chính sách và sinh 3 kịch bản phân cảnh cho Muse</p>

      {/* thanh 4 bước */}
      <div className="mt-2.5 grid grid-cols-4 gap-1">
        {STEPS.map((s, i) => (
          <div key={s} className="min-w-0">
            <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div className="h-full w-full origin-left bg-brand-gradient" initial={false} animate={{ scaleX: i <= step ? 1 : 0 }} transition={{ duration: 0.5 }} />
            </div>
            <p className={cn("mt-1 truncate text-[10px] font-semibold", i <= step ? "text-cyan-glow" : "text-slate-500")}>
              {i + 1}. {s}
            </p>
          </div>
        ))}
      </div>

      <Panel className="mt-2.5">
        <div className="flex gap-1.5">
          <label className="flex min-h-[26px] min-w-0 flex-1 items-center gap-1.5 rounded-md border border-white/[0.08] bg-ink/60 px-2 focus-within:border-cyan-glow/50">
            <Link2 className="h-3 w-3 shrink-0 text-slate-500" />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && url.trim() && task((w) => scan(w, false))}
              placeholder="Dán link LadiPage sản phẩm…"
              className="min-w-0 flex-1 bg-transparent py-1 text-[11px] text-slate-200 outline-none placeholder:text-slate-600"
            />
          </label>
          <Btn variant="primary" pressed={scanning} onClick={() => task((w) => scan(w, false))}>
            {scanning ? <span className="h-2.5 w-2.5 animate-spin rounded-full border border-ink border-t-transparent" /> : null}
            {scanning ? "Đang quét…" : "Quét & sinh kịch bản"}
          </Btn>
        </div>

        <div className="mt-2.5 grid gap-2.5 sm:grid-cols-[1fr_1.4fr]">
          <div>
            <Label className="text-[10px]">Ảnh gốc từ landing page</Label>
            <div className="mt-1 grid grid-cols-4 gap-1">
              {PRODUCTS.map((src, i) => (
                <button
                  type="button"
                  key={src}
                  onClick={() => togglePick(i)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-md bg-white/[0.04] ring-1 transition",
                    picked.includes(i) ? "ring-2 ring-cyan-glow" : "ring-white/10 hover:ring-cyan-glow/50",
                  )}
                >
                  <AnimatePresence>
                    {i < imgs ? (
                      <motion.img
                        src={src}
                        alt=""
                        initial={{ opacity: 0, scale: 1.3 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="h-full w-full object-cover object-top"
                      />
                    ) : null}
                  </AnimatePresence>
                  {picked.includes(i) ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-0.5 top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-cyan-glow text-ink"
                    >
                      <Check className="h-2 w-2" strokeWidth={4} />
                    </motion.span>
                  ) : null}
                </button>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {["Giá: 299.000đ", "Freeship toàn quốc", "Đổi trả 7 ngày"].slice(0, facts).map((f) => (
                <motion.span
                  key={f}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-full border border-neon-pink/40 bg-neon-pink/10 px-1.5 py-px text-[10px] font-semibold text-pink-200"
                >
                  {f}
                </motion.span>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px]">3 kịch bản phân cảnh cho Muse</Label>
            {SCRIPTS.map((sc, i) => (
              <motion.div
                key={sc.title}
                animate={{ opacity: i < scripts ? 1 : 0.25, x: i < scripts ? 0 : 10 }}
                className="rounded-md border border-white/[0.07] bg-ink/50 px-2 py-1"
              >
                <p className="text-[10.5px] font-semibold text-white">{sc.title}</p>
                <p className="truncate text-[10px] text-slate-400">{sc.line}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mt-2.5 flex items-center justify-end gap-2">
          <AnimatePresence>
            {queued ? (
              <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="text-[10.5px] font-semibold text-cyan-glow">
                ✓ Đã đưa {Math.max(1, picked.length) * 3} video vào hàng đợi Muse
              </motion.span>
            ) : null}
          </AnimatePresence>
          <Btn
            variant={step >= 2 ? "primary" : "default"}
            pressed={queued}
            disabled={scripts < 3}
            onClick={() => {
              setStep(3);
              setQueued(true);
            }}
          >
            Đưa vào hàng đợi
          </Btn>
        </div>
      </Panel>
    </AppFrame>
    </Interactive>
  );
}
