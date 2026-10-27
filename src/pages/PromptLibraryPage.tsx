import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, CopyPlus, Lightbulb, Search, Sparkles, Wand2, X } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { WindowsIcon } from "@/components/ui/WindowsIcon";
import { trackSpotlight } from "@/components/fx/spotlight";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useIndicator } from "@/hooks/useIndicator";
import { engines } from "@/lib/data";
import { promptGroups, promptSnippets, promptTips, type PromptItem } from "@/lib/prompts";
import { cn } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;
const ALL = "tat-ca";

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied((k) => (k === key ? null : k)), 1600);
    } catch {
      /* clipboard bị chặn */
    }
  };
  return { copied, copy };
}

function PromptCard({ item, index, copied, onCopy }: { item: PromptItem; index: number; copied: boolean; onCopy: () => void }) {
  const eng = engines.find((e) => e.id === item.engine)!;
  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: Math.min(index, 6) * 0.05, ease }}
      onMouseMove={trackSpotlight}
      className="spotlight glow-border flex flex-col rounded-2xl bg-panel p-5 shadow-panel"
    >
      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-semibold" style={{ borderColor: `${eng.hex}55`, color: eng.hex }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: eng.hex }} />
          {eng.name}
        </span>
        <span className="rounded-full bg-white/[0.05] px-2.5 py-0.5 text-slate-300">{item.mode}</span>
        <span className="rounded-full bg-white/[0.05] px-2.5 py-0.5 font-mono text-slate-400">{item.ratio}</span>
      </div>
      <h3 className="mt-3 font-semibold text-white">{item.title}</h3>
      <p className="mt-3 flex-1 whitespace-pre-line rounded-xl border border-white/[0.06] bg-black/30 p-3 text-[13px] leading-6 text-slate-300">{item.text}</p>
      {item.tip ? (
        <p className="mt-3 flex gap-2 text-xs leading-5 text-slate-400">
          <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" /> {item.tip}
        </p>
      ) : null}
      <button
        type="button"
        onClick={onCopy}
        className={cn(
          "mt-4 inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors",
          copied ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300" : "border-white/10 text-slate-200 hover:border-cyan-glow/40 hover:text-white",
        )}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "Đã chép" : "Sao chép prompt"}
      </button>
    </motion.article>
  );
}

