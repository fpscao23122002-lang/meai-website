import { motion } from "framer-motion";
import { Link } from "@/components/ui/Link";
import { ArrowUpRight, Facebook, Mail, MessageCircle, Phone, Sparkles, Youtube } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { siteConfig } from "@/lib/site";

const columns = [
  {
    title: "Sản phẩm",
    links: [
      { href: "/#tinh-nang", label: "Tính năng" },
      { href: "/#giao-dien", label: "Giao diện app" },
      { href: "/#demo", label: "Trải nghiệm thử" },
      { href: "/#bang-gia", label: "Bảng giá" },
      { href: "/dashboard#changelog", label: "Lịch sử cập nhật" },
    ],
  },
  {
    title: "Tài nguyên",
    links: [
      { href: "/docs", label: "Hướng dẫn sử dụng" },
      { href: "/docs#cai-dat", label: "Cài đặt & kích hoạt" },
      { href: "/docs#studio", label: "Tạo ảnh & video hàng loạt" },
      { href: "/docs#kich-ban", label: "Kịch bản & LadiPage" },
      { href: "/docs#dang-reels", label: "Đăng Facebook Reels" },
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      { href: "/dashboard", label: "Quản lý License" },
      { href: "/#faq", label: "Câu hỏi thường gặp" },
      { href: siteConfig.contact.zalo, label: "Nhóm Zalo cộng đồng" },
      { href: `mailto:${siteConfig.contact.email}`, label: "Gửi yêu cầu hỗ trợ" },
    ],
  },
];

const socials = [
  { href: siteConfig.contact.facebook, label: "Facebook", Icon: Facebook },
  { href: siteConfig.contact.youtube, label: "YouTube", Icon: Youtube },
  { href: siteConfig.contact.zalo, label: "Zalo", Icon: MessageCircle },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/[0.06] bg-[#08080F]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
        <div className="absolute inset-0 bg-brand-gradient opacity-40" />
        <span className="absolute inset-y-0 left-0 w-1/4 animate-shine bg-gradient-to-r from-transparent via-white to-transparent" />
      </div>
      <div className="container grid gap-12 py-16 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease }}>
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
            {siteConfig.fullName}. Biến danh sách prompt, kịch bản hay một link LadiPage thành hàng trăm video Reels — một mình bạn vận hành cả một
            xưởng content.
          </p>
          <div className="mt-6 space-y-2 text-sm text-slate-400">
            <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-2 hover:text-white">
              <Mail className="h-4 w-4 text-cyan-brand" /> {siteConfig.contact.email}
            </a>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-neon-pink" /> Hotline/Zalo: {siteConfig.contact.hotline}
            </p>
          </div>
          <div className="mt-6 flex gap-2">
            {socials.map(({ href, label, Icon }, i) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                initial={{ opacity: 0, scale: 0.4, rotate: -30 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.3 + i * 0.1 }}
                whileHover={{ y: -5, rotate: -8, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="glow-border group relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03] text-slate-300 hover:text-white hover:shadow-glow-sm"
              >
                <Icon className="h-4 w-4" />
                <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 scale-75 whitespace-nowrap rounded-md bg-ink px-2 py-0.5 text-[10px] text-white opacity-0 ring-1 ring-white/10 transition group-hover:scale-100 group-hover:opacity-100">
                  {label}
                </span>
              </motion.a>
            ))}
          </div>
          <Link
            href="/dashboard#changelog"
            className="group mt-6 inline-flex items-center gap-2 rounded-full border border-cyan-glow/25 bg-cyan-glow/5 px-3 py-1 text-xs text-cyan-glow transition hover:border-cyan-glow/50"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-cyan-glow" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-cyan-glow" />
            </span>
            <Sparkles className="h-3 w-3" /> Bản mới nhất v{siteConfig.latestVersion}
            <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {columns.map((col, c) => (
          <motion.div
            key={col.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 + c * 0.1, ease }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {col.title}
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + c * 0.1 }}
                className="mt-2 block h-px w-8 origin-left bg-brand-gradient"
              />
            </h3>
            <ul className="mt-5 space-y-3">
              {col.links.map((l, i) => (
                <motion.li
                  key={l.label}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 + c * 0.1 + i * 0.05 }}
                >
                  <Link href={l.href} className="group relative inline-flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-cyan-glow">
                    {l.label}
                    <ArrowUpRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                    <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-brand-gradient transition-transform duration-300 group-hover:scale-x-100" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
      {/* Chữ thương hiệu cỡ lớn, gradient chạy chậm */}
      <div aria-hidden className="container overflow-hidden [perspective:800px]">
        <p className="flex select-none justify-center text-[22vw] font-extrabold leading-[0.85] tracking-tighter lg:text-[220px]">
          {"MeAI".split("").map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: "60%", rotateX: -60 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.1, ease }}
              whileHover={{ y: -18, transition: { type: "spring", stiffness: 300, damping: 12 } }}
              className="inline-block bg-[linear-gradient(90deg,rgba(0,240,255,0.28),rgba(252,49,153,0.28),rgba(0,240,255,0.28))] bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x"
              style={{ animationDelay: `${-i * 0.4}s` }}
            >
              {ch}
            </motion.span>
          ))}
        </p>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} MeAI Studio. Bảo lưu mọi quyền.</p>
          <p>
            Muse, Google Flow, Seedance, Facebook và LadiPage là thương hiệu của các chủ sở hữu tương ứng.
          </p>
        </div>
      </div>
    </footer>
  );
}
