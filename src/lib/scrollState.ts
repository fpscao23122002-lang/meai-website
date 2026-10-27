/**
 * Điều phối "cuộn có chủ đích" (khi bấm link tới #section):
 * trong lúc trang đang tự cuộn tới đích, menu giữ nguyên mục đích (không nhảy qua các mục trung gian)
 * và thanh menu không tự ẩn. Kết thúc khi trang ngừng cuộn.
 */
type Listener = (target: string | null) => void;

let target: string | null = null;
let idleTimer = 0;
let maxTimer = 0;
const listeners = new Set<Listener>();

const emit = () => listeners.forEach((l) => l(target));

function end() {
  if (target === null) return;
  target = null;
  window.removeEventListener("scroll", onScroll);
  window.clearTimeout(idleTimer);
  window.clearTimeout(maxTimer);
  emit();
}

function onScroll() {
  window.clearTimeout(idleTimer);
  idleTimer = window.setTimeout(end, 140);
}

export function startProgrammaticScroll(id: string) {
  target = id;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.clearTimeout(idleTimer);
  window.clearTimeout(maxTimer);
  idleTimer = window.setTimeout(end, 260); // trường hợp không cần cuộn
  maxTimer = window.setTimeout(end, 2500);
  emit();
}

export function getScrollTarget() {
  return target;
}

export function onScrollTarget(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
