import { useEffect, useState, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ButtonLink } from "@/components/ui/Button";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useFinePointer } from "@/hooks/useDevice";

/** Thanh "render lại" chạy tới 99% rồi báo lỗi, lặp lại */
function RenderBar() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setP((v) => (v >= 99 ? 0 : Math.min(99, v + 3 + Math.round(Math.random() * 6)))), 140);
    return () => window.clearInterval(id);
  }, []);
  const failed = p >= 99;
  return (
    <div className="mx-auto mt-8 w-full max-w-sm text-left">
      <div className="flex justify-between font-mono text-[11px]">
        <span className={failed ? "text-neon-pink" : "text-slate-400"}>
          {failed ? "✕ Lỗi: trang không tồn tại trong Thư viện" : "Đang render lại trang…"}
        </span>
        <span className="text-white">{p}%</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
        <motion.div
          className={failed ? "h-full bg-neon-pink" : "h-full bg-brand-gradient"}
          animate={{ width: `${p}%` }}
          transition={{ duration: 0.12 }}
        />
      </div>
    </div>
  );
}

const SHARDS = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${(i * 53) % 100}%`,
  size: 6 + ((i * 7) % 16),
  dur: 6 + (i % 5),
  cyan: i % 2 === 0,
}));

export default function NotFoundPage() {
  usePageMeta({ title: "Không tìm thấy trang", noindex: true });
  const fine = useFinePointer();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [14, -14]), { stiffness: 150, damping: 15 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-18, 18]), { stiffness: 150, damping: 15 });

  const move = (e: MouseEvent<HTMLElement>) => {
    if (!fine) return;
    mx.set(e.clientX / window.innerWidth - 0.5);
    my.set(e.clientY / window.innerHeight - 0.5);
  };

  return (
    <>
      <Navbar />
      <main onMouseMove={move} className="relative flex min-h-[78vh] flex-col items-center justify-center overflow-hidden px-4 pt-24 text-center">
        {/* Mảnh vỡ trôi */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {SHARDS.map((s, i) => (
            <motion.span
              key={i}
              className={`absolute rounded-sm border ${s.cyan ? "border-cyan-glow/40 bg-cyan-glow/10" : "border-neon-pink/40 bg-neon-pink/10"}`}
              style={{ left: s.left, top: s.top, width: s.size, height: s.size }}
              animate={{ y: [0, -30, 0], rotate: [0, 180, 360], opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            />
          ))}
        </div>

        <div className="[perspective:900px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.6, filter: "blur(16px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ rotateX: rx, rotateY: ry }}
            className="glitch relative select-none text-[34vw] font-extrabold leading-none tracking-tighter sm:text-[180px]"
            data-text="404"
          >
            <span className="text-gradient">404</span>
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-2 text-2xl font-bold text-white"
        >
          Trang này đã bị AI “render” mất rồi
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="mt-3 max-w-md text-slate-400">
          Đường dẫn không tồn tại hoặc đã được di chuyển. Thử quay về trang chủ hoặc xem hướng dẫn nhé.
        </motion.p>
        <RenderBar />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <ButtonLink href="/">Về trang chủ</ButtonLink>
          <ButtonLink href="/docs" variant="outline">
            Xem hướng dẫn
          </ButtonLink>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
