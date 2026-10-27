import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useDemoControl, useScript, useTask } from "@/hooks/useScript";
import { AppFrame, Btn, Field, Interactive, Label, Panel, PTitle } from "../atoms";

const PAGES = ["Serum Dưỡng Trắng", "Gia Dụng Thông Minh", "Review Đồ Công Nghệ"];

/** Cài đặt: thư mục lưu, số lần thử, giới hạn thời gian, token Facebook → quét Fanpage */
export function CaiDatMock({ play }: { play: boolean }) {
  const [retry, setRetry] = useState(1);
  const [saved, setSaved] = useState(false);
  const [token, setToken] = useState("");
  const [scan, setScan] = useState(false);
  const [pages, setPages] = useState(0);
  const [limits, setLimits] = useState({ img: 5, vid: 30 });
  const [folder, setFolder] = useState("D:\\MeAI\\output");
  const ctl = useDemoControl(play);
  const task = useTask();

  const scanPages = async (wait: (ms: number) => Promise<void>) => {
    setPages(0);
    setScan(true);
    await wait(900);
    setScan(false);
    if (!token.trim() && !ctl.active) return;
    for (let i = 1; i <= PAGES.length; i++) {
      await wait(260);
      setPages(i);
    }
  };
  const save = async (wait: (ms: number) => Promise<void>) => {
    setSaved(false);
    await wait(60);
    setSaved(true);
  };

  useScript(ctl.active, async ({ wait, type }) => {
    setRetry(1);
    setSaved(false);
    setToken("");
    setScan(false);
    setPages(0);
    await wait(600);
    setRetry(2);
    await wait(500);
    setSaved(true);
    await wait(900);
    await type("EAAGm0PX4ZCpsBAOzZC7xQ••••••••••••", setToken, 28);
    await wait(300);
    setScan(true);
    await wait(900);
    setScan(false);
    for (let i = 1; i <= PAGES.length; i++) {
      await wait(260);
      setPages(i);
    }
    await wait(2000);
  });

  const numInput = (value: number, set: (n: number) => void, max: number) => (
    <input
      type="number"
      min={0}
      max={max}
      value={value}
      onChange={(e) => {
        setSaved(false);
        set(Math.max(0, Math.min(max, Number(e.target.value) || 0)));
      }}
      className="mt-0.5 w-full rounded-md border border-white/[0.08] bg-ink/60 px-2 py-1 text-[11px] tabular-nums text-slate-200 outline-none focus:border-cyan-glow/50"
    />
  );

  return (
    <Interactive user={ctl.user} onTakeOver={ctl.takeOver} onReplay={ctl.replay}>
    <AppFrame title="Cài đặt" active="cai-dat">
      <PTitle>Cài đặt</PTitle>
      <p className="text-[10.5px] text-slate-500">Thư mục lưu, giới hạn thời gian, token Facebook</p>
      <Panel className="mt-2.5">
        <Label>Chạy task</Label>
        <p className="text-[10px] text-slate-500">Áp dụng cho task chạy sau khi lưu.</p>
        <Label className="mt-2 text-[10px]">Thư mục lưu</Label>
        <div className="mt-0.5 flex gap-1.5">
          <Field mono className="flex-1">{folder}</Field>
          <Btn
            onClick={() => {
              setSaved(false);
              setFolder((f) => (f.startsWith("D:") ? "E:\\Content\\MeAI" : "D:\\MeAI\\output"));
            }}
          >
            Chọn thư mục
          </Btn>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          <div>
            <Label className="truncate text-[10px]">Số lần thử khi lỗi</Label>
            {numInput(retry, setRetry, 5)}
          </div>
          <div>
            <Label className="truncate text-[10px]">Giới hạn tạo ảnh (phút)</Label>
            {numInput(limits.img, (n) => setLimits((l) => ({ ...l, img: n })), 60)}
          </div>
          <div>
            <Label className="truncate text-[10px]">Giới hạn tạo video (phút)</Label>
            {numInput(limits.vid, (n) => setLimits((l) => ({ ...l, vid: n })), 120)}
          </div>
        </div>
        <div className="mt-2 flex items-center justify-end gap-2">
          <AnimatePresence>
            {saved ? (
              <motion.span initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1 text-[10.5px] font-semibold text-cyan-glow">
                <Check className="h-3 w-3" /> Đã lưu
              </motion.span>
            ) : null}
          </AnimatePresence>
          <Btn variant="primary" pressed={saved} onClick={() => task(save)}>
            Lưu
          </Btn>
        </div>
      </Panel>
      <Panel className="mt-2.5">
        <Label>Facebook token</Label>
        <p className="text-[10px] text-slate-500">Dán 1 token (User hoặc Page), app tự lấy danh sách Fanpage bạn quản lý.</p>
        <div className="mt-1.5 flex gap-1.5">
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Bắt đầu bằng EAA…"
            className="min-w-0 flex-1 truncate rounded-md border border-white/[0.08] bg-ink/60 px-2 py-1 font-mono text-[11px] text-slate-200 outline-none placeholder:text-slate-600 focus:border-cyan-glow/50"
          />
          <Btn variant="primary" pressed={scan} onClick={() => task(scanPages)}>
            {scan ? <span className="h-2.5 w-2.5 animate-spin rounded-full border border-ink border-t-transparent" /> : null}
            Quét Fanpage
          </Btn>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {!scan && pages === 0 && ctl.user && !token.trim() ? (
            <span className="text-[10.5px] text-neon-pink">Dán token trước khi quét Fanpage</span>
          ) : null}
          <AnimatePresence>
            {PAGES.slice(0, pages).map((p) => (
              <motion.span
                key={p}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="flex items-center gap-1 rounded-full border border-cyan-glow/40 bg-cyan-glow/10 px-2 py-0.5 text-[10.5px] font-semibold text-cyan-glow"
              >
                <Check className="h-3 w-3" /> {p}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </Panel>
    </AppFrame>
    </Interactive>
  );
}
