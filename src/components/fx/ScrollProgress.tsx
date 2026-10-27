import { usePageScroll } from "@/hooks/usePageScroll";
import { motion, useSpring } from "framer-motion";

/** Thanh gradient mảnh ở đỉnh trang, chạy theo tiến độ cuộn */
export function ScrollProgress() {
  const { scrollYProgress } = usePageScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-brand-gradient shadow-[0_0_12px_rgba(0,240,255,0.7)]"
    />
  );
}
