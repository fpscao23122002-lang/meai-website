import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ScreenMock } from "@/components/mock/ScreenMock";
import { ShotButton } from "@/components/mock/ShotButton";
import { Check, Copy, Info, Lightbulb, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;

const calloutStyles = {
  tip: { Icon: Lightbulb, cls: "border-cyan-brand/30 bg-cyan-brand/[0.06]", icon: "text-cyan-glow", label: "Mẹo" },
  info: { Icon: Info, cls: "border-violet-400/30 bg-violet-400/[0.06]", icon: "text-violet-300", label: "Lưu ý" },
  warn: { Icon: TriangleAlert, cls: "border-amber-400/30 bg-amber-400/[0.06]", icon: "text-amber-300", label: "Cảnh báo" },
} as const;

export function Callout({ type = "tip", children }: { type?: keyof typeof calloutStyles; children: React.ReactNode }) {
  const { Icon, cls, icon, label } = calloutStyles[type];
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease }}
      className={cn("relative mt-6 flex gap-3 overflow-hidden rounded-xl border p-4", cls)}
    >
      <motion.span
        aria-hidden
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2, ease }}
        className="absolute inset-y-0 left-0 w-0.5 origin-top bg-current opacity-60"
        style={{ color: "inherit" }}
      />
      <motion.span
        initial={{ rotate: -20, scale: 0.5 }}
        whileInView={{ rotate: [0, -12, 10, 0], scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.25 }}
        className={cn("mt-0.5 shrink-0", icon)}
      >
        <Icon className="h-5 w-5" />
      </motion.span>
      <div className="text-sm leading-6 text-slate-300">
        <span className="font-semibold text-white">{label}: </span>
        {children}
      </div>
    </motion.div>
  );
}

export function Steps({ items }: { items: { title: string; body: React.ReactNode }[] }) {
  return (
    <ol className="mt-6 space-y-0">
      {items.map((s, i) => (
        <motion.li
          key={s.title}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: i * 0.12, ease }}
          className="group relative flex gap-4 pb-6 last:pb-0"
        >
          {i < items.length - 1 ? (
            <motion.span
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.12, ease }}
              className="absolute left-4 top-9 h-[calc(100%-2.25rem)] w-px origin-top bg-gradient-to-b from-cyan-glow/70 to-neon-pink/20"
            />
          ) : null}
          <motion.span
            initial={{ scale: 0, rotate: -90 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.1 + i * 0.12 }}
            className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white shadow-glow-sm transition-transform group-hover:scale-110"
          >
            <span className="absolute inset-0 rounded-full bg-cyan-glow/40 opacity-0 transition-opacity group-hover:animate-ping group-hover:opacity-100" />
            <span className="relative">{i + 1}</span>
          </motion.span>
          <div className="pt-1">
            <p className="font-semibold text-white">{s.title}</p>
            <div className="mt-1 text-sm leading-6 text-slate-400">{s.body}</div>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}

export function CodeBlock({ title, children }: { title?: string; children: string }) {
  const [copied, setCopied] = useState(false);
  const lines = children.split("\n");
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease }}
      className="group relative mt-6 overflow-hidden rounded-xl border border-white/[0.08] bg-[#08080F] transition-colors hover:border-cyan-glow/30"
    >
      {/* vệt quét sáng khi khối code xuất hiện */}
      <motion.span
        aria-hidden
        initial={{ y: "-100%" }}
        whileInView={{ y: "500%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay: 0.3, ease: "easeInOut" }}
        className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-transparent via-cyan-glow/10 to-transparent"
      />
      {title ? (
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2 text-xs text-slate-500">
          <span>{title}</span>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(children);
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1500);
              } catch {
                /* clipboard bị chặn */
              }
            }}
            className="flex items-center gap-1 rounded-md px-2 py-0.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Đã chép" : "Sao chép"}
          </button>
        </div>
      ) : null}
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-6 text-slate-300">
        <code>
          {lines.map((l, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.07, duration: 0.3 }}
              className="block"
            >
              {l || "\u00a0"}
            </motion.span>
          ))}
        </code>
      </pre>
    </motion.div>
  );
}

export function DocTable({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease }}
      className="mt-6 overflow-x-auto rounded-xl border border-white/[0.08]"
    >
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-slate-400">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.06]">
          {rows.map((r, i) => (
            <motion.tr
              key={i}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.06, duration: 0.35 }}
              className="align-top transition-colors hover:bg-white/[0.03]"
            >
              {r.map((c, j) => (
                <td key={j} className={cn("px-4 py-3 leading-6", j === 0 ? "font-medium text-slate-200" : "text-slate-400")}>
                  {c}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

/** Minh hoạ màn hình app trong tài liệu: bản dựng tự chạy + nút xem ảnh chụp thật */
export function DocShot({ screen, shot = 0, real, caption }: { screen: string; shot?: number; real: string; caption: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  return (
    <motion.figure
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mt-6"
    >
      <ScreenMock id={screen} shotIdx={shot} play={inView} />
      <figcaption className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center text-xs text-slate-500">
        {caption}
        <ShotButton src={real} w={2559} label={caption} />
      </figcaption>
    </motion.figure>
  );
}
