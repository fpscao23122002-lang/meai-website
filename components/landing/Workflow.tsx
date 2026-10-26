"use client";

import { motion } from "framer-motion";
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
          description="Không cần biết code, không cần học edit. Workflow thiết kế cho dân MMO, Affiliate và chủ shop muốn ra content đều đặn mỗi ngày."
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
