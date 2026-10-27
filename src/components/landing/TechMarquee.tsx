import { Combine, Film, ImagePlus, ListRestart, Mic, Search, Shuffle, Sparkles, Users, Volume2 } from "lucide-react";
import { Marquee } from "@/components/fx/Marquee";

const platforms = [
  { name: "Muse", dot: "bg-engine-muse" },
  { name: "Google Flow", dot: "bg-engine-flow" },
  { name: "Seedance", dot: "bg-engine-seedance" },
  { name: "Dola", dot: "bg-engine-dola" },
  { name: "Nano Banana 2", dot: "bg-engine-flow" },
  { name: "Omni 1.1 Flash", dot: "bg-engine-flow" },
  { name: "Seedance Pro", dot: "bg-engine-seedance" },
  { name: "Facebook Reels", dot: "bg-neon-pink" },
  { name: "LadiPage", dot: "bg-cyan-glow" },
];

const features = [
  { Icon: Sparkles, t: "Tạo ảnh & video hàng loạt" },
  { Icon: Users, t: "Đa tài khoản · đa luồng" },
  { Icon: ImagePlus, t: "6 ảnh tham chiếu" },
  { Icon: Shuffle, t: "Ảnh luân phiên" },
  { Icon: ListRestart, t: "Chạy lại lỗi một chạm" },
  { Icon: Combine, t: "Ghép video" },
  { Icon: Mic, t: "Giọng đọc AI" },
  { Icon: Search, t: "LadiPage → kịch bản" },
  { Icon: Volume2, t: "Đăng FB Reels" },
  { Icon: Film, t: "Xuất tới 4K" },
];

export function TechMarquee() {
  return (
    <section aria-label="Nền tảng & tính năng" className="relative space-y-4 border-y border-white/[0.06] bg-ink/40 py-8 backdrop-blur-sm">
      <Marquee duration={45}>
        {platforms.map((p) => (
          <span
            key={p.name}
            className="flex items-center gap-2.5 whitespace-nowrap rounded-full border border-white/10 bg-panel/80 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-glow/50 hover:text-white"
          >
            <span className={`h-2 w-2 rounded-full shadow-[0_0_10px_currentColor] ${p.dot}`} />
            {p.name}
          </span>
        ))}
      </Marquee>
      <Marquee reverse duration={55}>
        {features.map(({ Icon, t }) => (
          <span key={t} className="flex items-center gap-2 whitespace-nowrap px-3 text-base font-medium text-slate-500 transition hover:text-white">
            <Icon className="h-4 w-4 text-neon-pink" />
            {t}
            <span className="ml-4 text-cyan-glow/40">✦</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
