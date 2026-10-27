import { useEffect, useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import { docSections } from "@/lib/docs";
import { cn } from "@/lib/cn";

export function DocsSidebar() {
  const [active, setActive] = useState<string>(docSections[0].id);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const els = docSections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-90px 0px -65% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const current = docSections.find((s) => s.id === active) ?? docSections[0];

  const list = (
    <ul className="space-y-0.5">
      {docSections.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg border-l-2 px-3 py-2 text-sm transition-colors",
              active === s.id
                ? "border-cyan-glow bg-cyan-brand/10 font-semibold text-white"
                : "border-transparent text-slate-400 hover:bg-white/[0.03] hover:text-white",
            )}
          >
            <span className="font-mono text-[10px] text-slate-600">{String(i + 1).padStart(2, "0")}</span>
            {s.title}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Mobile */}
      <div className="sticky top-16 z-30 -mx-4 border-b border-white/[0.06] bg-ink/90 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-panel px-4 py-2.5 text-sm text-white"
        >
          <span className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-cyan-glow" /> {current.title}
          </span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
        </button>
        {open ? <div className="mt-2 rounded-xl border border-white/10 bg-panel p-2">{list}</div> : null}
      </div>

      {/* Desktop */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Mục lục</p>
          {list}
        </div>
      </aside>
    </>
  );
}
