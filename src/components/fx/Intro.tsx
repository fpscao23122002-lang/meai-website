import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/** Màn chào logo ngắn (~1.1s) ở lần mở đầu tiên trong phiên */
export function Intro() {
  const [show, setShow] = useState(() => {
    try {
      return !sessionStorage.getItem("meai-intro") && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!show) return;
    try {
      sessionStorage.setItem("meai-intro", "1");
    } catch {
      /* bỏ qua */
    }
    const t = window.setTimeout(() => setShow(false), 1150);
    return () => window.clearTimeout(t);
  }, [show]);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="intro"
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0, rotate: -12 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 2.4, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 16 }}
            className="relative"
          >
            <div className="absolute -inset-8 animate-pulse-soft rounded-full bg-brand-gradient opacity-40 blur-3xl" />
            <img src="/brand/meai-logo.webp" alt="MeAI" width={112} height={112} className="relative h-28 w-28 rounded-[26%]" />
          </motion.div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-[38%] left-1/2 h-0.5 w-40 -translate-x-1/2 origin-left bg-brand-gradient"
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
