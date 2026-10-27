import type { MouseEvent } from "react";

/** Gắn vào onMouseMove của phần tử có class `spotlight`: quầng sáng chạy theo con trỏ */
export function trackSpotlight(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}
