import { useEffect, useMemo, useState } from "react";
import { Link } from "@/components/ui/Link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  Check,
  Copy,
  Crown,
  Info,
  Eye,
  EyeOff,
  KeyRound,
  Laptop,
  LoaderCircle,
  Lock,
  LogOut,
  Mail,
  MonitorDown,
  Plus,
  ShieldCheck,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { buttonClass } from "@/components/ui/buttonClass";
import { WindowsIcon } from "@/components/ui/WindowsIcon";
import { plans } from "@/lib/data";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/cn";

/**
 * Khu vực khách hàng chạy ở chế độ DEMO: dữ liệu được mô phỏng và lưu trong localStorage của trình duyệt.
 * Khi có backend License thật, thay các hàm trong `api` bên dưới bằng lời gọi API tương ứng.
 */

type Device = { id: string; name: string; lastSeen: string };
type License = {
  key: string;
  planId: string;
  activatedAt: string;
  expiresAt: string | null; // null = vĩnh viễn
  maxDevices: number;
  devices: Device[];
};
type Session = { email: string; name: string; licenses: License[] };

const STORAGE_KEY = "meai-demo-session";
const KEY_PATTERN = /^MEAI-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
const DAY = 86_400_000;

const planMeta: Record<string, { name: string; maxDevices: number; days: number | null }> = {
  month: { name: "Gói Tháng", maxDevices: 1, days: 30 },
  year: { name: "Gói Năm", maxDevices: 2, days: 365 },
  lifetime: { name: "Vĩnh Viễn / Agency", maxDevices: 5, days: null },
};

function randomBlock() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function createDemoSession(email: string): Session {
  const now = Date.now();
  const name = email.split("@")[0] || "Creator";
  return {
    email,
    name,
    licenses: [
      {
        key: `MEAI-${randomBlock()}-${randomBlock()}-${randomBlock()}`,
        planId: "year",
        activatedAt: new Date(now - 247 * DAY).toISOString(),
        expiresAt: new Date(now + 118 * DAY).toISOString(),
        maxDevices: 2,
        devices: [
          { id: "WIN-7F3A-91C2", name: "DESKTOP-STUDIO01", lastSeen: new Date(now - 2 * 3_600_000).toISOString() },
          { id: "WIN-22BD-04E8", name: "LAPTOP-EDIT", lastSeen: new Date(now - 3 * DAY).toISOString() },
        ],
      },
    ],
  };
}

