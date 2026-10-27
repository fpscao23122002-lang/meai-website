import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Combine, ListOrdered, UserRound, Users } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    Icon: Users,
    title: "Thêm tài khoản",
    desc: "Tab Tài khoản → thêm Muse, Flow, Seedance hoặc Dola. Đặt số TK chạy đồng thời, tổng luồng, gán proxy nếu cần.",
  },
  {
    Icon: UserRound,
    title: "Nạp Tư liệu",
    desc: "Lưu nhân vật (@tên), bật Người mẫu cố định hoặc Ảnh luân phiên để mọi video giữ đúng một gương mặt, một sản phẩm.",
  },
  {
    Icon: ListOrdered,
    title: "Dán prompt & Tạo & chạy",
    desc: "Mỗi prompt cách nhau 1 dòng trống — hoặc viết Kịch bản, hoặc dán link LadiPage. Hàng đợi tự chia việc, tự xử lý lỗi.",
  },
  {
    Icon: Combine,
    title: "Ghép & đăng Reels",
    desc: "Thành phẩm về Thư viện: Ghép video, Lưu vào Tư liệu, bấm Đăng FB Reels với caption chốt đơn.",
  },
];

export function Workflow() {
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: gridRef, offset: ["start 85%", "end 55%"] });
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section className="relative py-24">
      <div className="container">
        <SectionHeading
          eyebrow="Quy trình"
          title={["Từ ý tưởng tới Reels ", { text: "trong 4 bước", className: "text-gradient" }]}
          description="Không cần biết code, không cần học edit. Workflow thiết kế cho dân MMO, Affiliate và chủ shop muốn ra content đều đặn mỗi ngày."
        />
        <div ref={gridRef} className="relative mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* Đường nối các bước: tự vẽ theo tiến độ cuộn */}
          <div className="pointer-events-none absolute left-7 right-7 top-7 hidden h-px bg-white/[0.06] lg:block">
            <motion.div style={{ scaleX: line }} className="h-full origin-left bg-brand-gradient shadow-[0_0_12px_rgba(0,240,255,0.8)]" />
          </div>
          {steps.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="group relative"
            >
              <motion.div
                initial={{ scale: 0.4, rotate: -30 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.2 + i * 0.15 }}
                className="relative z-10 flex h-14 w-14 items-center justify-center"
              >
                <span className="absolute -inset-2 animate-spin-slow rounded-[22px] bg-[conic-gradient(from_0deg,transparent,rgba(0,240,255,0.55),transparent_40%,rgba(252,49,153,0.5),transparent_75%)] opacity-0 blur-[2px] transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute inset-0 rounded-2xl bg-ink" />
                <span className="glow-border relative flex h-14 w-14 items-center justify-center rounded-2xl bg-panel shadow-glow-sm transition-transform duration-500 group-hover:-translate-y-1">
                  <Icon className="h-6 w-6 text-cyan-glow" />
                </span>
              </motion.div>
              <p className="mt-5 font-mono text-xs text-neon-pink">BƯỚC {String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-1 text-lg font-bold text-white transition-colors group-hover:text-cyan-glow">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
