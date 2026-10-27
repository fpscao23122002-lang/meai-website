import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "@/components/ui/Link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  Check,
  Copy,
  Crown,
  Info,
  Laptop,
  LoaderCircle,
  Lock,
  LogOut,
  MonitorDown,
  PartyPopper,
  QrCode,
  Receipt,
  ShieldCheck,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import { buttonClass } from "@/components/ui/buttonClass";
import { WindowsIcon } from "@/components/ui/WindowsIcon";
import { TelegramIcon } from "@/components/ui/TelegramIcon";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/cn";
import { SplitText } from "@/components/fx/SplitText";
import { CountUp } from "@/components/fx/CountUp";
import { trackSpotlight } from "@/components/fx/spotlight";
import { GoogleLogo, GoogleSignIn } from "@/components/dashboard/GoogleSignIn";
import { useAccount, type AccountState } from "@/hooks/useAccount";
import type { Account, OrderView, PlanView } from "@/lib/account";
import { PLAN_RULES, formatVnd, isPlanId, type PlanId } from "../../../shared/plans";

const ease = [0.22, 1, 0.36, 1] as const;
const DAY = 86_400_000;

const formatDate = (ms: number) => new Date(ms).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
const formatDateTime = (ms: number) =>
  new Date(ms).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" });

/**
 * Khu vực khách hàng — đăng nhập DUY NHẤT bằng tài khoản Google.
 * Tài khoản Google giữ toàn bộ dữ liệu: gói cước, hạn dùng, máy tính, đơn hàng. App desktop đăng nhập cùng Gmail
 * và đọc đúng gói qua API (xem docs/TAI-KHOAN.md).
 */
