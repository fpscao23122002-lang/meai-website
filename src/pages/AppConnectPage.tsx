import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, LoaderCircle, MonitorSmartphone, ShieldCheck, TriangleAlert } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useAccount } from "@/hooks/useAccount";
import { GoogleLoginCard } from "@/components/dashboard/DashboardApp";
import { buttonClass } from "@/components/ui/buttonClass";
import { TelegramIcon } from "@/components/ui/TelegramIcon";
import { siteConfig } from "@/lib/site";

/**
 * Trang app desktop mở trong trình duyệt để đăng nhập bằng Google:
 *   https://<site>/app/connect?port=<cổng loopback của app>&state=<chuỗi ngẫu nhiên>
 * Sau khi người dùng bấm Cho phép, trình duyệt chuyển về http://127.0.0.1:<port>/callback?code=…&state=…
 * App đổi code lấy phiên đăng nhập qua POST /api/app/token (xem docs/TAI-KHOAN.md).
 */
function readParams() {
  const q = new URLSearchParams(window.location.search);
  const port = Number(q.get("port"));
  const state = q.get("state") ?? "";
  const valid = Number.isInteger(port) && port >= 1024 && port <= 65535 && /^[A-Za-z0-9_-]{8,128}$/.test(state);
  return valid ? { port, state } : null;
}

export default function AppConnectPage() {
  usePageMeta({ title: "Kết nối MeAI Desktop", path: "/app/connect", noindex: true });
  const acc = useAccount();
  const params = useMemo(readParams, []);
  const [status, setStatus] = useState<"idle" | "linking" | "done">("idle");

  const allow = async () => {
    if (!params) return;
    setStatus("linking");
    const r = await acc.createAppLink();
    if (!r) return setStatus("idle");
    setStatus("done");
    const qs = new URLSearchParams({ code: r.code, state: params.state });
    window.location.href = `http://127.0.0.1:${params.port}/callback?${qs}`;
  };

  let body: React.ReactNode;
  if (!acc.ready) {
    body = <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-cyan-glow" />;
  } else if (!params) {
    body = (
      <Notice icon={<TriangleAlert className="h-7 w-7 text-amber-300" />} title="Liên kết không hợp lệ">
        Hãy mở trang này bằng nút <strong className="text-white">Đăng nhập với Google</strong> trong app MeAI Desktop.
      </Notice>
    );
  } else if (acc.mode === "demo") {
    body = (
      <Notice icon={<TriangleAlert className="h-7 w-7 text-amber-300" />} title="Chưa bật đăng nhập Google">
        Hệ thống tài khoản đang ở chế độ xem thử nên chưa thể kết nối app. Vui lòng liên hệ{" "}
        <a href={siteConfig.contact.telegram} target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-glow hover:underline">
          Telegram {siteConfig.contact.telegramHandle}
        </a>
        .
      </Notice>
    );
  } else if (!acc.account) {
    body = <GoogleLoginCard acc={acc} title="Đăng nhập để kết nối app" subtitle="Dùng tài khoản Google đã mua gói MeAI" />;
  } else if (status === "done") {
    body = (
      <Notice icon={<CheckCircle2 className="h-7 w-7 text-emerald-400" />} title="Đã kết nối!">
        Quay lại app MeAI — app đã đăng nhập bằng <strong className="text-white">{acc.account.user.email}</strong>. Bạn có thể đóng tab
        này.
      </Notice>
    );
  } else {
    const plan = acc.account.plan;
    body = (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glow-border rounded-3xl bg-panel p-7 text-center shadow-panel sm:p-9"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient shadow-glow">
          <MonitorSmartphone className="h-7 w-7 text-white" />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-white">Cho phép MeAI Desktop đăng nhập?</h1>
        <p className="mt-2 text-sm text-slate-400">
          App trên máy này sẽ dùng tài khoản <strong className="text-white">{acc.account.user.email}</strong>
          {plan?.active ? (
            <>
              {" "}
              với <strong className="text-white">{plan.name}</strong>.
            </>
          ) : (
            <> (chưa có gói — bạn có thể chọn gói ngay trong app).</>
          )}
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button type="button" onClick={() => void allow()} disabled={status === "linking"} className={buttonClass("primary", "lg")}>
            {status === "linking" ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />} Cho phép
          </button>
          <button type="button" onClick={() => void acc.logout()} className={buttonClass("ghost", "lg")}>
            Dùng tài khoản khác
          </button>
        </div>
        {acc.error ? <p className="mt-4 text-sm text-rose-400">{acc.error}</p> : null}
        <p className="mt-6 text-xs text-slate-500">Chỉ bấm Cho phép nếu bạn vừa mở trang này từ app MeAI trên chính máy tính của mình.</p>
      </motion.div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container flex min-h-[78vh] items-center justify-center pb-10 pt-28">
        <div className="w-full max-w-lg">{body}</div>
      </main>
      <Footer />
    </>
  );
}

function Notice({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glow-border rounded-3xl bg-panel p-8 text-center shadow-panel">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05]">{icon}</span>
      <h1 className="mt-5 text-xl font-bold text-white">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-slate-400">{children}</p>
      <a href={siteConfig.contact.telegram} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-glow">
        <TelegramIcon className="h-3.5 w-3.5" /> Cần hỗ trợ? {siteConfig.contact.telegramHandle}
      </a>
    </motion.div>
  );
}
