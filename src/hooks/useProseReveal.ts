import { useEffect } from "react";

/** Đánh dấu từng mục tài liệu (.prose-doc > section) khi cuộn tới để chạy hiệu ứng xuất hiện (CSS .in-view) */
export function useProseReveal() {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(".prose-doc > section");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -12% 0px" },
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
