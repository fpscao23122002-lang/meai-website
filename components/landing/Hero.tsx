"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, HardDrive, PlayCircle, Sparkles, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { WindowsIcon } from "@/components/ui/WindowsIcon";
import { siteConfig } from "@/lib/site";

const stats = [
  { value: "3", label: "Engine AI: Muse · Flow · Seedance" },
  { value: "4", label: "Nền tảng tài khoản (có Dola)" },
  { value: "6", label: "Ảnh tham chiếu / prompt" },
  { value: "4K", label: "Độ phân giải tối đa" },
];

const ease = [0.22, 1, 0.36, 1] as const;
const MotionLink = motion.create(Link);

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-32 sm:pt-36">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-brand/15 blur-[120px]" />
        <div className="absolute right-[-10%] top-40 h-[420px] w-[520px] rounded-full bg-neon-pink/15 blur-[120px]" />
      </div>

      <div className="container">
        <div className="mx-auto max-w-5xl text-center">
          <MotionLink
            href="/dashboard#changelog"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="glow-border inline-flex items-center gap-2 rounded-full bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-slate-300 transition hover:text-white"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-glow" />
            Mới v{siteConfig.latestVersion}: Seedance Đầu–cuối, 21:9 & Google Flow 4K
            <ArrowRight className="h-3.5 w-3.5" />
          </MotionLink>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
            className="mt-7 text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[58px]"
          >
            <span className="text-gradient">MeAI Studio</span>
            <br className="hidden sm:block" /> Xưởng Sản Xuất Video AI &{" "}
            <span className="whitespace-nowrap">Tự Động Hóa Reels</span> Đa Tài Khoản
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease }}
            className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-slate-400 sm:text-lg"
          >
            Dán danh sách prompt, bấm <strong className="text-white">Tạo &amp; chạy</strong>. MeAI tự chia task cho nhiều tài
            khoản Muse, Google Flow, Seedance, giữ đồng nhất nhân vật & sản phẩm, chạy lại lỗi, ghép video và đăng thẳng lên
            Facebook Reels — một mình bạn vận hành cả xưởng content.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <ButtonLink href={siteConfig.downloadUrl} download size="lg" className="w-full sm:w-auto">
              <WindowsIcon className="h-5 w-5" />
              Tải bản cài đặt cho Windows
            </ButtonLink>
            <ButtonLink href="#demo" variant="outline" size="lg" className="w-full sm:w-auto">
              <PlayCircle className="h-5 w-5 text-cyan-glow" />
              Bấm thử Studio ngay
            </ButtonLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.36 }}
            className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500"
          >
            <span>
              Phiên bản {siteConfig.latestVersion} · Windows 10/11 64-bit · {siteConfig.installerSize}
            </span>
            <span className="flex items-center gap-1">
              <HardDrive className="h-3.5 w-3.5 text-cyan-glow" /> Thành phẩm lưu thẳng vào máy bạn
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-neon-pink" /> Không giới hạn tài khoản & luồng
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 16 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.3, ease }}
          style={{ transformPerspective: 1600 }}
          className="relative mx-auto mt-16 max-w-6xl"
        >
          <div className="absolute -inset-x-10 -inset-y-6 -z-10 rounded-[40px] bg-brand-gradient opacity-20 blur-3xl" />
          <div className="glow-border overflow-hidden rounded-2xl bg-panel shadow-[0_40px_120px_-30px_rgba(0,240,255,0.35)]">
            <Image
              src="/screens/studio-muse-anh.webp"
              alt="Giao diện Studio của phần mềm MeAI: chọn engine Muse, nhập prompt, hàng đợi task và xem trước kết quả"
              width={1920}
              height={1039}
              priority
              sizes="(min-width: 1280px) 1152px, 100vw"
              className="h-auto w-full"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="absolute -left-3 top-[42%] hidden items-center gap-2 rounded-xl border border-cyan-glow/30 bg-ink/90 px-3 py-2 text-xs font-semibold text-cyan-glow shadow-glow-sm backdrop-blur md:flex"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-glow" /> Tài khoản: 2/2 rảnh
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="absolute -right-3 top-1/3 hidden items-center gap-2 rounded-xl border border-neon-pink/30 bg-ink/90 px-3 py-2 text-xs font-semibold text-pink-300 shadow-glow-pink backdrop-blur md:flex"
          >
            <CheckCircle2 className="h-4 w-4" /> Xong · tự lưu vào Thư viện
          </motion.div>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center"
            >
              <p className="text-gradient text-3xl font-extrabold sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
