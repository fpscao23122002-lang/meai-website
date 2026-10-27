import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/** Bộ đếm tăng đều mỗi `ms` khi phần tử đang hiển thị (dừng khi cuộn đi hoặc bật "Giảm chuyển động") */
export function useTicker<T extends HTMLElement>(ms: number) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    const id = window.setInterval(() => setTick((t) => t + 1), ms);
    return () => window.clearInterval(id);
  }, [inView, reduce, ms]);
  return { ref, tick };
}
