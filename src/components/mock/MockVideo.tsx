import { useEffect, useRef } from "react";
import type { Media } from "@/lib/showcase";
import { cn } from "@/lib/cn";

/**
 * Thành phẩm video trong màn hình Studio dựng bằng code: tự phát (tắt tiếng, lặp) khi đang hiện trên màn hình,
 * tự dừng khi cuộn đi; tôn trọng "Giảm chuyển động" (chỉ hiện ảnh bìa).
 */
export function MockVideo({ media, className }: { media: Media; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) void v.play().catch(() => undefined);
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, [media.video]);

  return (
    <video
      ref={ref}
      src={media.video}
      poster={media.poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={media.title}
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
    />
  );
}
