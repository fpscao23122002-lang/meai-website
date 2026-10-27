import { motion } from "framer-motion";
import { Building2, Check, CircleSlash, Crown, Minus, Rocket, Timer, Wallet } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { plans } from "@/lib/data";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/cn";
import { trackSpotlight } from "@/components/fx/spotlight";
import { CountMoney } from "@/components/fx/CountUp";
import { PLAN_RULES } from "../../../shared/plans";

const icons = { month: Rocket, year: Crown, lifetime: Building2 } as const;

const promises = [
  { Icon: Wallet, title: "Không thu phí mỗi video", desc: "Lượt tạo trừ vào tài khoản AI của chính bạn — MeAI không thu thêm đồng nào." },
  { Icon: CircleSlash, title: "Không bán credit", desc: "Làm 10 hay 1.000 video mỗi tháng, phí phần mềm vẫn vậy." },
  { Icon: Timer, title: "Không tự trừ tiền", desc: "Không gia hạn ngầm. Gia hạn sớm được cộng nối tiếp, không mất ngày." },
];

type Cell = string | boolean;
const R = PLAN_RULES;
const compareRows: { label: string; cells: [Cell, Cell, Cell] }[] = [
  { label: "Studio, Tư liệu, Kịch bản, Thư viện", cells: [true, true, true] },
  { label: "Muse · Google Flow · Seedance", cells: [true, true, true] },
  { label: "Tài khoản AI & luồng chạy", cells: ["Không giới hạn", "Không giới hạn", "Không giới hạn"] },
  { label: "LadiPage → kịch bản, Đăng FB Reels", cells: [true, true, true] },
  { label: "Số máy tính dùng cùng lúc", cells: [`${R.month.maxDevices} máy`, `${R.year.maxDevices} máy`, `${R.lifetime.maxDevices} máy`] },
  { label: "Thời hạn", cells: [`${R.month.days} ngày`, `${R.year.days} ngày`, "Trọn đời"] },
  { label: "Cập nhật engine & model mới", cells: ["Trong thời hạn gói", "12 tháng", "Trọn đời"] },
  { label: "Hỗ trợ", cells: ["Cộng đồng", "1-1 qua Telegram", "Ưu tiên 7 ngày/tuần"] },
  { label: "Hướng dẫn setup tài khoản, proxy, token Fanpage", cells: [false, true, true] },
  { label: "Setup & training 1-1 cho team", cells: [false, false, true] },
  { label: "Dùng sớm tính năng mới (Early Access)", cells: [false, false, true] },
  { label: "Xuất hoá đơn VAT", cells: [false, true, true] },
];

/** Bảng so sánh chi tiết các gói */
function PlanCompare() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glow-border mt-20 overflow-hidden rounded-3xl bg-panel shadow-panel"
    >
      <div className="px-6 pt-6 sm:px-8">
        <h3 className="text-xl font-bold text-white">So sánh chi tiết các gói</h3>
        <p className="mt-1 text-sm text-slate-500">Mọi gói đều đủ tính năng sản xuất — khác nhau ở số máy, thời hạn và mức hỗ trợ.</p>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-y border-white/[0.06] bg-white/[0.02] text-left">
              <th className="px-6 py-3 font-medium text-slate-400 sm:px-8">Tính năng</th>
              {plans.map((p) => (
                <th key={p.id} className={cn("px-4 py-3 text-center font-semibold", p.highlight ? "text-cyan-glow" : "text-white")}>
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compareRows.map((row) => (
              <tr key={row.label} className="border-b border-white/[0.04] transition-colors last:border-0 hover:bg-white/[0.02]">
                <td className="px-6 py-3 text-slate-300 sm:px-8">{row.label}</td>
                {row.cells.map((c, i) => (
                  <td key={i} className={cn("px-4 py-3 text-center", plans[i]?.highlight && "bg-cyan-brand/[0.04]")}>
                    {c === true ? (
                      <Check className="mx-auto h-4 w-4 text-cyan-glow" strokeWidth={3} aria-label="Có" />
                    ) : c === false ? (
                      <Minus className="mx-auto h-4 w-4 text-slate-600" aria-label="Không" />
                    ) : (
                      <span className="text-slate-200">{c}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export function Pricing() {
  return (
    <section id="bang-gia" className="relative py-24">
      <div className="container">
        <SectionHeading
          eyebrow="Bảng giá"
          title={["Phí cố định cho phần mềm, ", { text: "video làm bao nhiêu tuỳ bạn", className: "text-gradient" }]}
          description="Rẻ hơn lương một bạn edit part-time, nhưng chạy 24/7 không nghỉ phép. Tất cả gói đều dùng đủ 3 engine AI, gắn thẳng vào tài khoản Google của bạn — đăng nhập app là dùng."
        />

        <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-3">
          {promises.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex gap-3 rounded-2xl border border-white/[0.07] bg-panel/70 p-4"
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-cyan-glow" />
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => {
            const Icon = icons[plan.id as keyof typeof icons] ?? Rocket;
            const href = `/dashboard?plan=${plan.id}`;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                onMouseMove={trackSpotlight}
                className={cn(
                  "spotlight relative flex flex-col rounded-3xl p-7 sm:p-8",
                  plan.highlight ? "isolate shadow-glow lg:-my-4 lg:py-12" : "glow-border bg-panel shadow-panel",
                )}
              >
                {plan.highlight ? <div aria-hidden className="border-spin absolute inset-0 -z-10 rounded-3xl" /> : null}
                {plan.badge ? (
                  <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                    <span
                      className={cn(
                        "block animate-float whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold",
                        plan.highlight ? "bg-brand-gradient text-white shadow-glow" : "border border-neon-pink/40 bg-ink text-pink-300",
                      )}
                    >
                      {plan.badge}
                    </span>
                  </span>
                ) : null}

                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient-soft ring-1 ring-cyan-brand/30">
                    <Icon className="h-5 w-5 text-cyan-glow" />
                  </span>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                </div>
                <p className="mt-4 min-h-[48px] text-sm leading-6 text-slate-400">{plan.note}</p>

                <div className="mt-6 flex items-end gap-1.5">
                  <span className={cn("text-4xl font-extrabold tracking-tight", plan.highlight ? "text-gradient" : "text-white")}>
                    <CountMoney value={plan.price} />
                  </span>
                  <span className="pb-1 text-sm font-semibold text-slate-300">đ</span>
                  <span className="pb-1 text-sm text-slate-500">{plan.unit}</span>
                </div>

                <ButtonLink
                  href={href}
                  variant={plan.highlight ? "primary" : "outline"}
                  size="lg"
                  className="mt-7 w-full"
                >
                  {plan.cta}
                </ButtonLink>

                <ul className="mt-8 space-y-3.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
                      <span
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                          plan.highlight ? "bg-brand-gradient" : "bg-cyan-brand/15",
                        )}
                      >
                        <Check className={cn("h-3 w-3", plan.highlight ? "text-white" : "text-cyan-glow")} strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <PlanCompare />

        <p className="mt-10 text-center text-sm text-slate-500">
          Giá đã bao gồm VAT. Thanh toán chuyển khoản / VietQR — gói tự kích hoạt vào tài khoản Google ngay khi xác nhận. Cần mua số
          lượng lớn cho team?{" "}
          <a href={siteConfig.contact.telegram} target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-glow hover:underline">
            Nhắn Telegram để nhận báo giá riêng
          </a>
          .
        </p>
      </div>
    </section>
  );
}
