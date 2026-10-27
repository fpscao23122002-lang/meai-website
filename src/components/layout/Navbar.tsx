import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "@/components/ui/Link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, UserRound, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { WindowsIcon } from "@/components/ui/WindowsIcon";
import { navLinks, siteConfig } from "@/lib/site";
import { cn } from "@/lib/cn";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<string | null>(null);
  const { pathname } = useLocation();

  // Scroll-spy: tô sáng mục menu ứng với section đang xem
  useEffect(() => {
    if (pathname !== "/") return;
    const ids = navLinks.map((l) => l.href.split("#")[1]).filter(Boolean) as string[];
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setSection(hit.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  const isActive = (href: string) =>
    href.startsWith("/#") ? pathname === "/" && section === href.slice(2) : pathname === href;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open ? "border-b border-white/[0.06] bg-ink/80 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <nav className="container flex h-16 items-center justify-between gap-6">
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "relative isolate block rounded-lg px-3.5 py-2 text-sm font-medium transition-colors hover:text-white",
                  isActive(l.href) ? "text-white" : "text-slate-400",
                )}
              >
                {isActive(l.href) ? (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-lg bg-white/[0.06] ring-1 ring-cyan-glow/30"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  >
                    <span className="absolute inset-x-3 -bottom-px h-px bg-brand-gradient" />
                  </motion.span>
                ) : null}
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
          <ButtonLink href={siteConfig.downloadUrl} download size="sm">
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
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-3">
                <ButtonLink href="/dashboard" variant="outline">
                  <UserRound className="h-4 w-4" />
                  Khách hàng
                </ButtonLink>
                <ButtonLink href={siteConfig.downloadUrl} download>
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
