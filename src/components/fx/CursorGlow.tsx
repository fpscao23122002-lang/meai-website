import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useFinePointer } from "@/hooks/useDevice";

/** Quầng sáng + vòng tròn đi theo con trỏ (chỉ PC). Vòng phóng to khi rê lên nút/liên kết */
export function CursorGlow() {
  const fine = useFinePointer();
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const rx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const ry = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const gx = useSpring(x, { stiffness: 60, damping: 20 });
  const gy = useSpring(y, { stiffness: 60, damping: 20 });
  const [hot, setHot] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (!fine) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHot(Boolean((e.target as HTMLElement | null)?.closest("a, button, [role=button], input, textarea, select")));
    };
    const d = () => setDown(true);
    const u = () => setDown(false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", d);
    window.addEventListener("pointerup", u);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", d);
      window.removeEventListener("pointerup", u);
    };
  }, [fine, x, y]);

  if (!fine) return null;
  return (
    <>
      <motion.div
        aria-hidden
        style={{ x: gx, y: gy }}
        className="pointer-events-none fixed left-0 top-0 z-0 -ml-[260px] -mt-[260px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(0,240,255,0.07),rgba(252,49,153,0.04)_40%,transparent_70%)]"
      />
      <motion.div aria-hidden style={{ x: rx, y: ry }} className="pointer-events-none fixed left-0 top-0 z-[90]">
        <motion.div
          animate={{ scale: down ? 0.7 : hot ? 1.8 : 1, opacity: hot ? 0.9 : 0.55 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="-ml-4 -mt-4 h-8 w-8 rounded-full border border-cyan-glow/70 mix-blend-screen shadow-[0_0_14px_rgba(0,240,255,0.5)]"
        />
      </motion.div>
    </>
  );
}
