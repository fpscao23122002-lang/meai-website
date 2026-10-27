import { motion } from "framer-motion";
import { Building2, Check, Crown, Rocket } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { plans } from "@/lib/data";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/cn";

const icons = { month: Rocket, year: Crown, lifetime: Building2 } as const;

export function Pricing() {
  return (
    <section id="bang-gia" className="relative py-24">
      <div className="container">
        <SectionHeading
          eyebrow="Bảng giá"
          title={
            <>
              Đầu tư một lần, <span className="text-gradient">x10 sản lượng content</span>
            </>
          }
          description="Rẻ hơn lương một bạn edit part-time, nhưng chạy 24/7 không nghỉ phép. Tất cả gói đều dùng đủ 3 engine AI và nhận License tự động qua email."
        />

        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => {
            const Icon = icons[plan.id as keyof typeof icons] ?? Rocket;
            const href = plan.id === "lifetime" ? siteConfig.contact.zalo : `/dashboard?plan=${plan.id}`;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "relative flex flex-col rounded-3xl p-7 sm:p-8",
                  plan.highlight
                    ? "border-[1.5px] border-transparent shadow-glow [background:linear-gradient(180deg,#191936,#121224)_padding-box,linear-gradient(135deg,#00F0FF,#FC3199)_border-box] lg:-my-4 lg:py-12"
                    : "glow-border bg-panel shadow-panel",
                )}
              >
                {plan.badge ? (
                  <span
                    className={cn(
                      "absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold",
                      plan.highlight ? "bg-brand-gradient text-white shadow-glow" : "border border-neon-pink/40 bg-ink text-pink-300",
                    )}
                  >
                    {plan.badge}
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
                    {plan.price}
                  </span>
                  <span className="pb-1 text-sm font-semibold text-slate-300">đ</span>
                  <span className="pb-1 text-sm text-slate-500">{plan.unit}</span>
                </div>

                <ButtonLink
                  href={href}
                  external={plan.id === "lifetime"}
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

        <p className="mt-12 text-center text-sm text-slate-500">
          Giá đã bao gồm VAT. Thanh toán chuyển khoản / VietQR / MoMo — License gửi tự động qua email trong 1 phút. Cần mua số
          lượng lớn cho team?{" "}
          <a href={siteConfig.contact.zalo} target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-glow hover:underline">
            Nhắn Zalo để nhận báo giá riêng
          </a>
          .
        </p>
      </div>
    </section>
  );
}