export function DashboardApp() {
  const acc = useAccount();
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);

  useEffect(() => {
    const plan = new URLSearchParams(window.location.search).get("plan");
    if (isPlanId(plan)) setSelectedPlan(plan);
  }, []);

  if (!acc.ready) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <LoaderCircle className="h-6 w-6 animate-spin text-cyan-glow" />
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {acc.error ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            role="alert"
            className="mx-auto mb-6 flex max-w-3xl items-center gap-3 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200"
          >
            <TriangleAlert className="h-4 w-4 shrink-0" />
            <span className="flex-1">{acc.error}</span>
            <button type="button" onClick={acc.clearError} aria-label="Đóng" className="rounded-lg p-1 hover:bg-white/10">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {acc.account ? (
          <motion.div key="app" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <AccountView acc={acc} account={acc.account} selectedPlan={selectedPlan} onSelectPlan={setSelectedPlan} />
          </motion.div>
        ) : (
          <motion.div key="login" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <LoginView acc={acc} selectedPlan={selectedPlan} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Đăng nhập                                                           */
/* ------------------------------------------------------------------ */

export function GoogleLoginCard({ acc, title = "Đăng nhập", subtitle }: { acc: AccountState; title?: string; subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 12 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, ease }}
      style={{ transformPerspective: 1200 }}
      className="glow-border relative overflow-hidden rounded-3xl bg-panel p-7 shadow-panel sm:p-9"
    >
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
        <span className="block h-px w-1/3 animate-shine bg-gradient-to-r from-transparent via-cyan-glow to-transparent" />
      </span>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient-soft ring-1 ring-cyan-brand/30">
          <Lock className="h-5 w-5 text-cyan-glow" />
        </span>
        <div>
          <p className="text-lg font-bold text-white">{title}</p>
          <p className="text-xs text-slate-500">{subtitle ?? "Chỉ dùng tài khoản Google — không cần mật khẩu riêng"}</p>
        </div>
      </div>

      <div className="mt-8">
        <GoogleSignIn
          clientId={acc.mode === "live" ? acc.config?.googleClientId ?? null : null}
          onCredential={(c) => void acc.loginWithGoogle(c)}
          onDemo={() => void acc.loginDemo()}
          busy={acc.busy}
        />
      </div>

      <ul className="mt-7 space-y-2.5 text-[13px] text-slate-400">
        {[
          "Tài khoản tự tạo ở lần đăng nhập đầu tiên",
          "Đăng nhập app MeAI bằng đúng Gmail này — app tự nhận gói & hạn dùng",
          "MeAI chỉ nhận tên, email và ảnh đại diện từ Google",
        ].map((t) => (
          <li key={t} className="flex gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-glow" />
            {t}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-5 text-xs text-slate-500">
        <span>Gặp sự cố đăng nhập?</span>
        <a href={siteConfig.contact.telegram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-cyan-glow hover:underline">
          <TelegramIcon className="h-3.5 w-3.5" /> Nhắn Telegram {siteConfig.contact.telegramHandle}
        </a>
      </div>
      {acc.mode === "demo" ? (
        <p className="mt-4 rounded-lg bg-white/[0.03] px-3 py-2 text-[11px] leading-5 text-slate-500">
          Bản xem thử: dữ liệu tài khoản được mô phỏng và chỉ lưu trên trình duyệt này.
        </p>
      ) : null}
    </motion.div>
  );
}

function LoginView({ acc, selectedPlan }: { acc: AccountState; selectedPlan: PlanId | null }) {
  return (
    <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          <SplitText inView={false} parts={["Khu vực ", { text: "Khách hàng", className: "text-gradient" }]} />
        </h1>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-4 text-slate-400">
          Một tài khoản Google dùng chung cho website và app MeAI Desktop: mua gói ở đâu cũng được, app tự nhận đúng gói và hạn dùng
          của bạn.
        </motion.p>
        <ul className="mt-8 space-y-3 text-sm text-slate-300">
          {[
            "Chọn & thanh toán gói ngay trên web hoặc trong app",
            "Xem gói đang dùng, hạn dùng và lịch sử đơn hàng",
            "Quản lý máy tính đang dùng — tự gỡ máy cũ khi đổi máy",
            "Tải bộ cài mới nhất & xem lịch sử cập nhật",
          ].map((t, i) => (
            <motion.li
              key={t}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1, ease }}
              className="flex items-center gap-3"
            >
              <motion.span
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.55 + i * 0.1, type: "spring", stiffness: 400, damping: 15 }}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-brand/15"
              >
                <Check className="h-3 w-3 text-cyan-glow" strokeWidth={3} />
              </motion.span>
              {t}
            </motion.li>
          ))}
        </ul>
        {selectedPlan ? (
          <p className="mt-8 rounded-xl border border-neon-pink/30 bg-neon-pink/10 px-4 py-3 text-sm text-pink-200">
            Bạn đang chọn <strong className="text-white">{PLAN_RULES[selectedPlan].name}</strong>. Đăng nhập bằng Google để tiếp tục
            thanh toán.
          </p>
        ) : null}
      </div>
      <GoogleLoginCard acc={acc} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tài khoản                                                           */
/* ------------------------------------------------------------------ */

function Avatar({ user }: { user: Account["user"] }) {
  const [broken, setBroken] = useState(false);
  const initial = (user.name || user.email).trim().charAt(0).toUpperCase();
  return (
    <span className="relative inline-flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-brand-gradient text-xl font-bold text-white ring-2 ring-white/10">
      {user.picture && !broken ? (
        <img src={user.picture} alt="" referrerPolicy="no-referrer" onError={() => setBroken(true)} className="h-full w-full object-cover" />
      ) : (
        initial
      )}
      <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-2 ring-ink">
        <GoogleLogo className="h-3 w-3" />
      </span>
    </span>
  );
}

function AccountView({
  acc,
  account,
  selectedPlan,
  onSelectPlan,
}: {
  acc: AccountState;
  account: Account;
  selectedPlan: PlanId | null;
  onSelectPlan: (p: PlanId | null) => void;
}) {
  const { user, plan } = account;
  const checkoutRef = useRef<HTMLDivElement>(null);

  const choose = (p: PlanId) => {
    onSelectPlan(p);
    window.setTimeout(() => checkoutRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
  };

  return (
    <div className="space-y-6">
      {acc.mode === "demo" ? (
        <p className="flex items-center gap-2 rounded-xl border border-amber-300/20 bg-amber-300/5 px-4 py-2.5 text-xs text-amber-200/90">
          <Info className="h-4 w-4 shrink-0" /> Bản xem thử — dữ liệu mô phỏng, chưa kết nối tài khoản Google thật.
        </p>
      ) : null}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="flex items-center gap-4">
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16 }}>
            <Avatar user={user} />
          </motion.div>
          <div className="min-w-0">
            <p className="text-sm text-slate-500">
              Xin chào{" "}
              <motion.span
                className="inline-block origin-[70%_70%]"
                animate={{ rotate: [0, 18, -8, 18, 0] }}
                transition={{ duration: 1.4, delay: 0.4, repeat: 2, repeatDelay: 2 }}
              >
                👋
              </motion.span>
            </p>
            <h1 className="truncate text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <SplitText inView={false} parts={[user.name || user.email.split("@")[0]]} />
            </h1>
            <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-slate-500">
              <BadgeCheck className="h-4 w-4 shrink-0 text-cyan-glow" /> {user.email}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <a href={siteConfig.contact.telegram} target="_blank" rel="noopener noreferrer" className={buttonClass("ghost", "sm")}>
            <TelegramIcon className="h-4 w-4" /> Hỗ trợ
          </a>
          <button type="button" onClick={() => void acc.logout()} className={buttonClass("ghost", "sm")}>
            <LogOut className="h-4 w-4" /> Đăng xuất
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease }} className="lg:col-span-2">
          <PlanCard plan={plan} onChoose={choose} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.22, ease }}>
          <DownloadCard />
        </motion.div>
      </div>

      <div ref={checkoutRef} className="scroll-mt-28">
        <AnimatePresence mode="wait">
          {selectedPlan ? (
            <Checkout key="checkout" acc={acc} account={account} planId={selectedPlan} onPlan={onSelectPlan} onClose={() => onSelectPlan(null)} />
          ) : !plan?.active ? (
            <motion.div key="picker" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <PlanPicker onChoose={choose} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.34, ease }}>
          <DevicesCard acc={acc} account={account} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.42, ease }}>
          <AppLinkCard email={user.email} />
        </motion.div>
      </div>

      {account.orders.length ? (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5, ease }}>
          <OrdersCard orders={account.orders} />
        </motion.div>
      ) : null}
    </div>
  );
}

