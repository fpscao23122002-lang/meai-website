import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Tạm dừng các hiệu ứng CSS lặp vô hạn ở những khối đang nằm ngoài màn hình (người dùng không nhìn thấy),
 * và chạy tiếp ngay khi khối sắp cuộn tới. Phần đang hiển thị không bị thay đổi gì → giữ nguyên hiệu ứng,
 * nhưng trình duyệt không phải vẽ lại hàng chục chuyển động ẩn ở mỗi khung hình.
 */
export function OffscreenPause() {
  const { pathname } = useLocation();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.toggleAttribute("data-offscreen", !e.isIntersecting);
      },
      { rootMargin: "300px 0px" },
    );
    const seen = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll("section, footer").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });
    };
    // Trang tải theo nhu cầu (lazy) có thể dựng xong muộn hơn một chút → quét lại vài lần
    scan();
    const timers = [400, 1500, 3500].map((ms) => window.setTimeout(scan, ms));
    return () => {
      timers.forEach(clearTimeout);
      io.disconnect();
      document.querySelectorAll("[data-offscreen]").forEach((el) => el.removeAttribute("data-offscreen"));
    };
  }, [pathname]);

  return null;
}
