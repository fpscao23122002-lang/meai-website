import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { SplitText } from "@/components/fx/SplitText";
import { cn } from "@/lib/cn";

type Part = string | { text: string; className?: string };

type Props = {
  eyebrow: string;
  /** Mảng các cụm chữ → hiệu ứng hiện từng từ; ReactNode → hiện cả khối */
  title: ReactNode | Part[];
  description?: ReactNode;
  className?: string;
  tone?: "cyan" | "pink";
};

export function SectionHeading({ eyebrow, title, description, className, tone = "cyan" }: Props) {
  return (
    <div className={cn("mx-auto max-w-3xl text-center", className)}>
      <Reveal y={12}>
        <span
          className={cn(
            "relative inline-flex items-center gap-2 overflow-hidden rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
            tone === "cyan" ? "border-cyan-brand/25 bg-cyan-brand/10 text-cyan-glow" : "border-neon-pink/30 bg-neon-pink/10 text-pink-300",
          )}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className={cn("absolute inset-0 animate-ping rounded-full", tone === "cyan" ? "bg-cyan-glow" : "bg-neon-pink")} />
            <span className={cn("relative h-1.5 w-1.5 rounded-full", tone === "cyan" ? "bg-cyan-glow" : "bg-neon-pink")} />
          </span>
          {eyebrow}
          <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        </span>
      </Reveal>
      <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
        {Array.isArray(title) ? <SplitText parts={title as Part[]} /> : <Reveal delay={0.05}>{title}</Reveal>}
      </h2>
      <motion.div
        aria-hidden
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-5 h-px w-24 bg-brand-gradient"
      />
      {description ? (
        <Reveal delay={0.2}>
          <p className="mt-5 text-pretty text-base leading-7 text-slate-400 sm:text-lg">{description}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
