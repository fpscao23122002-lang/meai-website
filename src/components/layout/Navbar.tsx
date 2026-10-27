import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "@/components/ui/Link";
import { AnimatePresence, motion, useMotionValueEvent } from "framer-motion";
import { Menu, UserRound, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { WindowsIcon } from "@/components/ui/WindowsIcon";
import { navLinks } from "@/lib/site";
import { cn } from "@/lib/cn";
import { usePageScroll } from "@/hooks/usePageScroll";
import { useIndicator } from "@/hooks/useIndicator";
import { getScrollTarget, onScrollTarget } from "@/lib/scrollState";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<string | null>(null);
  const [scrollTarget, setScrollTarget] = useState<string | null>(getScrollTarget());
  const { pathname } = useLocation();
  const targetRef = useRef<string | null>(null);
  targetRef.current = scrollTarget;

  useEffect(() => onScrollTarget(setScrollTarget), []);

  // Scroll-spy: tô sáng mục menu ứng với section đang xem (tạm nghỉ khi trang đang tự cuộn tới mục vừa bấm)
  useEffect(() => {
    if (pathname !== "/") return;
    const ids = navLinks.map((l) => l.href.split("#")[1]).filter(Boolean) as string[];
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.set(e.target.id, e.intersectionRatio) : visible.delete(e.target.id)));
        if (targetRef.current) return;
        const best = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
        setSection(best ? best[0] : null);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  // Cuộn có chủ đích kết thúc → đồng bộ lại mục đang xem
  useEffect(() => {
    if (scrollTarget) {
      setSection(scrollTarget);
      setHidden(false);
    }
  }, [scrollTarget]);

  const activeSection = scrollTarget ?? section;
  const isActive = (href: string) =>
    href.startsWith("/#") ? pathname === "/" && activeSection === href.slice(2) : pathname === href;
  const activeHref = navLinks.find((l) => isActive(l.href))?.href ?? null;
  const { containerRef: navRef, style: pillStyle } = useIndicator<HTMLUListElement>(activeHref);

  // Ẩn menu khi cuộn xuống, hiện khi cuộn lên. Đọc vị trí cuộn trong vòng lặp khung hình của framer
  // (không ép trình duyệt tính lại bố cục mỗi sự kiện cuộn) và chỉ cập nhật state khi thật sự đổi.
  const { scrollY } = usePageScroll();
  const last = useRef(0);
  const flags = useRef({ scrolled: false, hidden: false });
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = last.current;
    last.current = y;
    const sc = y > 12;
    let hd = flags.current.hidden;
    if (targetRef.current) hd = false;
    else if (y > 400 && y > prev + 4) hd = true;
    else if (y < prev - 4 || y <= 400) hd = false;
    if (sc !== flags.current.scrolled) setScrolled(sc);
    if (hd !== flags.current.hidden) setHidden(hd);
    flags.current = { scrolled: sc, hidden: hd };
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: hidden && !open ? -80 : 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300",
        scrolled || open ? "border-b border-white/[0.06] bg-ink/80 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <nav className="container flex h-16 items-center justify-between gap-6">
        <Logo />

        <ul ref={navRef} className="relative hidden items-center gap-1 lg:flex">
          <span
            aria-hidden
            style={pillStyle}
            className="pointer-events-none absolute left-0 top-0 rounded-lg bg-white/[0.06] ring-1 ring-cyan-glow/30 will-change-transform"
          >
            <span className="absolute inset-x-3 -bottom-px h-px bg-brand-gradient" />
          </span>
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                data-ind={l.href}
                data-no-ripple
                className={cn(
                  "relative block rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-300 hover:text-white active:scale-95",
                  isActive(l.href) ? "text-white" : "text-slate-400",
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <ButtonLink href="/dashboard" variant="ghost" size="sm">
            <UserRound className="h-4 w-4" />
            Khách hàng
          </ButtonLink>
          <ButtonLink href="/tai-ve" size="sm">
            <WindowsIcon className="h-4 w-4" />
            Tải MeAI
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-slate-200 lg:hidden"
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "x" : "m"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.span>
          </AnimatePresence>
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/[0.06] lg:hidden"
          >
            <div className="container flex flex-col gap-1 py-4">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, type: "spring", stiffness: 300, damping: 24 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium hover:bg-white/5 hover:text-white",
                      isActive(l.href) ? "bg-white/[0.04] text-white" : "text-slate-300",
                    )}
                  >
                    {l.label}
                    {isActive(l.href) ? <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow shadow-glow-sm" /> : null}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-3">
                <ButtonLink href="/dashboard" variant="outline">
                  <UserRound className="h-4 w-4" />
                  Khách hàng
                </ButtonLink>
                <ButtonLink href="/tai-ve">
                  <WindowsIcon className="h-4 w-4" />
                  Tải MeAI
                </ButtonLink>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
