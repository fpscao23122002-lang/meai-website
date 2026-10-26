"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { WindowsIcon } from "@/components/ui/WindowsIcon";
import { StudioMockup } from "./StudioMockup";
import { siteConfig } from "@/lib/site";

const stats = [
  { value: "3", label: "Engine AI tích hợp" },
  { value: "6", label: "Ảnh tham chiếu / prompt" },
  { value: "5", label: "Tỉ lệ khung hình" },
  { value: "∞", label: "Tài khoản chạy song song" },
];

const ease = [0.22, 1, 0.36, 1] as const;
const MotionLink = motion.create(Link);

export function Hero({ previewSrc }: { previewSrc?: string }) {
  return (
    <section className="relative overflow-hidden pb-20 pt-32 sm:pt-36">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-brand/20 blur-[120px]" />
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
            Mới: v{siteConfig.latestVersion} — Seedance Ảnh → Video & ghép video có nhạc nền
            <ArrowRight className="h-3.5 w-3.5" />
          </MotionLink>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
            className="mt-7 text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[58px]"
          >
            <span className="text-gradient bg-[length:200%_auto] animate-gradient-x">MeAI Studio</span>
            <br className="hidden sm:block" /> Xưởng Sản Xuất Video AI &{" "}
            <span className="whitespace-nowrap">Tự Động Hóa Reels</span> Đa Tài Khoản
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease }}
            className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-slate-400 sm:text-lg"
          >
            Dán 100 prompt, bấm chạy, đi pha cà phê. MeAI tự chia task cho hàng chục tài khoản Muse, Google Flow,
            Seedance, giữ đồng nhất nhân vật & sản phẩm, ghép video và lên lịch đăng Reels — một mình bạn vận hành cả
            một team content.
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
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Dùng thử 3 ngày, không cần thẻ
            </span>
            <span className="flex items-center gap-1">
              <Lock className="h-3.5 w-3.5 text-cyan-glow" /> Tài khoản & dữ liệu lưu 100% trên máy bạn
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 18 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.3, ease }}
          style={{ transformPerspective: 1600 }}
          className="relative mx-auto mt-16 max-w-6xl"
        >
          <div className="absolute -inset-x-10 -inset-y-6 -z-10 rounded-[40px] bg-brand-gradient opacity-20 blur-3xl" />
          {previewSrc ? (
            <div className="glow-border overflow-hidden rounded-2xl bg-panel shadow-[0_40px_120px_-30px_rgba(6,182,212,0.35)]">
              <Image
                src={previewSrc}
                alt="Giao diện phần mềm MeAI Studio"
                width={1920}
                height={1080}
                priority
                className="h-auto w-full"
              />
            </div>
          ) : (
            <StudioMockup />
          )}
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
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
