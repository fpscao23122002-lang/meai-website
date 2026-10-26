import { Info, Lightbulb, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

const calloutStyles = {
  tip: { Icon: Lightbulb, cls: "border-cyan-brand/30 bg-cyan-brand/[0.06]", icon: "text-cyan-glow", label: "Mẹo" },
  info: { Icon: Info, cls: "border-violet-400/30 bg-violet-400/[0.06]", icon: "text-violet-300", label: "Lưu ý" },
  warn: { Icon: TriangleAlert, cls: "border-amber-400/30 bg-amber-400/[0.06]", icon: "text-amber-300", label: "Cảnh báo" },
} as const;

export function Callout({ type = "tip", children }: { type?: keyof typeof calloutStyles; children: React.ReactNode }) {
  const { Icon, cls, icon, label } = calloutStyles[type];
  return (
    <div className={cn("mt-6 flex gap-3 rounded-xl border p-4", cls)}>
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", icon)} />
      <div className="text-sm leading-6 text-slate-300">
        <span className="font-semibold text-white">{label}: </span>
        {children}
      </div>
    </div>
  );
}

export function Steps({ items }: { items: { title: string; body: React.ReactNode }[] }) {
  return (
    <ol className="mt-6 space-y-0">
      {items.map((s, i) => (
        <li key={s.title} className="relative flex gap-4 pb-6 last:pb-0">
          {i < items.length - 1 ? (
            <span className="absolute left-4 top-9 h-[calc(100%-2.25rem)] w-px bg-gradient-to-b from-cyan-brand/40 to-transparent" />
          ) : null}
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white shadow-glow-sm">
            {i + 1}
          </span>
          <div className="pt-1">
            <p className="font-semibold text-white">{s.title}</p>
            <div className="mt-1 text-sm leading-6 text-slate-400">{s.body}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function CodeBlock({ title, children }: { title?: string; children: string }) {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-white/[0.08] bg-[#080B13]">
      {title ? (
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2 text-xs text-slate-500">
          <span>{title}</span>
          <span className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-white/10" />
            <span className="h-2 w-2 rounded-full bg-white/10" />
            <span className="h-2 w-2 rounded-full bg-white/10" />
          </span>
        </div>
      ) : null}
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-6 text-slate-300">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export function DocTable({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-white/[0.08]">
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
            <tr key={i} className="align-top">
              {r.map((c, j) => (
                <td key={j} className={cn("px-4 py-3 leading-6", j === 0 ? "font-medium text-slate-200" : "text-slate-400")}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
