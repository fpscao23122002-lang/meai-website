import type { ReactNode, PointerEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useFinePointer } from "@/hooks/useDevice";
import { cn } from "@/lib/cn";

/** Hiệu ứng "nam châm": phần tử bị hút nhẹ theo con trỏ (chỉ PC); trên mobile chỉ còn hiệu ứng nhấn */
export function Magnetic({ children, strength = 0.2, className }: { children: ReactNode; strength?: number; className?: string }) {
  const fine = useFinePointer();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 15, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 220, damping: 15, mass: 0.3 });

  const move = (e: PointerEvent<HTMLSpanElement>) => {
    if (!fine) return;
    const r = e.currentTarget.getBoundingClientRect();
    // Giới hạn biên độ để nút không đè lên phần tử bên cạnh
    const clamp = (v: number) => Math.max(-8, Math.min(8, v));
    x.set(clamp((e.clientX - r.left - r.width / 2) * strength));
    y.set(clamp((e.clientY - r.top - r.height / 2) * strength));
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      onPointerMove={move}
      onPointerLeave={reset}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.95 }}
      className={cn("inline-flex", className)}
    >
      {children}
    </motion.span>
  );
}
