"use client";

import { motion } from "framer-motion";
import { ListOrdered, Send, Users, Wand2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    Icon: Users,
    title: "Cắm tài khoản",
    desc: "Đăng nhập các tài khoản Muse, Google Flow, Seedance vào MeAI. Phiên được lưu & mã hóa trên máy bạn.",
  },
  {
    Icon: ListOrdered,
    title: "Dán list prompt",
    desc: "Mỗi dòng một kịch bản. Gắn ảnh người mẫu / sản phẩm, chọn tỉ lệ 9:16 cho Reels hoặc 16:9 cho YouTube.",
  },
  {
    Icon: Wand2,
    title: "Bấm chạy & đi ngủ",
    desc: "Hàng đợi tự chia việc cho tài khoản rảnh, tự retry task lỗi, tải thành phẩm về Thư viện và ghép video.",
  },
  {
    Icon: Send,
    title: "Lên sóng tự động",
    desc: "Lên lịch đăng Facebook Reels đa fanpage, đẩy video sản phẩm sang LadiPage để chốt đơn.",
  },
];

export function Workflow() {
  return (
    <section className="relative py-24">
      <div className="container">
        <SectionHeading
          eyebrow="Quy trình"
          title={
            <>
              Từ ý tưởng tới Reels <span className="text-gradient">trong 4 bước</span>
            </>
          }
          description="Không cần biết code, không cần học edit. Workflow được thiết kế cho dân MMO, Affiliate và chủ shop muốn ra content đều đặn mỗi ngày."
        />
        <div className="relative mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-cyan-brand/40 to-transparent lg:block" />
          {steps.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative"
            >
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink">
                <div className="glow-border flex h-14 w-14 items-center justify-center rounded-2xl bg-panel shadow-glow-sm">
                  <Icon className="h-6 w-6 text-cyan-glow" />
                </div>
              </div>
              <p className="mt-5 font-mono text-xs text-neon-pink">BƯỚC {String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-1 text-lg font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