export default function PromptLibraryPage() {
  usePageMeta({
    title: "Prompt mẫu tạo ảnh & video AI",
    description:
      "Thư viện prompt mẫu cho MeAI Studio: quảng cáo sản phẩm, UGC review, thời trang, phim ngắn, ẩm thực — ghi rõ engine Muse, Google Flow, Seedance và chế độ nên dùng.",
    path: "/prompt-mau",
  });
  const [group, setGroup] = useState(ALL);
  const [q, setQ] = useState("");
  const { copied, copy } = useCopy();
  const tabs = useIndicator(group);

  const items = useMemo(() => {
    const k = q.trim().toLowerCase();
    return promptGroups
      .filter((g) => group === ALL || g.id === group)
      .flatMap((g) => g.items.map((it) => ({ ...it, key: `${g.id}:${it.title}` })))
      .filter((it) => !k || `${it.title} ${it.text}`.toLowerCase().includes(k));
  }, [group, q]);

  // Chép cả nhóm theo đúng định dạng ô Prompt của Studio: mỗi prompt cách nhau 1 dòng trống
  const batchText = items.map((it) => it.text).join("\n\n");
  const total = promptGroups.reduce((n, g) => n + g.items.length, 0);

  return (
    <>
      <Navbar />
      <main className="relative overflow-x-clip pt-16">
        <PageHero
          badge={
            <>
              <Wand2 className="h-3.5 w-3.5" /> {total} prompt mẫu · cập nhật liên tục
            </>
          }
          title={["Prompt mẫu ", { text: "chép là chạy", className: "text-gradient" }]}
          description="Mỗi prompt ghi rõ nên dùng engine nào, chế độ nào và khổ hình bao nhiêu. Chép từng cái, hoặc chép cả nhóm rồi dán thẳng vào ô Prompt của Studio — MeAI tự tách thành từng task."
        />

        <div className="container space-y-12 pb-16 pt-10">
          {/* Bộ lọc */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div ref={tabs.containerRef} className="relative flex flex-wrap gap-1 rounded-2xl border border-white/[0.08] bg-panel/80 p-1">
              <span aria-hidden style={tabs.style} className="pointer-events-none absolute left-0 top-0 rounded-xl bg-brand-gradient will-change-transform" />
              {[{ id: ALL, label: "Tất cả" }, ...promptGroups].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  data-ind={g.id}
                  data-no-ripple
                  onClick={() => setGroup(g.id)}
                  className={cn(
                    "relative rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                    group === g.id ? "text-white" : "text-slate-400 hover:text-white",
                  )}
                >
                  {g.label}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-panel/80 px-4 py-2.5 transition-colors focus-within:border-cyan-glow/50 lg:w-72">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm: serum, áo dài, phở…"
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
              {q ? (
                <button type="button" aria-label="Xoá tìm kiếm" onClick={() => setQ("")} className="text-slate-400 hover:text-white">
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-400">
              {group === ALL ? "Tất cả nhóm" : promptGroups.find((g) => g.id === group)?.desc} ·{" "}
              <span className="text-white">{items.length} prompt</span>
            </p>
            <button
              type="button"
              disabled={!items.length}
              onClick={() => void copy("__batch", batchText)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                copied === "__batch" ? "bg-emerald-400/15 text-emerald-300" : "bg-brand-gradient text-white shadow-glow-sm hover:-translate-y-0.5 disabled:opacity-50",
              )}
            >
              {copied === "__batch" ? <Check className="h-4 w-4" /> : <CopyPlus className="h-4 w-4" />}
              {copied === "__batch" ? `Đã chép ${items.length} prompt` : `Chép cả ${items.length} prompt để chạy hàng loạt`}
            </button>
          </div>

          <motion.div layout className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {items.map((it, i) => (
                <PromptCard key={it.key} item={it} index={i} copied={copied === it.key} onCopy={() => void copy(it.key, it.text)} />
              ))}
            </AnimatePresence>
          </motion.div>
          {!items.length ? <p className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-400">Không có prompt nào khớp “{q}”.</p> : null}

          {/* Cụm từ ghép thêm */}
          <section>
            <h2 className="flex items-center gap-2 text-2xl font-bold text-white sm:text-3xl">
              <Sparkles className="h-6 w-6 text-cyan-glow" /> Cụm từ ghép thêm
            </h2>
            <p className="mt-2 text-slate-400">Bấm để chép, rồi dán vào cuối prompt để điều khiển máy quay và phong cách hình ảnh.</p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {promptSnippets.map((g) => (
                <div key={g.group} className="glow-border rounded-2xl bg-panel p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{g.group}</p>
                  <div className="mt-4 space-y-2">
                    {g.items.map((s) => {
                      const key = `snip:${s.label}`;
                      return (
                        <button
                          key={s.label}
                          type="button"
                          onClick={() => void copy(key, s.text)}
                          className="group flex w-full items-start gap-3 rounded-xl border border-white/[0.06] bg-black/20 px-3.5 py-2.5 text-left transition-colors hover:border-cyan-glow/30"
                        >
                          <span className="w-28 shrink-0 text-sm font-semibold text-white">{s.label}</span>
                          <span className="flex-1 text-[13px] leading-5 text-slate-400">{s.text}</span>
                          {copied === key ? (
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                          ) : (
                            <Copy className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 transition-colors group-hover:text-cyan-glow" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Kinh nghiệm */}
          <section className="glow-border rounded-3xl bg-panel p-6 shadow-panel sm:p-8">
            <h2 className="text-2xl font-bold text-white">5 điều nên nhớ khi viết prompt</h2>
            <ol className="mt-6 grid gap-4 md:grid-cols-2">
              {promptTips.map((t, i) => (
                <motion.li
                  key={t}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, ease }}
                  className="flex gap-3 text-sm leading-6 text-slate-300"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">{i + 1}</span>
                  {t}
                </motion.li>
              ))}
            </ol>
          </section>

          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center">
            <ButtonLink href="/tai-ve">
              <WindowsIcon className="h-4 w-4" /> Tải MeAI để chạy hàng loạt
            </ButtonLink>
            <ButtonLink href="/#demo" variant="outline">
              Bấm thử Studio trên trình duyệt
            </ButtonLink>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
