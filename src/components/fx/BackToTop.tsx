import { usePageScroll } from "@/hooks/usePageScroll";
import { AnimatePresence, motion, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { ArrowUp } from "lucide-react";

/** Nút lên đầu trang, vòng ngoài hiển thị tiến độ cuộn */
export function BackToTop() {
  const { scrollY, scrollYProgress } = usePageScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setShow(v > 900));
  const C = 2 * Math.PI * 21;

  return (
    <AnimatePresence>
      {show ? (
        <motion.button
          type="button"
          aria-label="Lên đầu trang"
          initial={{ opacity: 0, scale: 0.4, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.4, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group fixed bottom-5 right-4 z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-ink/90 text-cyan-glow shadow-glow-sm backdrop-blur sm:bottom-7 sm:right-7"
        >
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="21" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
            <motion.circle
              cx="24"
              cy="24"
              r="21"
              fill="none"
              stroke="url(#btt-g)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={C}
              style={{ pathLength: scrollYProgress }}
            />
            <defs>
              <linearGradient id="btt-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#00F0FF" />
                <stop offset="1" stopColor="#FC3199" />
              </linearGradient>
            </defs>
          </svg>
          <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
