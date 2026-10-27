import { useState } from "react";
import { Camera } from "lucide-react";
import { Lightbox } from "@/components/fx/Lightbox";
import { cn } from "@/lib/cn";

/** Nút "Xem ảnh chụp thật": mở ảnh chụp màn hình gốc của app ở chế độ toàn màn hình / 100% */
export function ShotButton({ src, w, label, className }: { src: string; w: number; label: string; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-slate-300 transition hover:border-cyan-glow/40 hover:text-white",
          className,
        )}
      >
        <Camera className="h-3.5 w-3.5 text-cyan-glow transition-transform group-hover:scale-110" />
        Xem ảnh chụp thật
      </button>
      <Lightbox open={open} onClose={() => setOpen(false)} src={src} alt={label} w={w} />
    </>
  );
}
