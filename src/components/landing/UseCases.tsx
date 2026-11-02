import { motion } from "framer-motion";
import { CheckCircle2, Clapperboard, Gift, ShoppingBag } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ShowcaseVideo } from "@/components/fx/ShowcaseVideo";
import { trackSpotlight } from "@/components/fx/spotlight";
import { cn } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;

type Clip = { src: string; poster: string; label: string };
type UseCase = {
  Icon: typeof ShoppingBag;
  tag: string;
  title: string;
  desc: string;
  points: string[];
  fits: string[];
  clips: [Clip, Clip];
};

const v = (name: string, label: string): Clip => ({ src: `/videos/${name}.mp4`, poster: `/videos/${name}.webp`, label });

/** Mỗi mục đi kèm 2 video thành phẩm 9:16 — nội dung mô tả bám đúng những gì video thể hiện */
const cases: UseCase[] = [
  {
    Icon: ShoppingBag,
    tag: "UGC · Review · Thời trang",
    title: "Người mẫu AI review & mặc thử sản phẩm",
    desc: "Cô gái váy đỏ cầm chai nước hoa giới thiệu như đang livestream trong cửa hàng; người mẫu tóc bạch kim diện váy satin đen tạo dáng trước quán cà phê phố cổ. Kiểu video bán hàng trước đây phải thuê KOC, studio và chờ mẫu về — giờ chỉ cần mô tả nhân vật, sản phẩm và bối cảnh.",
    points: [
      "Nhân vật nói chuyện, cầm sản phẩm hướng về camera như video KOC thật",
      "Mặc thử trang phục giữa bối cảnh đời thực: phố cổ, quán cà phê, cửa hàng",
      "Giữ cùng một gương mặt cho cả loạt video bằng Tư liệu & Người mẫu cố định",
    ],
    fits: ["TikTok Shop", "Shopee Video", "Facebook Ads", "Reels"],
    clips: [v("ugc-nuoc-hoa", "Review nước hoa"), v("ugc-thoi-trang", "Lookbook dạo phố")],
  },
  {
    Icon: Clapperboard,
    tag: "Phim AI · Xây kênh",
    title: "Phim AI ngắn: từ cảm xúc đến hành động",
    desc: "Một người đàn ông lặng nhìn tấm ảnh cũ sau ô kính vỡ giữa thành phố đêm, rồi chuyển cảnh về ký ức cô gái cười giữa cánh đồng hoa. Hai kiếm sĩ giao đấu dưới mưa hoa anh đào, tia lửa toé ra mỗi lần kiếm chạm nhau. Viết kịch bản theo phân cảnh — MeAI dựng từng cảnh rồi ghép thành tập phim.",
    points: [
      "Hồi tưởng, chuyển cảnh, góc máy điện ảnh chỉ bằng mô tả trong prompt",
      "Cảnh hành động nhiều chuyển động: kiếm, tia lửa, cánh hoa bay vẫn mượt",
      "Kịch bản phân cảnh → giọng đọc, nhạc nền, ghép thành một tập hoàn chỉnh",
    ],
    fits: ["YouTube", "TikTok", "Facebook Reels"],
    clips: [v("phim-hoi-uc", "Phim cảm xúc · ký ức"), v("phim-kiem-dao", "Phim hành động · kiếm sĩ")],
  },
  {
    Icon: Gift,
    tag: "Mùa lễ hội · Affiliate",
    title: "Quảng cáo mùa lễ hội & video viral",
    desc: "Cây thông, đèn bông tuyết, người tuyết LED lần lượt bừng sáng — đúng kiểu video bán đồ trang trí Noel trên sàn TMĐT. Bên cạnh là chú Samoyed khoác áo ông già Noel làm cả nhà bật cười: nội dung giải trí kéo tương tác cho Fanpage mùa cao điểm.",
    points: [
      "Trình diễn sản phẩm phát sáng, đổi màu qua từng cảnh để giữ chân người xem",
      "Tình huống ấm áp, hài hước với gia đình & thú cưng — dễ lan toả trên Reels",
      "Đổ cả danh sách sản phẩm mùa lễ vào hàng đợi, nhiều tài khoản chạy song song",
    ],
    fits: ["TikTok Shop", "Shopee", "Facebook Reels", "Affiliate"],
    clips: [v("mua-le-den-noel", "Đèn trang trí Noel"), v("mua-le-gia-dinh", "Samoyed đón Noel cùng gia đình")],
  },
];

export function UseCases() {
  return (
    <section id="ung-dung" className="relative scroll-mt-20 py-24">
      <div className="container">
        <SectionHeading
          eyebrow="Ứng dụng"
          tone="pink"
          title={["Một xưởng video ", { text: "cho mọi kiểu kiếm tiền", className: "text-gradient" }]}
          description="Video thành phẩm 9:16 thật — bấm biểu tượng loa để nghe tiếng. Bạn lo ý tưởng và chốt đơn, phần sản xuất hàng chục, hàng trăm video mỗi ngày để MeAI chạy."
        />

        <div className="mt-16 space-y-8">
          {cases.map((c, i) => (
            <motion.article
              key={c.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease }}
              onMouseMove={trackSpotlight}
              className="spotlight glow-border grid items-center gap-8 overflow-hidden rounded-3xl bg-panel p-5 shadow-panel sm:p-8 lg:grid-cols-2 lg:gap-12"
            >
              <div
                className={cn(
                  "relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-brand/10 via-ink to-neon-pink/10 px-4 pb-12 pt-10 sm:px-8 sm:pb-14",
                  i % 2 === 1 && "lg:order-2",
                )}
              >
                <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2 py-0.5 font-mono text-[10px] font-bold text-white ring-1 ring-white/10">
                  0{i + 1}
                </span>
                <div className="mx-auto grid max-w-md grid-cols-2 items-end gap-3 sm:gap-5">
                  {c.clips.map((clip, k) => (
                    <motion.div
                      key={clip.src}
                      initial={{ opacity: 0, y: 40, rotate: k === 0 ? -4 : 4 }}
                      whileInView={{ opacity: 1, y: k === 0 ? 0 : 28, rotate: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.8, delay: 0.15 + k * 0.15, ease }}
                    >
                      <ShowcaseVideo {...clip} className={k === 0 ? "shadow-glow" : undefined} />
                    </motion.div>
                  ))}
                </div>
              </div>
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-glow">
                  <c.Icon className="h-3.5 w-3.5" />
                  {c.tag}
                </p>
                <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{c.title}</h3>
                <p className="mt-4 leading-7 text-slate-400">{c.desc}</p>
                <ul className="mt-5 space-y-2.5">
                  {c.points.map((p, k) => (
                    <motion.li
                      key={p}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + k * 0.08 }}
                      className="flex gap-2.5 text-sm text-slate-300"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-glow" />
                      {p}
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Phù hợp</span>
                  {c.fits.map((f) => (
                    <span key={f} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-300">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
