import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { startProgrammaticScroll } from "@/lib/scrollState";

/**
 * Khi đổi trang: cuộn lên đầu; khi URL có #hash (mở link trực tiếp hoặc chuyển từ trang khác): cuộn tới section.
 * Link trên cùng trang tự cuộn (state.internal) nên bỏ qua ở đây để không cuộn hai lần.
 */
export function ScrollManager() {
  const { pathname, hash, state } = useLocation();
  const internal = Boolean((state as { internal?: boolean } | null)?.internal);

  useEffect(() => {
    if (internal) return;
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
      startProgrammaticScroll(id);
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Trang vừa dựng xong có thể còn thay đổi chiều cao (ảnh, font) → canh lại một lần nếu lệch nhiều
      timers.push(
        window.setTimeout(() => {
          const top = el.getBoundingClientRect().top;
          if (Math.abs(top - 80) > 40) {
            startProgrammaticScroll(id);
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 1100),
      );
    };
    tryScroll();
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [pathname, hash, internal]);

  return null;
}
