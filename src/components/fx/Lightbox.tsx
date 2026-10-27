import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize, Minimize, X } from "lucide-react";

/** Xem ảnh toàn màn hình. Bấm "100%" để xem đúng độ phân giải gốc và kéo/cuộn để soi chi tiết */
export function Lightbox({
  open,
  onClose,
  src,
  alt,
  w,
}: {
  open: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  w: number;
}) {
  const [actual, setActual] = useState(false);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    setActual(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex flex-col bg-black/90 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={onClose}
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3" onClick={(e) => e.stopPropagation()}>
            <p className="truncate text-sm font-medium text-slate-300">{alt}</p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => setActual((v) => !v)}
                className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20"
              >
                {actual ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                {actual ? "Vừa màn hình" : "Xem 100%"}
              </button>
              <button type="button" onClick={onClose} aria-label="Đóng" className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className={actual ? "flex-1 overflow-auto px-4 pb-4" : "flex flex-1 items-center justify-center overflow-hidden px-4 pb-4"}>
            <motion.img
              key={actual ? "actual" : "fit"}
              src={src}
              alt={alt}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => {
                e.stopPropagation();
                setActual((v) => !v);
              }}
              style={actual ? { width: w, maxWidth: "none" } : undefined}
              className={
                actual
                  ? "mx-auto cursor-zoom-out rounded-lg"
                  : "max-h-full max-w-full cursor-zoom-in rounded-lg object-contain shadow-[0_0_80px_-20px_rgba(0,240,255,0.5)]"
              }
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
