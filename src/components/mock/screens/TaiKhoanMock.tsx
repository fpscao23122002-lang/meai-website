import { useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useScript } from "@/hooks/useScript";
import { platforms } from "@/lib/data";
import { AppFrame, Btn, Field, Label, Panel, PTitle, Seg, Toggle } from "../atoms";
import { cn } from "@/lib/cn";

type Acc = { email: string; state: "Rảnh" | "Đang chạy" | "Hết lượt"; credit: number; threads: number };

const START: Acc[] = [
  { email: "creator@gmail.com", state: "Rảnh", credit: 214, threads: 1 },
  { email: "studio.02@gmail.com", state: "Rảnh", credit: 96, threads: 2 },
];

/** Tài khoản: 4 nền tảng, luồng, chia việc, tự chuyển khi chạm hạn mức, proxy */
export function TaiKhoanMock({ play }: { play: boolean }) {
  const [tab, setTab] = useState("Flow");
  const [split, setSplit] = useState("Luân phiên");
  const [toggles, setToggles] = useState([true, true, false]);
  const [accs, setAccs] = useState<Acc[]>(START);
  const [checking, setChecking] = useState(false);

  useScript(play, async ({ wait }) => {
    setTab("Flow");
    setSplit("Luân phiên");
    setToggles([true, true, false]);
    setAccs(START);
    await wait(700);
    setChecking(true);
    await wait(900);
    setChecking(false);
    // Hàng đợi chạy: tín dụng giảm dần, trạng thái đổi
    setAccs((a) => a.map((x) => ({ ...x, state: "Đang chạy" })));
    for (let i = 0; i < 8; i++) {
      await wait(220);
      setAccs((a) => a.map((x, j) => ({ ...x, credit: Math.max(0, x.credit - (j === 1 ? 12 : 4)) })));
    }
    // Tài khoản 2 chạm hạn mức → tự chuyển
    setAccs((a) => a.map((x, j) => (j === 1 ? { ...x, state: "Hết lượt", credit: 0 } : x)));
    await wait(900);
    setAccs((a) => a.map((x, j) => (j === 0 ? x : { ...x })));
    await wait(400);
    setSplit("Lần lượt");
    await wait(700);
    setToggles([true, true, true]);
    await wait(700);
    setTab("Muse");
    await wait(900);
    setTab("Seedance");
    await wait(900);
  });

  return (
    <AppFrame title="Tài khoản" active="tai-khoan" free={accs.filter((a) => a.state === "Rảnh").length} total={2}>
      <div className="flex flex-wrap items-center gap-2">
        <div>
          <PTitle>Tài khoản</PTitle>
          <p className="text-[10px] text-slate-500">4 nền tảng · 2 tài khoản</p>
        </div>
        <span className="ml-auto flex flex-wrap gap-1.5">
          <Btn pressed={checking}>
            {checking ? <span className="h-2.5 w-2.5 animate-spin rounded-full border border-cyan-glow border-t-transparent" /> : null}
            Kiểm tra phiên
          </Btn>
          <Btn className="hidden sm:inline-flex">Kiểm tra hạn mức</Btn>
          <Btn variant="primary">+ Thêm tài khoản {tab}</Btn>
        </span>
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {platforms.map((p) => (
          <span
            key={p.name}
            className={cn(
              "relative flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[11px] font-semibold",
              tab === p.name ? "border-transparent text-white" : "border-white/[0.07] text-slate-400",
            )}
          >
            {tab === p.name ? <motion.span layoutId="tk-tab" className="absolute inset-0 rounded-lg ring-1 ring-cyan-glow/60 shadow-glow-sm" /> : null}
            <span className={cn("relative h-2 w-2 rounded-full", p.dot)} />
            <span className="relative">{p.name}</span>
            <span className="relative ml-auto rounded bg-white/[0.06] px-1 text-[9.5px] text-slate-400">
              {p.name === "Muse" || p.name === "Flow" ? "1/1 rảnh" : "0/0"}
            </span>
          </span>
        ))}
      </div>

      <Panel className="mt-2.5">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-[90px_90px_1fr]">
          <div>
            <Label className="text-[10px]">TK chạy đồng thời</Label>
            <Field className="mt-0.5">2</Field>
          </div>
          <div>
            <Label className="text-[10px]">Tổng luồng</Label>
            <Field className="mt-0.5">3</Field>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <Label className="text-[10px]">Chia việc</Label>
            <Seg layoutKey="tk-split" options={["Luân phiên", "Lần lượt"]} value={split} className="mt-0.5 w-44" />
          </div>
        </div>
        <div className="mt-2.5 space-y-1.5">
          <Toggle on={toggles[0]} label="Tự động chuyển tài khoản khi chạm hạn mức ngày (Daily Limit)" />
          <Toggle on={toggles[1]} label="Tự động tối ưu prompt khi dính bộ lọc an toàn Google (Safety Filter)" />
          <Toggle on={toggles[2]} label="Kho proxy dự phòng (US/Global)" />
        </div>
      </Panel>

      <Label className="mt-2.5 text-[10px] text-slate-500">{tab} · 2 tài khoản</Label>
      <div className="mt-1 space-y-1.5">
        {accs.map((a, i) => (
          <Panel key={a.email} className="p-2">
            <div className="flex flex-wrap items-center gap-2">
              <Toggle on={a.state !== "Hết lượt"} />
              <Field className="min-w-0 truncate font-semibold">{a.email}</Field>
              <motion.span
                key={a.state}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={cn(
                  "flex items-center gap-1 rounded-full border px-1.5 py-px text-[10px] font-semibold",
                  a.state === "Rảnh" && "border-cyan-glow/50 text-cyan-glow",
                  a.state === "Đang chạy" && "border-violet-400/50 text-violet-300",
                  a.state === "Hết lượt" && "border-neon-pink/50 text-neon-pink",
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full bg-current", a.state === "Đang chạy" && "animate-pulse")} />
                {a.state}
              </motion.span>
              <span className="rounded bg-violet-500/20 px-1 text-[9px] font-bold text-violet-300">PRO</span>
              <span className="flex items-center gap-0.5 text-[10.5px] font-semibold tabular-nums text-slate-200">
                <Zap className="h-3 w-3 text-amber-400" />
                {a.credit} <span className="font-normal text-slate-400">tín dụng</span>
              </span>
              <span className="ml-auto hidden gap-1 md:flex">
                <Field>{a.threads} luồng</Field>
                <Btn>Hiện Chrome</Btn>
                <Btn variant="danger">Xoá</Btn>
              </span>
            </div>
            {i === 0 ? (
              <div className="mt-1.5 hidden items-center gap-1.5 sm:flex">
                <span className="text-[10px] text-slate-500">Proxy</span>
                <Field mono className="flex-1 text-slate-600">
                  ip:port hoặc ip:port:user:pass — trống = không dùng proxy
                </Field>
                <Btn>Kiểm tra</Btn>
              </div>
            ) : null}
          </Panel>
        ))}
      </div>
    </AppFrame>
  );
}