const api = {
  load(): Session | null {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  },
  save(session: Session | null) {
    try {
      if (session) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* Trình duyệt chặn storage: vẫn dùng được trong phiên hiện tại */
    }
  },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

function maskKey(key: string) {
  const parts = key.split("-");
  return parts.map((p, i) => (i === 0 || i === parts.length - 1 ? p : "••••")).join("-");
}

export function DashboardApp() {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    setSession(api.load());
    const plan = new URLSearchParams(window.location.search).get("plan");
    if (plan && planMeta[plan]) setSelectedPlan(plan);
    setReady(true);
  }, []);

  const update = (s: Session | null) => {
    setSession(s);
    api.save(s);
  };

  if (!ready) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <LoaderCircle className="h-6 w-6 animate-spin text-cyan-glow" />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {session ? (
        <motion.div key="app" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <Account session={session} onChange={update} selectedPlan={selectedPlan} onSelectPlan={setSelectedPlan} />
        </motion.div>
      ) : (
        <motion.div key="login" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <LoginCard onLogin={(email) => update(createDemoSession(email))} selectedPlan={selectedPlan} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* Đăng nhập                                                           */
/* ------------------------------------------------------------------ */

function LoginCard({ onLogin, selectedPlan }: { onLogin: (email: string) => void; selectedPlan: string | null }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Email không hợp lệ.");
    if (password.length < 6) return setError("Mật khẩu tối thiểu 6 ký tự.");
    setError(null);
    setLoading(true);
    window.setTimeout(() => onLogin(email.trim().toLowerCase()), 700);
  };

  return (
    <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Khu vực <span className="text-gradient">Khách hàng</span>
        </h1>
        <p className="mt-4 text-slate-400">
          Đăng nhập bằng email đã dùng khi mua License để kiểm tra hạn sử dụng, quản lý mã kích hoạt, gỡ/thêm thiết bị và
          tải bản cập nhật mới nhất.
        </p>
        <ul className="mt-8 space-y-3 text-sm text-slate-300">
          {[
            "Xem hạn dùng & gia hạn gói cước",
            "Quản lý License Key và thiết bị đã kích hoạt",
            "Tự gỡ máy cũ khi đổi máy — không cần chờ admin",
            "Tải bộ cài mới nhất & xem lịch sử cập nhật",
          ].map((t) => (
            <li key={t} className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-brand/15">
                <Check className="h-3 w-3 text-cyan-glow" strokeWidth={3} />
              </span>
              {t}
            </li>
          ))}
        </ul>
        {selectedPlan ? (
          <p className="mt-8 rounded-xl border border-neon-pink/30 bg-neon-pink/10 px-4 py-3 text-sm text-pink-200">
            Bạn đang chọn <strong className="text-white">{planMeta[selectedPlan].name}</strong>. Đăng nhập hoặc tạo tài khoản
            để tiếp tục thanh toán.
          </p>
        ) : null}
      </div>

      <form onSubmit={submit} className="glow-border rounded-3xl bg-panel p-7 shadow-panel sm:p-9" noValidate>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient-soft ring-1 ring-cyan-brand/30">
            <Lock className="h-5 w-5 text-cyan-glow" />
          </span>
          <div>
            <p className="text-lg font-bold text-white">Đăng nhập</p>
            <p className="text-xs text-slate-500">Chưa có tài khoản? Tài khoản tự tạo khi mua gói.</p>
          </div>
        </div>

        <label className="mt-7 block text-sm font-medium text-slate-300" htmlFor="email">
          Email
        </label>
        <div className="relative mt-2">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ban@email.com"
            className="h-12 w-full rounded-xl border border-white/10 bg-black/30 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-brand/60 focus:shadow-glow-sm"
          />
        </div>

        <label className="mt-5 block text-sm font-medium text-slate-300" htmlFor="password">
          Mật khẩu
        </label>
        <div className="relative mt-2">
          <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            id="password"
            type={showPw ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-12 w-full rounded-xl border border-white/10 bg-black/30 pl-10 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-brand/60 focus:shadow-glow-sm"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 hover:text-white"
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {error ? (
          <p className="mt-4 flex items-center gap-2 text-sm text-rose-400">
            <TriangleAlert className="h-4 w-4" /> {error}
          </p>
        ) : null}

        <button type="submit" disabled={loading} className={buttonClass("primary", "lg", "mt-7 w-full")}>
          {loading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <>Đăng nhập <ArrowRight className="h-4 w-4" /></>}
        </button>

        <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
          <a href={siteConfig.contact.zalo} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-glow">
            Quên mật khẩu?
          </a>
          <button
            type="button"
            onClick={() => onLogin("demo@meai.vn")}
            className="font-semibold text-cyan-glow hover:underline"
          >
            Xem nhanh bằng tài khoản demo →
          </button>
        </div>
        <p className="mt-6 rounded-lg bg-white/[0.03] px-3 py-2 text-[11px] leading-5 text-slate-500">
          Bản xem trước: dữ liệu tài khoản được mô phỏng và chỉ lưu trên trình duyệt này.
        </p>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tài khoản                                                           */
/* ------------------------------------------------------------------ */

function Account({
  session,
  onChange,
  selectedPlan,
  onSelectPlan,
}: {
  session: Session;
  onChange: (s: Session | null) => void;
  selectedPlan: string | null;
  onSelectPlan: (p: string | null) => void;
}) {
  const primary = session.licenses[0];

  const setLicenses = (licenses: License[]) => onChange({ ...session, licenses });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-slate-500">Xin chào,</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {session.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{session.email}</p>
        </div>
        <button type="button" onClick={() => onChange(null)} className={buttonClass("ghost", "sm")}>
          <LogOut className="h-4 w-4" /> Đăng xuất
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {primary ? <PlanCard license={primary} onRenew={() => onSelectPlan(primary.planId)} /> : null}
        <DownloadCard />
      </div>

      <AnimatePresence>
        {selectedPlan ? <Checkout planId={selectedPlan} email={session.email} onClose={() => onSelectPlan(null)} /> : null}
      </AnimatePresence>

      <LicenseManager licenses={session.licenses} onChange={setLicenses} />
    </div>
  );
}

function daysLeft(iso: string | null) {
  if (!iso) return null;
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / DAY));
}

function PlanCard({ license, onRenew }: { license: License; onRenew: () => void }) {
  const meta = planMeta[license.planId];
  const left = daysLeft(license.expiresAt);
  const total = meta.days ?? 1;
  const pct = left === null ? 100 : Math.min(100, (left / total) * 100);
  const warn = left !== null && left <= 14;

  return (
    <div className="glow-border relative overflow-hidden rounded-3xl bg-panel p-7 shadow-panel lg:col-span-2">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-neon-pink/15 blur-3xl" />
      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient shadow-glow">
            <Crown className="h-6 w-6 text-white" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">Gói hiện tại</p>
            <p className="text-xl font-bold text-white">{meta.name}</p>
          </div>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
            warn ? "bg-amber-400/15 text-amber-300" : "bg-emerald-400/15 text-emerald-300",
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", warn ? "bg-amber-300" : "bg-emerald-300")} />
          {warn ? "Sắp hết hạn" : "Đang hoạt động"}
        </span>
      </div>

      <div className="relative mt-8 grid gap-6 sm:grid-cols-3">
        <Stat label="Ngày kích hoạt" value={formatDate(license.activatedAt)} />
        <Stat label="Hết hạn" value={license.expiresAt ? formatDate(license.expiresAt) : "Vĩnh viễn"} />
        <Stat label="Thiết bị" value={`${license.devices.length}/${license.maxDevices} máy`} />
      </div>

      <div className="relative mt-8">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-slate-400">
            <CalendarClock className="h-4 w-4 text-cyan-glow" /> Thời hạn còn lại
          </span>
          <span className="font-semibold text-white">{left === null ? "∞" : `${left} ngày`}</span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full bg-brand-gradient"
          />
        </div>
      </div>

      {license.expiresAt ? (
        <div className="relative mt-7 flex flex-wrap gap-3">
          <button type="button" onClick={onRenew} className={buttonClass("primary", "md")}>
            Gia hạn ngay
          </button>
          <Link href="/#bang-gia" className={buttonClass("outline", "md")}>
            Nâng cấp lên Vĩnh Viễn
          </Link>
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

function DownloadCard() {
  return (
    <div className="glow-border flex flex-col rounded-3xl bg-panel p-7 shadow-panel">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-brand/15 ring-1 ring-cyan-brand/30">
        <MonitorDown className="h-6 w-6 text-cyan-glow" />
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

function Checkout({ planId, email, onClose }: { planId: string; email: string; onClose: () => void }) {
  const plan = plans.find((p) => p.id === planId);
  if (!plan) return null;
  const transferNote = `MEAI ${plan.id.toUpperCase()} ${email.split("@")[0].toUpperCase()}`;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="rounded-3xl border border-neon-pink/30 bg-gradient-to-br from-neon-pink/10 via-panel to-cyan-brand/10 p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-pink-300">Thanh toán</p>
            <p className="mt-1 text-xl font-bold text-white">
              {plan.name} — {plan.price}đ <span className="text-sm font-normal text-slate-400">{plan.unit}</span>
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-sm text-slate-400 hover:text-white">
            Đóng
          </button>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-black/30 p-4 text-sm">
            <p className="text-slate-400">Nội dung chuyển khoản</p>
            <div className="mt-1 flex items-center justify-between gap-2">
              <code className="font-mono font-semibold text-cyan-glow">{transferNote}</code>
              <CopyButton value={transferNote} />
            </div>
          </div>
          <div className="rounded-2xl bg-black/30 p-4 text-sm text-slate-400">
            Nhắn Zalo để nhận mã VietQR. License được gửi tới <strong className="text-white">{email}</strong> ngay khi hệ
            thống xác nhận thanh toán.
          </div>
        </div>
        <a
          href={siteConfig.contact.zalo}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass("primary", "md", "mt-5")}
        >
          Nhận thông tin thanh toán qua Zalo <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* License & thiết bị                                                  */
/* ------------------------------------------------------------------ */

function CopyButton({ value }: { value: string }) {
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
      aria-label="Sao chép"
      className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
    >
      {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

function LicenseManager({ licenses, onChange }: { licenses: License[]; onChange: (l: License[]) => void }) {
  const [input, setInput] = useState("");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const normalized = useMemo(() => input.trim().toUpperCase(), [input]);

  const activate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!KEY_PATTERN.test(normalized)) {
      setMsg({ type: "err", text: "Mã không đúng định dạng MEAI-XXXX-XXXX-XXXX." });
      return;
    }
    if (licenses.some((l) => l.key === normalized)) {
      setMsg({ type: "err", text: "Mã này đã có trong tài khoản của bạn." });
      return;
    }
    const now = Date.now();
    const lic: License = {
      key: normalized,
      planId: "month",
      activatedAt: new Date(now).toISOString(),
      expiresAt: new Date(now + 30 * DAY).toISOString(),
      maxDevices: planMeta.month.maxDevices,
      devices: [],
    };
    onChange([...licenses, lic]);
    setInput("");
    setMsg({ type: "ok", text: "Đã thêm mã kích hoạt. Mở app MeAI và đăng nhập để gán mã cho máy này." });
  };

  const removeDevice = (key: string, deviceId: string) =>
    onChange(licenses.map((l) => (l.key === key ? { ...l, devices: l.devices.filter((d) => d.id !== deviceId) } : l)));

  return (
    <div className="glow-border rounded-3xl bg-panel p-7 shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient-soft ring-1 ring-cyan-brand/30">
            <KeyRound className="h-5 w-5 text-cyan-glow" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-white">Mã kích hoạt (License Key)</h2>
            <p className="text-xs text-slate-500">Quản lý mã và các máy tính đang sử dụng</p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {licenses.map((l) => {
          const meta = planMeta[l.planId];
          const shown = revealed[l.key];
          return (
            <div key={l.key} className="rounded-2xl border border-white/[0.07] bg-black/20 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <code className="truncate font-mono text-base font-semibold tracking-wider text-white">
                    {shown ? l.key : maskKey(l.key)}
                  </code>
                  <button
                    type="button"
                    onClick={() => setRevealed((r) => ({ ...r, [l.key]: !r[l.key] }))}
                    aria-label={shown ? "Ẩn mã" : "Hiện mã"}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                  >
                    {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <CopyButton value={l.key} />
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-md bg-white/[0.06] px-2 py-1 text-slate-300">{meta.name}</span>
                  <span className="rounded-md bg-emerald-400/10 px-2 py-1 text-emerald-300">
                    {l.expiresAt ? `HSD ${formatDate(l.expiresAt)}` : "Vĩnh viễn"}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Thiết bị đã kích hoạt ({l.devices.length}/{l.maxDevices})
                </p>
                {l.devices.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-500">Chưa có máy nào. Nhập mã này trong app MeAI để kích hoạt.</p>
                ) : (
                  <ul className="mt-2 divide-y divide-white/[0.05]">
                    {l.devices.map((d) => (
                      <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                        <span className="flex items-center gap-3">
                          <Laptop className="h-4 w-4 text-cyan-brand" />
                          <span>
                            <span className="block text-sm font-medium text-slate-200">{d.name}</span>
                            <span className="block font-mono text-[11px] text-slate-500">
                              {d.id} · hoạt động {formatDate(d.lastSeen)}
                            </span>
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => removeDevice(l.key, d.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-400/20 px-3 py-1.5 text-xs font-medium text-rose-300 transition hover:bg-rose-400/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Gỡ thiết bị
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={activate} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setMsg(null);
          }}
          placeholder="Nhập mã mới: MEAI-XXXX-XXXX-XXXX"
          aria-label="Mã kích hoạt mới"
          className="h-12 flex-1 rounded-xl border border-white/10 bg-black/30 px-4 font-mono text-sm uppercase tracking-wider text-white outline-none transition placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-600 focus:border-cyan-brand/60 focus:shadow-glow-sm"
        />
        <button type="submit" className={buttonClass("primary", "lg", "h-12")}>
          <Plus className="h-4 w-4" /> Thêm mã
        </button>
      </form>
      {msg ? (
        <p className={cn("mt-3 flex items-center gap-2 text-sm", msg.type === "ok" ? "text-emerald-400" : "text-rose-400")}>
          {msg.type === "ok" ? <ShieldCheck className="h-4 w-4" /> : <TriangleAlert className="h-4 w-4" />}
          {msg.text}
        </p>
      ) : null}
      <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <Info className="h-3.5 w-3.5" /> Gỡ thiết bị sẽ đăng xuất MeAI trên máy đó ở lần khởi động kế tiếp.
      </p>
    </div>
  );
}
