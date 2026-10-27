import { Reveal } from "./Reveal";
import { cn } from "@/lib/cn";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, className }: Props) {
  return (
    <Reveal className={cn("mx-auto max-w-3xl text-center", className)}>
      <span className="inline-flex items-center gap-2 rounded-full border border-cyan-brand/25 bg-cyan-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-glow">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow shadow-glow-sm" />
        {eyebrow}
      </span>
      <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? <p className="mt-5 text-pretty text-base leading-7 text-slate-400 sm:text-lg">{description}</p> : null}
    </Reveal>
  );
}
