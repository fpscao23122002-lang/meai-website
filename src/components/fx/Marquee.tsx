import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Băng chạy vô tận (CSS thuần, dừng khi rê chuột) */
export function Marquee({ children, reverse, duration = 40, className }: { children: ReactNode; reverse?: boolean; duration?: number; className?: string }) {
  return (
    <div className={cn("group relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]", className)}>
      {[0, 1].map((k) => (
        <div
          key={k}
          aria-hidden={k === 1}
          className={cn(
            "flex shrink-0 items-center gap-4 pr-4 group-hover:[animation-play-state:paused]",
            reverse ? "animate-marquee-reverse" : "animate-marquee",
          )}
          style={{ animationDuration: `${duration}s` }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
