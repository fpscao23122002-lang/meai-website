import Link from "next/link";
import { Facebook, Mail, MessageCircle, Phone, Youtube } from "lucide-react";
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

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/[0.06] bg-[#08080F]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-brand-gradient opacity-40" />
      <div className="container grid gap-12 py-16 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
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
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="glow-border inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03] text-slate-300 transition hover:text-white hover:shadow-glow-sm"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">{col.title}</h3>
            <ul className="mt-5 space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-slate-400 transition-colors hover:text-cyan-glow">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
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
