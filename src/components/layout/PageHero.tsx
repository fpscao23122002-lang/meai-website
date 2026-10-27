import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { SplitText } from "@/components/fx/SplitText";

type Part = string | { text: string; className?: string };

/** Phần đầu dùng chung cho các trang phụ (Tải về, Prompt mẫu, Điều khoản…) */
export function PageHero({
  badge,
  title,
  description,
  children,
}: {
  badge: ReactNode;
  title: Part[];
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="container relative border-b border-white/[0.06] pb-12 pt-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] overflow-hidden">
        <div className="absolute left-1/2 top-[-200px] h-[400px] w-[800px] -translate-x-1/2 scale-[1.5] rounded-full bg-[radial-gradient(closest-side,rgba(14,230,250,0.15),rgba(14,230,250,0.083)_45%,transparent)]" />
      </div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 rounded-full border border-cyan-glow/25 bg-cyan-glow/10 px-3 py-1 text-xs font-semibold text-cyan-glow"
      >
        {badge}
      </motion.p>
      <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
        <SplitText inView={false} delay={0.1} parts={title} />
      </h1>
      {description ? (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-4 max-w-2xl text-slate-400"
        >
          {description}
        </motion.p>
      ) : null}
      {children}
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-4 bottom-0 h-px origin-left bg-brand-gradient sm:inset-x-6 lg:inset-x-8"
      />
    </header>
  );
}
