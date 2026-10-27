import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
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
  const activeIdx = docSections.findIndex((s) => s.id === active);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const list = (
    <ul className="space-y-0.5">
      {docSections.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            onClick={() => setOpen(false)}
            className={cn(
              "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              active === s.id ? "font-semibold text-white" : "text-slate-400 hover:text-white",
            )}
          >
            {active === s.id ? (
              <motion.span
                layoutId="docs-active"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 rounded-lg border-l-2 border-cyan-glow bg-cyan-brand/10"
              />
            ) : (
              <span className="absolute inset-0 rounded-lg bg-white/[0.03] opacity-0 transition-opacity group-hover:opacity-100" />
            )}
            <span className={cn("relative font-mono text-[10px] transition-colors", i <= activeIdx ? "text-cyan-glow" : "text-slate-600")}>
              {i < activeIdx ? "✓" : String(i + 1).padStart(2, "0")}
            </span>
            <span className="relative transition-transform duration-300 group-hover:translate-x-0.5">{s.title}</span>
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
        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 rounded-xl border border-white/10 bg-panel p-2">{list}</div>
            </motion.div>
          ) : null}
        </AnimatePresence>
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/5">
          <motion.div style={{ scaleX: progress }} className="h-full origin-left bg-brand-gradient" />
        </div>
      </div>

      {/* Desktop */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <p className="mb-3 flex items-center justify-between px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Mục lục
            <span className="font-mono normal-case tracking-normal text-cyan-glow">
              {activeIdx + 1}/{docSections.length}
            </span>
          </p>
          <div className="mx-3 mb-3 h-1 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div style={{ scaleX: progress }} className="h-full origin-left bg-brand-gradient" />
          </div>
          {list}
        </div>
      </aside>
    </>
  );
}
