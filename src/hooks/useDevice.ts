import { useEffect, useState } from "react";

function useMedia(query: string, fallback = false) {
  const [match, setMatch] = useState(fallback);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return match;
}

/** Thiết bị có chuột (PC): bật các hiệu ứng theo con trỏ */
export const useFinePointer = () => useMedia("(hover: hover) and (pointer: fine)");
/** Màn hình nhỏ (điện thoại) */
export const useIsMobile = () => useMedia("(max-width: 767px)");
