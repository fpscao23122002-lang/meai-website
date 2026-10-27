import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Expand, ZoomIn } from "lucide-react";
import { Lightbox } from "./Lightbox";
import { cn } from "@/lib/cn";

type ZoomImageProps = {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  w: number;
  h: number;
  /** Ảnh độ phân giải gốc dùng cho kính lúp & phóng to (mặc định = src) */
  full?: string;
  fullW?: number;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
};

const LENS = 210;

/**
 * Ảnh có kính lúp: rê chuột để soi chi tiết ở độ phân giải gốc (máy tính),
 * bấm để mở xem toàn màn hình / 100%.
 */
export function ZoomImage({ src, srcSet, sizes, alt, w, h, full, fullW, priority, className, imgClassName }: ZoomImageProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const [fine, setFine] = useState(false);
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const zoomSrc = full ?? src;
  const nativeW = fullW ?? w;

  useEffect(() => {
    setFine(window.matchMedia("(pointer: fine)").matches);
  }, []);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current;
    const lens = lensRef.current;
    if (!wrap || !lens) return;
    const r = wrap.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    // Phóng đúng tới độ phân giải gốc (tối thiểu x1.8)
    const zoom = Math.max(1.8, nativeW / r.width);
    lens.style.transform = `translate3d(${x - LENS / 2}px, ${y - LENS / 2}px, 0)`;
    lens.style.backgroundSize = `${r.width * zoom}px ${r.height * zoom}px`;
    lens.style.backgroundPosition = `${-(x * zoom - LENS / 2)}px ${-(y * zoom - LENS / 2)}px`;
  };

  return (
    <>
      <div
        ref={wrapRef}
        className={cn("group relative cursor-zoom-in overflow-hidden", className)}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onPointerMove={fine ? move : undefined}
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`Phóng to: ${alt}`}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpen(true)}
      >
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          width={w}
          height={h}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : undefined}
          className={cn("block h-auto w-full", imgClassName)}
        />
        {fine ? (
          <div
            ref={lensRef}
            aria-hidden
            className={cn(
              "pointer-events-none absolute left-0 top-0 rounded-full border-2 border-cyan-glow/70 bg-ink bg-no-repeat shadow-[0_0_0_4px_rgba(0,0,0,0.35),0_0_40px_rgba(0,240,255,0.45)] transition-opacity duration-200",
              hover ? "opacity-100" : "opacity-0",
            )}
            style={{ width: LENS, height: LENS, backgroundImage: hover ? `url(${zoomSrc})` : undefined }}
          />
        ) : null}
        <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-ink/85 px-2.5 py-1.5 text-[11px] font-medium text-slate-200 ring-1 ring-white/10 backdrop-blur transition group-hover:bg-ink">
          {fine ? <ZoomIn className="h-3.5 w-3.5 text-cyan-glow" /> : <Expand className="h-3.5 w-3.5 text-cyan-glow" />}
          {fine ? "Rê chuột để soi · bấm để phóng to" : "Chạm để phóng to"}
        </span>
      </div>
      <Lightbox open={open} onClose={() => setOpen(false)} src={zoomSrc} alt={alt} w={nativeW} />
    </>
  );
}
