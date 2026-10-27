import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Ô chỉ báo trượt (viên sáng di chuyển tới mục đang chọn) bằng CSS transform thuần.
 * Thay cho framer `layoutId` ở những chỗ cập nhật thường xuyên: hiệu ứng trượt y hệt nhưng
 * không bắt trình duyệt đo lại toàn bộ bố cục mỗi lần → mượt hơn nhiều.
 *
 * Dùng: gắn `containerRef` vào phần tử cha (position: relative), mỗi mục có `data-ind="<key>"`,
 * rồi render <span style={style} className="absolute left-0 top-0 ..."/> trong phần tử cha.
 */
export function useIndicator<T extends HTMLElement = HTMLDivElement>(activeKey: string | null | undefined) {
  const containerRef = useRef<T>(null);
  const [style, setStyle] = useState<CSSProperties>({ opacity: 0 });
  const first = useRef(true);

  useLayoutEffect(() => {
    const box = containerRef.current;
    if (!box) return;
    const measure = () => {
      const el = activeKey ? box.querySelector<HTMLElement>(`[data-ind="${CSS.escape(activeKey)}"]`) : null;
      if (!el) {
        setStyle((s) => ({ ...s, opacity: 0 }));
        return;
      }
      // Toạ độ tương đối với phần tử cha (cộng dồn qua các offsetParent trung gian)
      let x = 0;
      let y = 0;
      let node: HTMLElement | null = el;
      while (node && node !== box) {
        x += node.offsetLeft;
        y += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
        if (node && !box.contains(node)) break;
      }
      const animate = !first.current;
      first.current = false;
      setStyle({
        opacity: 1,
        width: el.offsetWidth,
        height: el.offsetHeight,
        transform: `translate3d(${x}px, ${y}px, 0)`,
        transition: animate
          ? "transform 420ms cubic-bezier(0.22, 1, 0.36, 1), width 420ms cubic-bezier(0.22, 1, 0.36, 1), height 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms"
          : "none",
      });
    };
    measure();
    // Đo lại khi kích thước thay đổi (đổi cỡ màn hình, font tải xong…)
    const ro = new ResizeObserver(() => {
      first.current = true;
      measure();
    });
    ro.observe(box);
    return () => ro.disconnect();
  }, [activeKey]);

  return { containerRef, style };
}
