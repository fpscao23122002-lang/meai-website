import { Fragment, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type Part = string | { text: string; className?: string };

/**
 * Tiêu đề xuất hiện lần lượt từng từ (mờ → rõ, trượt lên).
 * `parts` cho phép tô gradient một cụm từ: ["Một app thay cả ", { text: "team content", className: "text-gradient" }]
 */
export function SplitText({
  parts,
  className,
  delay = 0,
  stagger = 0.045,
  inView = true,
  as = "span",
}: {
  parts: Part[];
  className?: string;
  delay?: number;
  stagger?: number;
  inView?: boolean;
  as?: "span" | "h1" | "h2";
}) {
  const words: { w: string; cls?: string }[] = [];
  parts.forEach((p) => {
    // Cụm có class riêng (VD: chữ gradient) chạy như một khối để gradient liền mạch
    if (typeof p !== "string") {
      words.push({ w: p.text, cls: p.className });
      return;
    }
    p.split(/(\s+)/).forEach((w) => w && words.push({ w }));
  });

  const Tag = motion[as];
  const anim = { opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } };
  let idx = 0;

  return (
    <Tag className={className} aria-label={words.map((x) => x.w).join("")}>
      {words.map(({ w, cls }, i) => {
        if (/^\s+$/.test(w)) return <Fragment key={i}>{w}</Fragment>;
        const d = delay + idx++ * stagger;
        return (
          <motion.span
            key={i}
            aria-hidden
            className={cn("inline-block", cls)}
            initial={{ opacity: 0, y: "0.45em", filter: "blur(8px)" }}
            {...(inView ? { whileInView: anim, viewport: { once: true, margin: "-60px" } } : { animate: anim })}
            transition={{ duration: 0.7, delay: d, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}
          </motion.span>
        );
      })}
    </Tag>
  );
}

export function GradientText({ children }: { children: ReactNode }) {
  return <span className="text-gradient">{children}</span>;
}
