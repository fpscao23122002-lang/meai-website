import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Plus, Search, X } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { trackSpotlight } from "@/components/fx/spotlight";
import { faqs } from "@/lib/data";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;

/** Tô sáng từ khoá tìm kiếm trong câu hỏi */
function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded bg-cyan-glow/25 px-0.5 text-white">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const k = q.trim().toLowerCase();
    return faqs.map((f, i) => ({ ...f, i })).filter((f) => !k || f.q.toLowerCase().includes(k) || f.a.toLowerCase().includes(k));
  }, [q]);

  return (
    <section id="faq" className="relative py-24">
      <div className="container max-w-4xl">
        <SectionHeading
          eyebrow="FAQ"
          title={["Câu hỏi ", { text: "thường gặp", className: "text-gradient" }]}
          description="Chưa thấy câu trả lời bạn cần? Nhắn Zalo cho team MeAI — phản hồi trung bình dưới 15 phút trong giờ hành chính."
        />

        {/* Tìm nhanh */}
        <motion.label
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="group relative mx-auto mt-10 flex max-w-xl items-center gap-2 rounded-2xl border border-white/10 bg-panel/80 px-4 py-3 transition-colors focus-within:border-cyan-glow/50 focus-within:shadow-glow-sm"
        >
          <Search className="h-4 w-4 text-slate-500 transition-colors group-focus-within:text-cyan-glow" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(null);
            }}
            placeholder="Tìm câu hỏi: tài khoản, Reels, License…"
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
          <AnimatePresence>
            {q ? (
              <motion.button
                type="button"
                aria-label="Xoá tìm kiếm"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                onClick={() => setQ("")}
                className="rounded-full p-1 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </motion.button>
            ) : null}
          </AnimatePresence>
        </motion.label>

        <motion.div layout className="mt-8 space-y-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((f, idx) => {
              const isOpen = open === f.i;
              return (
                <motion.div
                  key={f.q}
                  layout
                  initial={{ opacity: 0, x: idx % 2 ? 40 : -40, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.55, delay: Math.min(idx, 6) * 0.06, ease }}
                  onMouseMove={trackSpotlight}
                  className={cn(
                    "spotlight relative overflow-hidden rounded-2xl border bg-panel/70 transition-[border-color,box-shadow] duration-300",
                    isOpen ? "border-cyan-brand/40 shadow-[0_0_0_1px_rgba(0,240,255,0.15),0_20px_50px_-25px_rgba(0,240,255,0.6)]" : "border-white/[0.07] hover:border-white/15",
                  )}
                >
                  {/* Viền sáng chạy quanh câu đang mở + thanh màu bên trái */}
                  {isOpen ? (
                    <>
                      <motion.span layoutId="faq-bar" className="absolute inset-y-0 left-0 w-1 bg-brand-gradient" />
                      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
                        <span className="block h-px w-1/3 animate-shine bg-gradient-to-r from-transparent via-cyan-glow to-transparent" />
                      </span>
                    </>
                  ) : null}
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : f.i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-${f.i}`}
                      className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                    >
                      <span className="flex items-start gap-3">
                        <span className={cn("mt-0.5 font-mono text-xs transition-colors", isOpen ? "text-cyan-glow" : "text-slate-600")}>
                          {String(f.i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-base font-semibold text-white">
                          <Highlight text={f.q} q={q.trim()} />
                        </span>
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 135 : 0, scale: isOpen ? 1.1 : 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 18 }}
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors",
                          isOpen ? "border-transparent bg-brand-gradient text-white shadow-glow-sm" : "border-white/10 text-slate-400",
                        )}
                      >
                        <Plus className="h-4 w-4" />
                      </motion.span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        id={`faq-${f.i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease }}
                        className="overflow-hidden"
                      >
                        <motion.p
                          initial={{ y: -8, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1, duration: 0.35 }}
                          className="px-6 pb-6 pl-[3.25rem] text-sm leading-7 text-slate-400"
                        >
                          {f.a}
                        </motion.p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <AnimatePresence>
            {list.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-dashed border-white/10 p-8 text-center"
              >
                <p className="text-sm text-slate-400">Chưa có câu hỏi nào khớp “{q}”.</p>
                <a
                  href={siteConfig.contact.zalo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-glow hover:underline"
                >
                  <MessageCircle className="h-4 w-4" /> Hỏi trực tiếp team MeAI qua Zalo
                </a>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
