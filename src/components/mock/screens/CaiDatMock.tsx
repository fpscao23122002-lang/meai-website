import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useScript } from "@/hooks/useScript";
import { AppFrame, Btn, Caret, Field, Label, Panel, PTitle } from "../atoms";

const PAGES = ["Serum Dưỡng Trắng", "Gia Dụng Thông Minh", "Review Đồ Công Nghệ"];

/** Cài đặt: thư mục lưu, số lần thử, giới hạn thời gian, token Facebook → quét Fanpage */
export function CaiDatMock({ play }: { play: boolean }) {
  const [retry, setRetry] = useState(1);
  const [saved, setSaved] = useState(false);
  const [token, setToken] = useState("");
  const [scan, setScan] = useState(false);
  const [pages, setPages] = useState(0);

  useScript(play, async ({ wait, type }) => {
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

  return (
    <AppFrame title="Cài đặt" active="cai-dat">
      <PTitle>Cài đặt</PTitle>
      <p className="text-[10.5px] text-slate-500">Thư mục lưu, giới hạn thời gian, token Facebook</p>
      <Panel className="mt-2.5">
        <Label>Chạy task</Label>
        <p className="text-[10px] text-slate-500">Áp dụng cho task chạy sau khi lưu.</p>
        <Label className="mt-2 text-[10px]">Thư mục lưu</Label>
        <div className="mt-0.5 flex gap-1.5">
          <Field mono className="flex-1">D:\MeAI\output</Field>
          <Btn>Chọn thư mục</Btn>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {[
            { l: "Số lần thử khi lỗi", v: retry },
            { l: "Giới hạn tạo ảnh (phút)", v: 5 },
            { l: "Giới hạn tạo video (phút)", v: 30 },
          ].map((f) => (
            <div key={f.l}>
              <Label className="truncate text-[10px]">{f.l}</Label>
              <Field className="mt-0.5 tabular-nums">
                <motion.span key={String(f.v)} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-block">
                  {f.v}
                </motion.span>
              </Field>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-end gap-2">
          <AnimatePresence>
            {saved ? (
              <motion.span initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1 text-[10.5px] font-semibold text-cyan-glow">
                <Check className="h-3 w-3" /> Đã lưu
              </motion.span>
            ) : null}
          </AnimatePresence>
          <Btn variant="primary" pressed={saved}>
            Lưu
          </Btn>
        </div>
      </Panel>
      <Panel className="mt-2.5">
        <Label>Facebook token</Label>
        <p className="text-[10px] text-slate-500">Dán 1 token (User hoặc Page), app tự lấy danh sách Fanpage bạn quản lý.</p>
        <div className="mt-1.5 flex gap-1.5">
          <Field mono className="min-w-0 flex-1 truncate">
            {token || <span className="text-slate-600">Bắt đầu bằng EAA…</span>}
            <Caret show={Boolean(token) && pages === 0 && !scan} />
          </Field>
          <Btn variant="primary" pressed={scan}>
            {scan ? <span className="h-2.5 w-2.5 animate-spin rounded-full border border-ink border-t-transparent" /> : null}
            Quét Fanpage
          </Btn>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
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
  );
}
