import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle2, Cpu, HardDrive, MonitorDown, ShieldCheck, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/layout/PageHero";
import { Callout, DocTable, Steps } from "@/components/docs/DocBlocks";
import { ButtonLink } from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";
import { WindowsIcon } from "@/components/ui/WindowsIcon";
import { GoogleLogo } from "@/components/dashboard/GoogleSignIn";
import { trackSpotlight } from "@/components/fx/spotlight";
import { usePageMeta } from "@/hooks/usePageMeta";
import { changelog } from "@/lib/data";
import { siteConfig } from "@/lib/site";

const ease = [0.22, 1, 0.36, 1] as const;

const facts = [
  { Icon: Sparkles, label: "Phiên bản", value: `v${siteConfig.latestVersion}` },
  { Icon: HardDrive, label: "Dung lượng", value: siteConfig.installerSize },
  { Icon: Cpu, label: "Nền tảng", value: "Windows 10 / 11 · 64-bit" },
  { Icon: ShieldCheck, label: "Đăng nhập", value: "Tài khoản Google" },
];

export default function DownloadPage() {
  usePageMeta({
    title: "Tải MeAI Studio cho Windows",
    description: `Tải MeAI Studio v${siteConfig.latestVersion} cho Windows 10/11: yêu cầu máy, 4 bước chạy lô video đầu tiên và ghi chú bản phát hành.`,
    path: "/tai-ve",
  });
  const latest = changelog[0];

  return (
    <>
      <Navbar />
      <main className="relative pt-16">
        <PageHero
          badge={
            <>
              <MonitorDown className="h-3.5 w-3.5" /> Phát hành {siteConfig.releaseDate}
            </>
          }
          title={["Tải ", { text: "MeAI Studio", className: "text-gradient" }, " cho Windows"]}
          description="Một bộ cài duy nhất. Cài xong, đăng nhập bằng tài khoản Google đã mua gói — app tự nhận gói và hạn dùng của bạn."
        />

        <div className="container space-y-16 pb-16 pt-10">
          {/* Thẻ tải xuống */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            onMouseMove={trackSpotlight}
            className="spotlight glow-border relative overflow-hidden rounded-3xl bg-panel p-6 shadow-panel sm:p-9"
          >
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 animate-aurora-2 rounded-full bg-[radial-gradient(closest-side,rgba(252,49,153,0.18),rgba(252,49,153,0.1)_45%,transparent)]" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                {facts.map(({ Icon, label, value }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.08, ease }}
                  >
                    <p className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-500">
                      <Icon className="h-3.5 w-3.5 text-cyan-glow" /> {label}
                    </p>
                    <p className="mt-1.5 font-semibold text-white">{value}</p>
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <ButtonLink href={siteConfig.downloadUrl} download size="lg">
                  <WindowsIcon className="h-5 w-5" /> Tải bộ cài (.exe)
                </ButtonLink>
                <ButtonLink href="/dashboard" variant="outline" size="lg">
                  <GoogleLogo className="h-4 w-4" /> Khu vực khách hàng
                </ButtonLink>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-12 lg:grid-cols-2">
            <section className="min-w-0">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Máy bạn cần những gì</h2>
              <p className="mt-3 text-slate-400">Xem trước để khỏi mất công tải về rồi mới biết máy chưa đủ điều kiện.</p>
              <DocTable
                head={["Thành phần", "Tối thiểu", "Khuyến nghị"]}
                rows={[
                  ["Hệ điều hành", "Windows 10 64-bit", "Windows 11 64-bit"],
                  ["RAM", "8 GB", "16 GB (chạy nhiều luồng)"],
                  ["CPU", "4 nhân", "Nhiều nhân hơn khi chạy nhiều luồng"],
                  ["Ổ cứng trống", "5 GB", "SSD, 50 GB+ cho thư viện video"],
                  ["Mạng", "Ổn định", "Cáp quang, có thể kèm proxy"],
                ]}
              />
              <Callout type="info">
                Việc tạo ảnh/video chạy trên server của các nền tảng AI, máy bạn chủ yếu điều phối và tải thành phẩm — không cần card đồ
                hoạ mạnh. Tài khoản Muse, Google Flow, Seedance, Dola do bạn tự chuẩn bị; MeAI không bán tài khoản hay lượt tạo video.
              </Callout>
            </section>

            <section className="min-w-0">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">4 bước tới lô video đầu tiên</h2>
              <p className="mt-3 text-slate-400">Làm một lần lúc đầu — những lần sau chỉ còn dán prompt và bấm chạy.</p>
              <Steps
                items={[
                  {
                    title: "Chạy file vừa tải",
                    body: (
                      <>
                        Nếu Windows SmartScreen hiện bảng xanh, bấm <strong className="text-slate-200">More info → Run anyway</strong> — bình
                        thường với phần mềm mới.
                      </>
                    ),
                  },
                  {
                    title: "Đăng nhập với Google",
                    body: <>Chọn đúng Gmail đã mua gói. App tự nhận gói, hạn dùng và số máy — không cần nhập mã kích hoạt.</>,
                  },
                  {
                    title: "Thêm tài khoản AI",
                    body: <>Tab Tài khoản → thêm Muse, Flow, Seedance hoặc Dola; đặt số luồng và gán proxy nếu cần.</>,
                  },
                  {
                    title: "Dán prompt & Tạo & chạy",
                    body: (
                      <>
                        Mỗi prompt cách nhau 1 dòng trống. Chưa biết viết gì? Lấy ngay ở{" "}
                        <Link href="/prompt-mau" className="text-cyan-glow hover:underline">
                          Prompt mẫu
                        </Link>
                        .
                      </>
                    ),
                  },
                ]}
              />
            </section>
          </div>

          <section className="glow-border rounded-3xl bg-panel p-6 shadow-panel sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-white">Có gì trong bản v{latest.version}</h2>
              <span className="rounded-full bg-cyan-brand/15 px-3 py-1 text-xs font-semibold text-cyan-glow">{latest.date}</span>
            </div>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {latest.items.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="flex gap-2.5 text-sm leading-6 text-slate-300"
                >
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-cyan-glow" /> {item}
                </motion.li>
              ))}
            </ul>
            <Link href="/dashboard#changelog" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-cyan-glow hover:underline">
              Xem toàn bộ lịch sử cập nhật <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          <Callout type="warn">
            Một số phần mềm diệt virus có thể chặn nhầm vì MeAI điều khiển trình duyệt tự động. Hãy thêm thư mục cài đặt vào danh sách
            loại trừ (Exclusions) nếu app không khởi động được.
          </Callout>

          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center">
            <ButtonLink href="/docs" variant="outline">
              <BookOpen className="h-4 w-4 text-cyan-glow" /> Hướng dẫn sử dụng
            </ButtonLink>
            <ButtonLink href="/#bang-gia" variant="ghost">
              Xem bảng giá <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