function PlanCard({ plan, onChoose }: { plan: PlanView | null; onChoose: (p: PlanId) => void }) {
  if (!plan) {
    return (
      <div className="glow-border relative flex h-full flex-col justify-center overflow-hidden rounded-3xl bg-panel p-7 shadow-panel">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] ring-1 ring-white/10">
            <Crown className="h-6 w-6 text-slate-500" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">Gói hiện tại</p>
            <p className="text-xl font-bold text-white">Chưa có gói</p>
          </div>
        </div>
        <p className="mt-5 text-sm leading-6 text-slate-400">
          Chọn một gói bên dưới để mở khoá toàn bộ MeAI Studio. Gói gắn vào tài khoản Google này — đăng nhập app là dùng được ngay.
        </p>
        <button type="button" onClick={() => onChoose("year")} className={buttonClass("primary", "md", "mt-6 self-start")}>
          Chọn gói ngay <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const left = plan.daysLeft;
  const pct = left === null ? 100 : Math.min(100, (left / (plan.periodDays ?? 1)) * 100);
  const expired = !plan.active;
  const warn = !expired && left !== null && left <= 14;

  return (
    <div onMouseMove={trackSpotlight} className="spotlight glow-border relative h-full overflow-hidden rounded-3xl bg-panel p-7 shadow-panel">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 animate-aurora-2 rounded-full bg-[radial-gradient(closest-side,rgba(252,49,153,0.15),rgba(252,49,153,0.083)_45%,transparent)]" />
      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <motion.span
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.3 }}
            className={cn("relative flex h-12 w-12 items-center justify-center rounded-2xl", expired ? "bg-white/[0.06]" : "bg-brand-gradient shadow-glow")}
          >
            {!expired ? <span className="absolute inset-0 animate-pulse-soft rounded-2xl bg-white/20" /> : null}
            <Crown className={cn("relative h-6 w-6", expired ? "text-slate-500" : "text-white")} />
          </motion.span>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">Gói hiện tại</p>
            <p className="text-xl font-bold text-white">{plan.name}</p>
          </div>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
            expired ? "bg-rose-400/15 text-rose-300" : warn ? "bg-amber-400/15 text-amber-300" : "bg-emerald-400/15 text-emerald-300",
          )}
        >
          <span className="relative flex h-1.5 w-1.5">
            {!expired ? <span className={cn("absolute inset-0 animate-ping rounded-full", warn ? "bg-amber-300" : "bg-emerald-300")} /> : null}
            <span className={cn("relative h-1.5 w-1.5 rounded-full", expired ? "bg-rose-300" : warn ? "bg-amber-300" : "bg-emerald-300")} />
          </span>
          {expired ? "Đã hết hạn" : warn ? "Sắp hết hạn" : "Đang hoạt động"}
        </span>
      </div>

      <div className="relative mt-8 grid gap-6 sm:grid-cols-3">
        <Stat label="Bắt đầu" value={formatDate(plan.startedAt)} />
        <Stat label="Hết hạn" value={plan.expiresAt ? formatDate(plan.expiresAt) : "Vĩnh viễn"} />
        <Stat label="Số máy" value={`Tối đa ${plan.maxDevices} máy`} />
      </div>

      <div className="relative mt-8">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-slate-400">
            <CalendarClock className="h-4 w-4 text-cyan-glow" /> Thời hạn còn lại
          </span>
          <span className="font-semibold tabular-nums text-white">{left === null ? "∞" : <><CountUp value={String(left)} /> ngày</>}</span>
        </div>
        <div className="relative mt-2 h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: pct / 100 }}
            transition={{ duration: 1.4, delay: 0.3, ease }}
            className="relative h-full origin-left overflow-hidden rounded-full bg-brand-gradient"
          >
            <span className="absolute inset-y-0 left-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </motion.div>
        </div>
      </div>

      {plan.expiresAt !== null ? (
        <div className="relative mt-7 flex flex-wrap gap-3">
          <button type="button" onClick={() => onChoose(plan.id)} className={buttonClass("primary", "md")}>
            {expired ? "Gia hạn để dùng tiếp" : "Gia hạn ngay"}
          </button>
          <button type="button" onClick={() => onChoose("lifetime")} className={buttonClass("outline", "md")}>
            Nâng cấp lên Vĩnh Viễn
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function PlanPicker({ onChoose }: { onChoose: (p: PlanId) => void }) {
  return (
    <div className="glow-border rounded-3xl bg-panel p-7 shadow-panel">
      <h2 className="text-lg font-bold text-white">Chọn gói cho tài khoản của bạn</h2>
      <p className="mt-1 text-sm text-slate-500">Gói được cộng vào tài khoản Google ngay khi thanh toán được xác nhận.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {Object.values(PLAN_RULES).map((r, i) => (
          <motion.button
            key={r.id}
            type="button"
            onClick={() => onChoose(r.id)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, ease }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "rounded-2xl border p-5 text-left transition-colors",
              r.id === "year" ? "border-cyan-glow/40 bg-cyan-brand/10" : "border-white/[0.08] bg-black/20 hover:border-white/20",
            )}
          >
            <p className="text-sm font-semibold text-white">{r.name}</p>
            <p className="mt-2 text-2xl font-extrabold text-white">
              {formatVnd(r.amount)}đ<span className="text-sm font-normal text-slate-500">{r.days ? ` / ${r.days === 30 ? "tháng" : "năm"}` : " / trọn đời"}</span>
            </p>
            <p className="mt-2 text-xs text-slate-400">Dùng trên {r.maxDevices} máy tính</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function DownloadCard() {
  return (
    <div onMouseMove={trackSpotlight} className="spotlight glow-border group flex h-full flex-col rounded-3xl bg-panel p-7 shadow-panel">
      <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-cyan-brand/15 ring-1 ring-cyan-brand/30">
        <span className="fx-bob" style={{ "--bob": "4px", "--bob-d": "1.6s" } as CSSProperties}>
          <MonitorDown className="h-6 w-6 text-cyan-glow" />
        </span>
      </span>
      <p className="mt-5 text-xs uppercase tracking-wider text-slate-500">Bản cập nhật mới nhất</p>
      <p className="mt-1 text-2xl font-bold text-white">v{siteConfig.latestVersion}</p>
      <p className="mt-1 text-sm text-slate-400">
        Phát hành {siteConfig.releaseDate} · {siteConfig.installerSize}
      </p>
      <div className="mt-auto pt-6">
        <a href={siteConfig.downloadUrl} download className={buttonClass("primary", "md", "w-full")}>
          <WindowsIcon className="h-4 w-4" /> Tải cho Windows
        </a>
        <a href="#changelog" className="mt-3 flex items-center justify-center gap-1 text-xs text-slate-400 hover:text-cyan-glow">
          Xem có gì mới <ArrowRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Thanh toán                                                          */
/* ------------------------------------------------------------------ */

function CopyButton({ value, label = "Sao chép" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard bị chặn */
        }
      }}
      aria-label={label}
      className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
    >
      {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

function Checkout({
  acc,
  account,
  planId,
  onPlan,
  onClose,
}: {
  acc: AccountState;
  account: Account;
  planId: PlanId;
  onPlan: (p: PlanId) => void;
  onClose: () => void;
}) {
  const [code, setCode] = useState<string | null>(null);
  const { createOrder, refresh } = acc;

  // Tạo (hoặc dùng lại) đơn chờ thanh toán cho gói đang chọn
  useEffect(() => {
    let alive = true;
    setCode(null);
    void createOrder(planId).then((r) => alive && r && setCode(r.order.code));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId]);

  const order = account.orders.find((o) => o.code === code) ?? null;
  const pending = order?.status === "pending";

  // Bản thật: tự kiểm tra trạng thái đơn mỗi 5 giây cho tới khi ngân hàng/quản trị viên xác nhận
  useEffect(() => {
    if (!pending || acc.mode !== "live") return;
    const id = window.setInterval(() => void refresh(), 5000);
    return () => window.clearInterval(id);
  }, [pending, acc.mode, refresh]);

  const rule = PLAN_RULES[planId];
  const auto = acc.config?.payments.auto;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45, ease }}
      className="relative overflow-hidden rounded-3xl border border-neon-pink/30 bg-gradient-to-br from-neon-pink/10 via-panel to-cyan-brand/10 p-6 sm:p-7"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-pink-300">Thanh toán</p>
          <p className="mt-1 text-xl font-bold text-white">
            {rule.name} — {formatVnd(rule.amount)}đ
          </p>
        </div>
        <button type="button" onClick={onClose} className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white">
          <X className="h-4 w-4" /> Đóng
        </button>
      </div>

      {order?.status === "paid" ? (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16 }} className="mt-6 flex flex-col items-center gap-3 py-6 text-center">
          <motion.span
            initial={{ rotate: -30, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 12, delay: 0.1 }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient shadow-glow"
          >
            <PartyPopper className="h-8 w-8 text-white" />
          </motion.span>
          <p className="text-xl font-bold text-white">Đã kích hoạt {order.planName}!</p>
          <p className="max-w-md text-sm text-slate-400">
            Gói đã gắn vào tài khoản <strong className="text-white">{account.user.email}</strong>. Mở app MeAI (hoặc khởi động lại) để app
            nhận gói mới.
          </p>
          <button type="button" onClick={onClose} className={buttonClass("primary", "md", "mt-2")}>
            Tuyệt vời
          </button>
        </motion.div>
      ) : (
        <>
          {/* Đổi gói nhanh */}
          <div className="mt-5 inline-flex flex-wrap gap-1 rounded-xl bg-black/30 p-1">
            {Object.values(PLAN_RULES).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onPlan(r.id)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  r.id === planId ? "bg-brand-gradient text-white" : "text-slate-400 hover:text-white",
                )}
              >
                {r.name}
              </button>
            ))}
          </div>

          {!order ? (
            <div className="flex items-center gap-2 py-10 text-sm text-slate-400">
              <LoaderCircle className="h-4 w-4 animate-spin" /> Đang tạo đơn…
            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-[auto_1fr]">
              {order.payment ? (
                <div className="mx-auto w-full max-w-[220px] rounded-2xl bg-white p-2.5 shadow-panel md:mx-0">
                  <img src={order.payment.qrUrl} alt={`VietQR thanh toán đơn ${order.code}`} width={220} height={260} className="h-auto w-full rounded-lg" />
                </div>
              ) : (
                <div className="mx-auto flex h-[180px] w-full max-w-[220px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-black/20 p-4 text-center text-xs text-slate-400 md:mx-0">
                  <QrCode className="h-8 w-8 text-cyan-glow" />
                  Nhận mã VietQR qua Telegram {siteConfig.contact.telegramHandle}
                </div>
              )}

              <div className="space-y-3 text-sm">
                <PayRow label="Số tiền" value={`${formatVnd(order.amount)}đ`} copy={String(order.amount)} />
                <PayRow label="Nội dung chuyển khoản" value={order.code} copy={order.code} highlight />
                {order.payment ? (
                  <>
                    <PayRow label="Ngân hàng" value={order.payment.bankId} />
                    <PayRow label="Số tài khoản" value={order.payment.account} copy={order.payment.account} />
                    {order.payment.accountName ? <PayRow label="Chủ tài khoản" value={order.payment.accountName} /> : null}
                  </>
                ) : null}
                <p className="flex gap-2 pt-1 text-xs leading-5 text-slate-400">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-glow" />
                  {order.payment && auto
                    ? "Chuyển đúng nội dung — hệ thống tự kích hoạt gói sau khi nhận tiền (thường 1–2 phút). Trang này tự cập nhật."
                    : "Sau khi chuyển khoản, gửi ảnh xác nhận kèm nội dung đơn qua Telegram — gói được kích hoạt ngay khi team xác nhận. Trang này tự cập nhật."}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a href={siteConfig.contact.telegram} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "md")}>
                    <TelegramIcon className="h-4 w-4" /> {order.payment && auto ? "Cần hỗ trợ thanh toán" : "Gửi xác nhận qua Telegram"}
                  </a>
                  {acc.mode === "demo" ? (
                    <button type="button" onClick={() => void acc.simulatePaid(order.code)} className={buttonClass("outline", "md")}>
                      Giả lập đã thanh toán
                    </button>
                  ) : null}
                  <button type="button" onClick={() => void acc.cancelOrder(order.code).then(onClose)} className="px-3 text-xs text-slate-500 hover:text-rose-300">
                    Huỷ đơn
                  </button>
                </div>
                {pending ? (
                  <p className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inset-0 animate-ping rounded-full bg-amber-300" />
                      <span className="relative h-2 w-2 rounded-full bg-amber-300" />
                    </span>
                    Đang chờ thanh toán…
                  </p>
                ) : null}
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

function PayRow({ label, value, copy, highlight }: { label: string; value: string; copy?: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-black/30 px-4 py-2.5">
      <span className="text-slate-400">{label}</span>
      <span className="flex items-center gap-1">
        <span className={cn("font-mono font-semibold", highlight ? "text-cyan-glow" : "text-white")}>{value}</span>
        {copy ? <CopyButton value={copy} label={`Sao chép ${label.toLowerCase()}`} /> : null}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Thiết bị, app, đơn hàng                                             */
/* ------------------------------------------------------------------ */

function DevicesCard({ acc, account }: { acc: AccountState; account: Account }) {
  const max = account.plan?.active ? account.plan.maxDevices : 0;
  const now = Date.now();
  return (
    <div className="glow-border h-full rounded-3xl bg-panel p-7 shadow-panel">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient-soft ring-1 ring-cyan-brand/30">
          <Laptop className="h-5 w-5 text-cyan-glow" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-white">Máy tính đang dùng</h2>
          <p className="text-xs text-slate-500">
            {account.devices.length}/{max || "—"} máy theo gói hiện tại
          </p>
        </div>
      </div>
      {account.devices.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-white/10 p-4 text-sm text-slate-500">
          Chưa có máy nào. Đăng nhập app MeAI bằng <strong className="text-slate-300">{account.user.email}</strong> — máy sẽ tự hiện ở
          đây.
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-white/[0.05]">
          <AnimatePresence initial={false}>
            {account.devices.map((d, i) => (
              <motion.li
                key={d.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.3 + i * 0.08 } }}
                exit={{ opacity: 0, x: 60, height: 0, paddingTop: 0, paddingBottom: 0 }}
                transition={{ duration: 0.35 }}
                className="flex flex-wrap items-center justify-between gap-3 overflow-hidden py-3"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="relative">
                    <Laptop className="h-4 w-4 text-cyan-brand" />
                    {now - d.lastSeen < 10 * 60_000 ? <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> : null}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-slate-200">{d.name || "Máy tính"}</span>
                    <span className="block truncate font-mono text-[11px] text-slate-500">
                      {d.id} · {now - d.lastSeen < DAY ? "hoạt động hôm nay" : `hoạt động ${formatDate(d.lastSeen)}`}
                    </span>
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => void acc.removeDevice(d.id)}
                  disabled={acc.busy}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-rose-400/20 px-3 py-1.5 text-xs font-medium text-rose-300 transition hover:bg-rose-400/10 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Gỡ máy
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
      <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <Info className="h-3.5 w-3.5 shrink-0" /> Gỡ máy sẽ đăng xuất MeAI trên máy đó ngay ở lần kiểm tra kế tiếp.
      </p>
    </div>
  );
}

function AppLinkCard({ email }: { email: string }) {
  const steps = [
    <>Tải & cài MeAI Desktop bản mới nhất.</>,
    <>
      Mở app, bấm <strong className="text-white">Đăng nhập với Google</strong>.
    </>,
    <>
      Chọn đúng <strong className="text-white">{email}</strong> — app tự nhận gói, hạn dùng và giới hạn máy.
    </>,
  ];
  return (
    <div className="glow-border h-full rounded-3xl bg-panel p-7 shadow-panel">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient-soft ring-1 ring-cyan-brand/30">
          <GoogleLogo className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-white">Dùng trên app desktop</h2>
          <p className="text-xs text-slate-500">Một tài khoản Google cho cả web & app</p>
        </div>
      </div>
      <ol className="mt-6 space-y-4">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3 text-sm text-slate-400">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-brand/15 font-mono text-xs text-cyan-glow">{i + 1}</span>
            <span className="pt-0.5">{s}</span>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-xs leading-5 text-slate-500">
        Mua gói trong app hay trên web đều cộng vào cùng tài khoản. Cần hỗ trợ?{" "}
        <Link href={siteConfig.contact.telegram} className="font-semibold text-cyan-glow hover:underline">
          Telegram {siteConfig.contact.telegramHandle}
        </Link>
      </p>
    </div>
  );
}

const statusStyle: Record<OrderView["status"], { cls: string; text: string }> = {
  pending: { cls: "bg-amber-400/15 text-amber-300", text: "Chờ thanh toán" },
  paid: { cls: "bg-emerald-400/15 text-emerald-300", text: "Đã thanh toán" },
  cancelled: { cls: "bg-white/[0.06] text-slate-500", text: "Đã huỷ" },
};

function OrdersCard({ orders }: { orders: OrderView[] }) {
  return (
    <div className="glow-border rounded-3xl bg-panel p-7 shadow-panel">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient-soft ring-1 ring-cyan-brand/30">
          <Receipt className="h-5 w-5 text-cyan-glow" />
        </span>
        <h2 className="text-lg font-bold text-white">Lịch sử đơn hàng</h2>
      </div>
      <ul className="mt-5 divide-y divide-white/[0.05]">
        {orders.map((o) => (
          <li key={o.code} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
            <span className="min-w-0">
              <span className="block font-medium text-slate-200">
                {o.planName} · {o.amount ? `${formatVnd(o.amount)}đ` : "Tặng / kích hoạt thủ công"}
              </span>
              <span className="block font-mono text-[11px] text-slate-500">
                {o.code} · {formatDateTime(o.createdAt)} · {o.source === "app" ? "mua trong app" : o.source === "admin" ? "quản trị viên" : "mua trên web"}
              </span>
            </span>
            <span className={cn("rounded-md px-2 py-1 text-xs font-semibold", statusStyle[o.status].cls)}>{statusStyle[o.status].text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
