import { useEffect, useMemo, type ReactNode } from "react";
import { cancelFrame, frame, motionValue } from "framer-motion";
import { PageScrollContext } from "@/hooks/usePageScroll";

/**
 * Cung cấp một nguồn cuộn dùng chung cho toàn site (xem usePageScroll).
 * Chỉ đọc window.scrollY (mỗi khung hình tối đa một lần) khi cuộn (không ép tính lại bố cục); chiều cao trang được ghi nhớ
 * và chỉ đo lại khi nội dung/màn hình đổi kích thước.
 */
export function ScrollProvider({ children }: { children: ReactNode }) {
  const value = useMemo(() => ({ scrollY: motionValue(0), scrollYProgress: motionValue(0) }), []);

  useEffect(() => {
    let max = 1;
    const update = () => {
      const y = window.scrollY;
      value.scrollY.set(y);
      value.scrollYProgress.set(Math.min(1, Math.max(0, y / max)));
    };
    const measure = () => {
      max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      update();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    // Gom việc đọc vị trí cuộn vào pha "đọc" của vòng khung hình framer (1 lần/khung, trước mọi thao tác ghi)
    const onScroll = () => frame.read(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      cancelFrame(update);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
    };
  }, [value]);

  return <PageScrollContext.Provider value={value}>{children}</PageScrollContext.Provider>;
}
