import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

/** Số đếm tăng dần khi cuộn tới. Giữ nguyên phần chữ đi kèm (VD: "4K" → đếm 0→4 rồi thêm "K") */
export function CountUp({ value, duration = 1.6 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : "";
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || !match) return;
    const controls = animate(0, target, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, target, duration]);

  return <span ref={ref}>{match ? `${n}${suffix}` : value}</span>;
}

/** Đếm số tiền (VD "2.990.000") giữ định dạng dấu chấm kiểu Việt Nam */
export function CountMoney({ value, duration = 1.4 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const target = Number(value.replace(/\D/g, ""));
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v / 1000) * 1000) });
    return () => controls.stop();
  }, [inView, target, duration]);

  return <span ref={ref}>{(inView ? n : 0).toLocaleString("vi-VN")}</span>;
}
