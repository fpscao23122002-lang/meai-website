import { cn } from "@/lib/cn";

export type Variant = "primary" | "outline" | "ghost";
export type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-gradient bg-[length:200%_100%] text-white shadow-glow hover:bg-right hover:shadow-[0_0_32px_-2px_rgba(0,242,254,0.6),0_0_60px_-10px_rgba(255,8,68,0.7)] hover:-translate-y-0.5",
  outline:
    "glow-border bg-white/[0.03] text-slate-100 hover:bg-white/[0.07] hover:text-white hover:shadow-glow-sm",
  ghost: "text-slate-300 hover:bg-white/5 hover:text-white",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}
