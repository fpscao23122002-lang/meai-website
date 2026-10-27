import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { History } from "lucide-react";
import { changelog } from "@/lib/data";
import { trackSpotlight } from "@/components/fx/spotlight";
import { cn } from "@/lib/cn";

const tagStyle = {
  Major: "bg-brand-gradient text-white",
  Feature: "bg-cyan-brand/15 text-cyan-glow",
  Fix: "bg-amber-400/15 text-amber-300",
} as const;

const ease = [0.22, 1, 0.36, 1] as const;

export function Changelog() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 80%", "end 60%"] });
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section id="changelog" className="scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
        className="flex items-center gap-3"
      >
        <motion.span
          initial={{ rotate: -180, scale: 0.4 }}
          whileInView={{ rotate: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient-soft ring-1 ring-cyan-brand/30"
        >
          <History className="h-5 w-5 text-cyan-glow" />
        </motion.span>
        <div>
          <h2 className="text-2xl font-bold text-white">Lịch sử phiên bản</h2>
          <p className="text-sm text-slate-500">Changelog — MeAI cập nhật liên tục, miễn phí trong thời hạn gói</p>
        </div>
      </motion.div>

      <ol ref={listRef} className="relative mt-8 space-y-6 pl-7">
        {/* Trục thời gian: tự vẽ theo tiến độ cuộn */}
        <span className="absolute bottom-0 left-0 top-0 w-px bg-white/10" />
        <motion.span style={{ scaleY: line }} className="absolute bottom-0 left-0 top-0 w-px origin-top bg-gradient-to-b from-cyan-glow via-violet-400 to-neon-pink" />

        {changelog.map((c, i) => (
          <motion.li
            key={c.version}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease }}
            className="relative"
          >
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.15 }}
              className={cn(
                "absolute -left-[35px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-ink",
                i === 0 ? "bg-cyan-glow shadow-glow-sm" : "bg-slate-600",
              )}
            >
              {i === 0 ? <span className="absolute inset-0 animate-ping rounded-full bg-cyan-glow" /> : null}
            </motion.span>
            <div
              onMouseMove={trackSpotlight}
              className="spotlight rounded-2xl border border-white/[0.07] bg-panel p-5 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-cyan-glow/25"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-lg font-bold text-white">v{c.version}</span>
                <span className={cn("rounded-md px-2 py-0.5 text-xs font-semibold", tagStyle[c.tag])}>{c.tag}</span>
                {i === 0 ? (
                  <span className="relative overflow-hidden rounded-md bg-emerald-400/15 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                    Mới nhất
                    <span className="absolute inset-y-0 left-0 w-1/2 animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  </span>
                ) : null}
                <span className="ml-auto text-sm text-slate-500">{c.date}</span>
              </div>
              <ul className="mt-3 space-y-1.5">
                {c.items.map((item, k) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + k * 0.08 }}
                    className="flex gap-2 text-sm leading-6 text-slate-400"
                  >
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-neon-pink" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
