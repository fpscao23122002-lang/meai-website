import { useContext, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { BareFrame, SIDEBAR } from "./mockUtils";
import { useIndicator } from "@/hooks/useIndicator";
import { cn } from "@/lib/cn";

/* Bộ "linh kiện" dựng lại giao diện app MeAI bằng HTML/CSS: luôn sắc nét, tự co giãn theo màn hình */


/** Khung cửa sổ app: thanh tiêu đề + thanh công cụ + menu trái (ẩn menu trên điện thoại) */
export function AppFrame({
  title,
  active,
  free = 2,
  total = 2,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  active: string;
  free?: number;
  total?: number;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  const bare = useContext(BareFrame);
  if (bare) return <div className={cn("min-w-0 text-left", bodyClassName)}>{children}</div>;
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B14] text-left shadow-[0_30px_100px_-30px_rgba(0,0,0,0.9)]", className)}>
      <div className="flex items-center gap-2 border-b border-cyan-glow/25 px-3 py-2 text-[11px] sm:px-4">
        <span className="font-semibold text-white">{title}</span>
        <span className="ml-auto hidden rounded-md border border-white/10 bg-panel px-2 py-0.5 text-slate-300 sm:inline">Mặc định</span>
        <span className="hidden rounded-md border border-white/10 bg-panel px-2 py-0.5 text-slate-300 sm:inline">Dự án</span>
        <motion.span
          key={`${free}/${total}`}
          initial={{ scale: 0.85, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          className="ml-auto flex items-center gap-1.5 rounded-full border border-cyan-glow/50 bg-cyan-glow/10 px-2 py-0.5 font-semibold text-cyan-glow sm:ml-0"
        >
          <span className={cn("h-1.5 w-1.5 rounded-full bg-cyan-glow", free < total && "animate-pulse")} />
          Tài khoản: {free}/{total} rảnh
        </motion.span>
        <span className="hidden rounded-md border border-white/10 bg-panel px-2 py-0.5 font-semibold text-white md:inline">Chạy tiếp</span>
        <span className="hidden rounded-md border border-white/10 bg-panel px-2 py-0.5 font-semibold text-neon-pink md:inline">Dừng tất cả</span>
      </div>
      <div className="flex">
        <aside className="hidden w-[58px] shrink-0 flex-col items-center gap-1 border-r border-white/[0.06] py-2.5 lg:flex">
          <img src="/brand/meai-logo.webp" alt="" width={32} height={32} className="mb-1.5 rounded-lg" />
          {SIDEBAR.map(({ id, label, Icon }) => (
            <span
              key={id}
              className={cn(
                "relative flex w-[50px] flex-col items-center gap-0.5 rounded-lg py-1.5 text-center text-[8.5px] leading-tight",
                id === active ? "text-cyan-glow" : "text-slate-500",
              )}
            >
              {id === active ? <span className="absolute inset-0 rounded-lg bg-cyan-glow/10 ring-1 ring-cyan-glow/40" /> : null}
              <Icon className="relative h-3.5 w-3.5" />
              <span className="relative">{label}</span>
            </span>
          ))}
        </aside>
        <div className={cn("min-w-0 flex-1 p-2.5 sm:p-3", bodyClassName)}>{children}</div>
      </div>
    </div>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-xl border border-white/[0.07] bg-panel p-3", className)}>{children}</div>;
}

export function PTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-[13px] font-bold text-white", className)}>{children}</p>;
}

export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-[11px] font-semibold text-slate-300", className)}>{children}</p>;
}

export function Btn({
  children,
  variant = "default",
  className,
  pressed,
  onClick,
  disabled,
}: {
  children: ReactNode;
  variant?: "default" | "primary" | "danger";
  className?: string;
  pressed?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const cls = cn(
    "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md px-2.5 py-1 text-[11px] font-semibold transition-[filter,background-color,opacity]",
    variant === "primary" && "bg-brand-gradient text-ink shadow-glow-sm",
    variant === "default" && "border border-white/10 bg-ink/50 text-slate-100",
    variant === "danger" && "border border-white/10 bg-ink/50 text-neon-pink",
    onClick && "cursor-pointer hover:brightness-125 active:scale-95",
    onClick && variant !== "primary" && "hover:bg-white/10",
    disabled && "pointer-events-none opacity-50",
    className,
  );
  const anim = pressed ? { scale: [1, 0.92, 1] } : { scale: 1 };
  return onClick ? (
    <motion.button type="button" onClick={onClick} animate={anim} transition={{ duration: 0.3 }} whileTap={{ scale: 0.92 }} className={cls}>
      {children}
    </motion.button>
  ) : (
    <motion.span animate={anim} transition={{ duration: 0.3 }} className={cls}>
      {children}
    </motion.span>
  );
}

export function Toggle({ on, label, hint, onChange }: { on: boolean; label?: ReactNode; hint?: string; onChange?: (v: boolean) => void }) {
  const inner = (
    <>
      <span className={cn("relative h-4 w-7 shrink-0 rounded-full transition-colors duration-300", on ? "bg-gradient-to-r from-cyan-glow to-neon-pink" : "bg-white/15")}>
        <motion.span
          animate={{ left: on ? 14 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-0.5 h-3 w-3 rounded-full bg-white shadow"
        />
      </span>
      {label}
      {hint ? <span className="text-[10px] text-slate-500">({hint})</span> : null}
    </>
  );
  return onChange ? (
    <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)} className="flex items-center gap-2 text-left text-[11px] text-slate-200">
      {inner}
    </button>
  ) : (
    <span className="flex items-center gap-2 text-[11px] text-slate-200">{inner}</span>
  );
}

export function Field({ children, className, mono }: { children: ReactNode; className?: string; mono?: boolean }) {
  return (
    <div className={cn("min-h-[26px] rounded-md border border-white/[0.08] bg-ink/60 px-2 py-1 text-[11px] text-slate-200", mono && "font-mono", className)}>
      {children}
    </div>
  );
}

/** Ô nhập đang được gõ: hiển thị con trỏ nhấp nháy */
export function Caret({ show = true }: { show?: boolean }) {
  return show ? <span className="ml-px inline-block h-3 w-px translate-y-0.5 animate-pulse bg-cyan-glow" /> : null;
}

export function Seg({
  options,
  value,
  className,
  layoutKey,
  dataKey,
  onPick,
}: {
  options: string[];
  value: string;
  className?: string;
  layoutKey: string;
  /** Gắn data-opt để con trỏ ảo tìm tới từng lựa chọn */
  dataKey?: string;
  onPick?: (o: string) => void;
}) {
  const { containerRef, style } = useIndicator(value);
  void layoutKey; // giữ API cũ; chỉ báo trượt nay dùng CSS (nhẹ hơn layoutId)
  return (
    <div ref={containerRef} className={cn("relative flex gap-0.5 rounded-md border border-white/[0.06] p-0.5", className)}>
      <span aria-hidden style={style} className="pointer-events-none absolute left-0 top-0 rounded bg-cyan-glow/10 ring-1 ring-cyan-glow/60 will-change-transform" />
      {options.map((o) => (
        <span
          key={o}
          data-opt={dataKey ? `${dataKey}:${o}` : undefined}
          data-ind={o}
          role={onPick ? "button" : undefined}
          tabIndex={onPick ? 0 : undefined}
          onClick={onPick ? () => onPick(o) : undefined}
          onKeyDown={onPick ? (e) => (e.key === "Enter" || e.key === " ") && onPick(o) : undefined}
          className={cn(
            "relative min-w-0 flex-1 whitespace-nowrap rounded px-1 py-0.5 text-center text-[10.5px] font-medium",
            value === o ? "text-cyan-glow" : "text-slate-400",
            onPick && value !== o && "cursor-pointer hover:bg-white/5 hover:text-white",
          )}
        >
          <span className="relative">{o}</span>
        </span>
      ))}
    </div>
  );
}

export function StatusPill({ status, progress }: { status: "wait" | "run" | "done" | "error"; progress?: number }) {
  const map = {
    wait: "border-white/15 text-slate-400",
    run: "border-violet-400/40 text-violet-300",
    done: "border-cyan-glow/50 bg-cyan-glow/10 text-cyan-glow",
    error: "border-neon-pink/50 bg-neon-pink/10 text-neon-pink",
  };
  const text = { wait: "Chờ", run: `${progress ?? 0}%`, done: "Xong", error: "Lỗi" }[status];
  return (
    <motion.span
      key={status}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn("inline-flex shrink-0 items-center gap-1 rounded-full border px-1.5 py-px text-[9.5px] font-semibold", map[status])}
    >
      {status === "run" ? <LoaderCircle className="h-2.5 w-2.5 animate-spin" /> : <span className="h-1 w-1 rounded-full bg-current" />}
      {text}
    </motion.span>
  );
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-1 overflow-hidden rounded-full bg-white/[0.06]", className)}>
      <motion.div className="h-full w-full origin-left bg-brand-gradient" initial={false} animate={{ scaleX: value / 100 }} transition={{ duration: 0.25 }} />
    </div>
  );
}

