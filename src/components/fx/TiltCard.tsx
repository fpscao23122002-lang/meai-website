import type { MouseEvent, ReactNode } from "react";
import { motion, useMotionValue, useSpring, type HTMLMotionProps } from "framer-motion";
import { trackSpotlight } from "./spotlight";
import { cn } from "@/lib/cn";

type TiltCardProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  max?: number;
  spotlight?: boolean;
  /** class cho lớp ngoài (bố cục: col-span, h-full…) */
  wrapperClassName?: string;
};

/**
 * Thẻ nghiêng 3D nhẹ theo con trỏ + quầng sáng spotlight.
 * Khi đứng yên transform trở về `none` nên ảnh/chữ bên trong luôn sắc nét.
 */
export function TiltCard({
  children,
  className,
  wrapperClassName,
  max = 6,
  spotlight = true,
  onMouseMove,
  onMouseLeave,
  ...rest
}: TiltCardProps) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 180, damping: 20 });
  const rotateY = useSpring(ry, { stiffness: 180, damping: 20 });

  const move = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * max * 2);
    rx.set(-py * max * 2);
    if (spotlight) trackSpotlight(e);
    onMouseMove?.(e);
  };
  const leave = (e: MouseEvent<HTMLDivElement>) => {
    rx.set(0);
    ry.set(0);
    onMouseLeave?.(e);
  };

  return (
    // perspective đặt ở lớp ngoài: khi góc nghiêng = 0, lớp trong không còn transform 3D
    <div className={cn("[perspective:1100px]", wrapperClassName)}>
      <motion.div
        onMouseMove={move}
        onMouseLeave={leave}
        style={{ rotateX, rotateY }}
        className={cn(spotlight && "spotlight", className)}
        {...rest}
      >
        {children}
      </motion.div>
    </div>
  );
}
