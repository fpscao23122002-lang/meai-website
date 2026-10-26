import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export function LogoMark({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/brand/meai-logo.webp"
      alt="Logo MeAI"
      width={72}
      height={72}
      priority={priority}
      className={cn("h-9 w-9 rounded-[22%] shadow-glow-sm ring-1 ring-white/10", className)}
    />
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-2.5", className)} aria-label="MeAI Studio - Trang chủ">
      <LogoMark priority className="transition-transform duration-300 group-hover:scale-105" />
      <span className="flex flex-col leading-none">
        <span className="text-lg font-extrabold tracking-tight text-white">
          Me<span className="text-gradient">AI</span>
        </span>
        <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Studio</span>
      </span>
    </Link>
  );
}