/** Con trỏ chuột ảo chạy theo kịch bản; `click` tạo gợn sóng */
export function FakeCursor({ x, y, click, visible = true }: { x: number; y: number; click: number; visible?: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-30"
      animate={{ x, y, opacity: visible ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20, mass: 0.8 }}
    >
      <motion.span
        key={click}
        initial={{ scale: 0, opacity: 0.8 }}
        animate={{ scale: 2.6, opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute -left-3 -top-3 h-6 w-6 rounded-full border-2 border-cyan-glow"
      />
      <svg width="18" height="20" viewBox="0 0 18 20" className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
        <path d="M1 1l6.5 17 2.4-7 7.1-2.4z" fill="white" stroke="#0B0B14" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );
}

export function Toast({ show, children }: { show: boolean; children: ReactNode }) {
  // Lớp ngoài giữ căn giữa, lớp trong chạy hiệu ứng (tránh framer ghi đè translate)
  return (
    <div className="pointer-events-none absolute left-1/2 top-10 z-20 -translate-x-1/2 sm:bottom-3 sm:top-auto">
      <motion.div
        initial={false}
        animate={show ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 16, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="whitespace-nowrap rounded-lg border border-cyan-glow/40 bg-ink/95 px-3 py-1.5 text-[11px] font-semibold text-cyan-glow shadow-glow-sm"
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Bọc một màn hình dựng bằng code: khi người dùng chạm/bấm vào, demo tự chạy dừng lại để họ tự thao tác;
 * nhãn góc trên cho biết trạng thái và có nút "Xem lại demo".
 */
export function Interactive({
  user,
  onTakeOver,
  onReplay,
  children,
}: {
  user: boolean;
  onTakeOver: () => void;
  onReplay: () => void;
  children: ReactNode;
}) {
  return (
    <div className="relative" onPointerDownCapture={() => !user && onTakeOver()}>
      {/* Dòng trạng thái riêng phía trên để không che nút nào của màn hình */}
      <div className="mb-2 flex h-6 justify-end">
        <AnimatePresence mode="wait" initial={false}>
          {user ? (
            <motion.button
              key="replay"
              type="button"
              data-no-ripple
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              onClick={onReplay}
              className="flex items-center gap-1 rounded-full border border-neon-pink/40 bg-ink/90 px-2.5 py-1 text-[10.5px] font-semibold text-pink-200 shadow-glow-pink hover:text-white"
            >
              ↻ Bạn đang tự thao tác · Xem lại demo
            </motion.button>
          ) : (
            <motion.span
              key="auto"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-1.5 rounded-full border border-cyan-glow/30 bg-ink/90 px-2.5 py-1 text-[10.5px] font-medium text-cyan-glow"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-glow" />
              Đang tự chạy demo · chạm vào để tự thao tác
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {children}
    </div>
  );
}
