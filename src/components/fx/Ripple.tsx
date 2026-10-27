import { useEffect } from "react";

/**
 * Gợn sóng khi bấm/chạm vào bất kỳ nút hoặc liên kết nào (PC & mobile).
 * Gắn một lần ở App; tự tạo span gợn sóng tại vị trí bấm rồi xoá đi.
 */
export function RippleLayer() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onDown = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>("a, button, [data-ripple]");
      if (!target || target.closest("[data-no-ripple]")) return;
      const r = target.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2.2;
      const span = document.createElement("span");
      span.className = "fx-ripple";
      span.style.width = span.style.height = `${size}px`;
      span.style.left = `${e.clientX - r.left - size / 2}px`;
      span.style.top = `${e.clientY - r.top - size / 2}px`;
      const cs = getComputedStyle(target);
      if (cs.position === "static") target.style.position = "relative";
      if (cs.overflow !== "hidden") target.classList.add("fx-ripple-host");
      target.appendChild(span);
      span.addEventListener("animationend", () => span.remove(), { once: true });
    };
    document.addEventListener("pointerdown", onDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);
  return null;
}
