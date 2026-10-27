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
    let tries = 0;
    let timer = 0;
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (tries++ < 20) {
        timer = window.setTimeout(tryScroll, 50);
      }
    };
    tryScroll();
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}
