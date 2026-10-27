import { createContext, useContext, useEffect, useRef, useState, type RefObject } from "react";
import { useTransform, type MotionValue } from "framer-motion";

/**
 * Một nguồn theo dõi cuộn duy nhất cho toàn site (tạo ở App bằng framer useScroll),
 * thay vì mỗi thành phần tự gắn trình theo dõi riêng và tự đo bố cục ở mỗi sự kiện cuộn.
 */
export type PageScroll = { scrollY: MotionValue<number>; scrollYProgress: MotionValue<number> };
export const PageScrollContext = createContext<PageScroll | null>(null);

export function usePageScroll() {
  const v = useContext(PageScrollContext);
  if (!v) throw new Error("usePageScroll cần nằm trong ScrollProvider");
  return v;
}

/**
 * Tiến độ cuộn (0→1) qua một phần tử, giống framer `useScroll({ target, offset })` với offset dạng
 * ["start <a>", "end <b>"] (a, b là tỉ lệ chiều cao màn hình). Vị trí & kích thước phần tử được ghi nhớ
 * và chỉ đo lại khi trang đổi kích thước → không ép trình duyệt tính lại bố cục mỗi khung hình.
 */
export function useElementProgress(ref: RefObject<HTMLElement | null>, startAt: number, endAt: number) {
  const { scrollY } = usePageScroll();
  const geo = useRef({ top: 0, height: 1, vh: 800 });
  const [, force] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      geo.current = { top: r.top + window.scrollY, height: r.height, vh: window.innerHeight };
      force((n) => n + 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [ref]);

  return useTransform(scrollY, (y) => {
    const { top, height, vh } = geo.current;
    const start = top - startAt * vh;
    const end = top + height - endAt * vh;
    return Math.min(1, Math.max(0, (y - start) / Math.max(1, end - start)));
  });
}
