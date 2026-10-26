import Link from "next/link";
import { cn } from "@/lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={cn("h-9 w-9", className)}>
      <defs>
        <linearGradient id="meai-logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#00F2FE" />
          <stop offset="0.45" stopColor="#06B6D4" />
          <stop offset="0.8" stopColor="#EC4899" />
          <stop offset="1" stopColor="#FF0844" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="#111827" />
      <rect x="1.5" y="1.5" width="61" height="61" rx="14.5" fill="none" stroke="url(#meai-logo-g)" strokeWidth="2.5" />
      <path
        d="M15 46V20l10.5 14L36 20v26"
        fill="none"
        stroke="url(#meai-logo-g)"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="46" cy="22" r="4.5" fill="#00F2FE" />
      <path d="M46 32v14" stroke="#EC4899" strokeWidth="5.5" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-2.5", className)} aria-label="MeAI Studio - Trang chủ">
      <LogoMark className="transition-transform duration-300 group-hover:scale-105" />
      <span className="flex flex-col leading-none">
        <span className="text-lg font-extrabold tracking-tight text-white">
          Me<span className="text-gradient">AI</span>
        </span>
        <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Studio</span>
      </span>
    </Link>
  );
}
