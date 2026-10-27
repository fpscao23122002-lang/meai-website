import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Khi đổi trang: cuộn lên đầu; khi URL có #hash: cuộn tới đúng section (kể cả khi chuyển từ trang khác) */
export function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    const timers: number[] = [];
    let tries = 0;

    const tryScroll = () => {
      const el = document.getElementById(id);
      if (!el) {
        if (tries++ < 20) timers.push(window.setTimeout(tryScroll, 50));
        return;
      }
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Ảnh/hiệu ứng phía trên có thể làm trang dài ra sau khi cuộn → canh lại vài lần
      [700, 1400].forEach((ms) =>
        timers.push(
          window.setTimeout(() => {
            const top = el.getBoundingClientRect().top;
            if (Math.abs(top - 80) > 40) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }, ms),
        ),
      );
    };
    tryScroll();
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [pathname, hash]);

  return null;
}
