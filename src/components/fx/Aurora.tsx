import { useEffect, useMemo, useRef } from "react";

/** Nền động toàn trang: các quầng sáng trôi chậm + hạt sáng lấp lánh (chỉ dùng transform/opacity để mượt) */
export function Aurora() {
  const ref = useRef<HTMLDivElement>(null);

  // Khi đang cuộn: tạm dừng các quầng sáng (trôi rất chậm nên mắt không nhận ra), giúp trình duyệt
  // dồn toàn bộ sức xử lý cho việc cuộn → mượt hơn trên mọi thiết bị. Tiếp tục ngay khi ngừng cuộn.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer = 0;
    const onScroll = () => {
      if (!el.classList.contains("aurora-paused")) el.classList.add("aurora-paused");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => el.classList.remove("aurora-paused"), 160);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, []);

  const particles = useMemo(() => {
    // Sinh vị trí cố định (giả ngẫu nhiên) để không đổi giữa các lần render
    let seed = 7;
    const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    const count = typeof window !== "undefined" && window.innerWidth < 768 ? 16 : 36;
    return Array.from({ length: count }, () => ({
      left: `${rand() * 100}%`,
      top: `${rand() * 100}%`,
      size: 1 + rand() * 2.2,
      delay: `${-rand() * 12}s`,
      duration: `${8 + rand() * 10}s`,
      cyan: rand() > 0.45,
    }));
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden [contain:strict]">
      <div className="absolute -left-[15%] -top-[20%] h-[60vmax] w-[60vmax] animate-aurora-1 rounded-full bg-[radial-gradient(circle,rgba(0,240,255,0.13),transparent_60%)]" />
      <div className="absolute -right-[20%] top-[10%] h-[55vmax] w-[55vmax] animate-aurora-2 rounded-full bg-[radial-gradient(circle,rgba(252,49,153,0.11),transparent_60%)]" />
      <div className="absolute -bottom-[25%] left-[20%] h-[50vmax] w-[50vmax] animate-aurora-3 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.09),transparent_60%)]" />
      {particles.map((p, i) => (
        <span
          key={i}
          className={`absolute animate-twinkle rounded-full ${p.cyan ? "bg-cyan-glow" : "bg-neon-pink"}`}
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            boxShadow: `0 0 ${p.size * 4}px ${p.cyan ? "rgba(0,240,255,0.8)" : "rgba(252,49,153,0.8)"}`,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(11,11,20,0.75))]" />
    </div>
  );
}
