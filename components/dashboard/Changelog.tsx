import { History } from "lucide-react";
import { changelog } from "@/lib/data";
import { cn } from "@/lib/cn";

const tagStyle = {
  Major: "bg-brand-gradient text-white",
  Feature: "bg-cyan-brand/15 text-cyan-glow",
  Fix: "bg-amber-400/15 text-amber-300",
} as const;

export function Changelog() {
  return (
    <section id="changelog" className="scroll-mt-24">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient-soft ring-1 ring-cyan-brand/30">
          <History className="h-5 w-5 text-cyan-glow" />
        </span>
        <div>
          <h2 className="text-2xl font-bold text-white">Lịch sử phiên bản</h2>
          <p className="text-sm text-slate-500">Changelog — MeAI cập nhật liên tục, miễn phí trong thời hạn gói</p>
        </div>
      </div>

      <ol className="relative mt-8 space-y-6 border-l border-white/10 pl-7">
        {changelog.map((c, i) => (
          <li key={c.version} className="relative">
            <span
              className={cn(
                "absolute -left-[35px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-ink",
                i === 0 ? "bg-cyan-glow shadow-glow-sm" : "bg-slate-600",
              )}
            />
            <div className="rounded-2xl border border-white/[0.07] bg-panel p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-lg font-bold text-white">v{c.version}</span>
                <span className={cn("rounded-md px-2 py-0.5 text-xs font-semibold", tagStyle[c.tag])}>{c.tag}</span>
                {i === 0 ? (
                  <span className="rounded-md bg-emerald-400/15 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                    Mới nhất
                  </span>
                ) : null}
                <span className="ml-auto text-sm text-slate-500">{c.date}</span>
              </div>
              <ul className="mt-3 space-y-1.5">
                {c.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-6 text-slate-400">
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-neon-pink" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
