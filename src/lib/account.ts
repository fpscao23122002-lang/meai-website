import { PLAN_RULES, type PlanId } from "../../shared/plans";

/**
 * Tài khoản MeAI = tài khoản Google. Website & app desktop đọc cùng một dữ liệu qua API /api/* (server/router.ts).
 * Khi backend chưa cấu hình (chưa có D1 / GOOGLE_CLIENT_ID), website chạy chế độ "xem thử": dữ liệu mô phỏng,
 * lưu trên trình duyệt — giao diện và luồng thao tác giống hệt bản thật.
 */

export type PlanView = {
  id: PlanId;
  name: string;
  active: boolean;
  startedAt: number;
  expiresAt: number | null;
  daysLeft: number | null;
  maxDevices: number;
  periodDays: number | null;
};
export type DeviceView = { id: string; name: string | null; firstSeen: number; lastSeen: number };
export type PaymentInfo = { bankId: string; account: string; accountName: string; transferContent: string; qrUrl: string };
export type OrderView = {
  code: string;
  planId: string;
  planName: string;
  amount: number;
  status: "pending" | "paid" | "cancelled";
  source: string;
  createdAt: number;
  paidAt: number | null;
  payment: PaymentInfo | null;
};
export type Account = {
  user: { id: string; email: string; name: string | null; picture: string | null; createdAt: number };
  plan: PlanView | null;
  devices: DeviceView[];
  orders: OrderView[];
};
export type SiteConfig = {
  configured: boolean;
  googleClientId: string | null;
  payments: { bank: boolean; auto: boolean };
};

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api/${path}`, {
      method: init.method ?? "GET",
      credentials: "same-origin",
      headers: init.body !== undefined ? { "content-type": "application/json" } : undefined,
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    });
  } catch {
    throw new ApiError(0, "NETWORK", "Mất kết nối mạng, vui lòng thử lại");
  }
  const data = (await res.json().catch(() => null)) as (T & { error?: string; message?: string }) | null;
  if (!res.ok || data === null) throw new ApiError(res.status, data?.error ?? "UNKNOWN", data?.message ?? "Có lỗi xảy ra, vui lòng thử lại");
  return data;
}

/** Đọc cấu hình; nếu API chưa chạy (VD: bản tĩnh, chạy thử tại máy) → chế độ xem thử */
export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const res = await fetch("/api/config", { credentials: "same-origin" });
    if (!res.ok || !(res.headers.get("content-type") ?? "").includes("application/json")) throw new Error();
    return (await res.json()) as SiteConfig;
  } catch {
    return { configured: false, googleClientId: null, payments: { bank: false, auto: false } };
  }
}

export const liveApi = {
  me: () => request<Account>("me"),
  loginWithGoogle: (credential: string) => request<Account>("auth/google", { method: "POST", body: { credential } }),
  logout: () => request<{ ok: true }>("auth/logout", { method: "POST", body: {} }),
  createOrder: (planId: PlanId) => request<{ order: OrderView; account: Account }>("orders", { method: "POST", body: { planId } }),
  cancelOrder: (code: string) => request<Account>(`orders/${encodeURIComponent(code)}/cancel`, { method: "POST", body: {} }),
  removeDevice: (id: string) => request<Account>(`devices/${encodeURIComponent(id)}`, { method: "DELETE", body: {} }),
  createAppLink: () => request<{ code: string }>("app/link", { method: "POST", body: {} }),
};

/* ------------------------------------------------------------------ */
/* Chế độ xem thử (khi backend chưa cấu hình)                            */
/* ------------------------------------------------------------------ */

const DEMO_KEY = "meai-demo-account-v2";
const DAY = 86_400_000;

function demoLoad(): Account | null {
  try {
    const raw = window.localStorage.getItem(DEMO_KEY);
    return raw ? (JSON.parse(raw) as Account) : null;
  } catch {
    return null;
  }
}
let demoMemory: Account | null = null;
function demoSave(a: Account | null) {
  demoMemory = a;
  try {
    if (a) window.localStorage.setItem(DEMO_KEY, JSON.stringify(a));
    else window.localStorage.removeItem(DEMO_KEY);
  } catch {
    /* Trình duyệt chặn storage: vẫn dùng được trong phiên hiện tại */
  }
  return a;
}
const demoCurrent = () => demoLoad() ?? demoMemory;

function demoPlan(id: PlanId, startedAt: number, expiresAt: number | null, now = Date.now()): PlanView {
  const r = PLAN_RULES[id];
  return {
    id,
    name: r.name,
    active: expiresAt === null || expiresAt > now,
    startedAt,
    expiresAt,
    daysLeft: expiresAt === null ? null : Math.max(0, Math.ceil((expiresAt - now) / DAY)),
    maxDevices: r.maxDevices,
    periodDays: r.days,
  };
}

const demoCode = () => "MEAI" + Array.from({ length: 6 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");

export const demoApi = {
  me: async () => demoCurrent(),
  login: async (): Promise<Account> => {
    const now = Date.now();
    return demoSave({
      user: { id: "demo", email: "ban.demo@gmail.com", name: "Bạn (xem thử)", picture: null, createdAt: now - 247 * DAY },
      plan: demoPlan("year", now - 247 * DAY, now + 118 * DAY),
      devices: [
        { id: "WIN-7F3A-91C2", name: "DESKTOP-STUDIO01", firstSeen: now - 200 * DAY, lastSeen: now - 2 * 3_600_000 },
        { id: "WIN-22BD-04E8", name: "LAPTOP-EDIT", firstSeen: now - 90 * DAY, lastSeen: now - 3 * DAY },
      ],
      orders: [
        { code: demoCode(), planId: "year", planName: PLAN_RULES.year.name, amount: PLAN_RULES.year.amount, status: "paid", source: "web", createdAt: now - 247 * DAY, paidAt: now - 247 * DAY, payment: null },
      ],
    })!;
  },
  logout: async () => {
    demoSave(null);
  },
  createOrder: async (planId: PlanId) => {
    const a = demoCurrent()!;
    const existing = a.orders.find((o) => o.status === "pending" && o.planId === planId);
    const order: OrderView = existing ?? {
      code: demoCode(),
      planId,
      planName: PLAN_RULES[planId].name,
      amount: PLAN_RULES[planId].amount,
      status: "pending",
      source: "web",
      createdAt: Date.now(),
      paidAt: null,
      payment: null,
    };
    const account = demoSave({ ...a, orders: existing ? a.orders : [order, ...a.orders] })!;
    return { order, account };
  },
  cancelOrder: async (code: string) => {
    const a = demoCurrent()!;
    return demoSave({ ...a, orders: a.orders.map((o) => (o.code === code && o.status === "pending" ? { ...o, status: "cancelled" as const } : o)) })!;
  },
  removeDevice: async (id: string) => {
    const a = demoCurrent()!;
    return demoSave({ ...a, devices: a.devices.filter((d) => d.id !== id) })!;
  },
  /** Chỉ có ở bản xem thử: giả lập ngân hàng báo đã nhận tiền (bản thật do webhook/quản trị viên xác nhận) */
  simulatePaid: async (code: string) => {
    const a = demoCurrent()!;
    const now = Date.now();
    const order = a.orders.find((o) => o.code === code);
    if (!order || order.status !== "pending") return a;
    const id = order.planId as PlanId;
    const cur = a.plan;
    let plan: PlanView;
    if (cur?.active && cur.expiresAt === null) plan = cur;
    else {
      const keep = cur?.active && PLAN_RULES[cur.id].rank > PLAN_RULES[id].rank ? cur.id : id;
      const days = PLAN_RULES[id].days;
      const exp = days === null ? null : Math.max(now, cur?.active && cur.expiresAt ? cur.expiresAt : now) + days * DAY;
      plan = demoPlan(keep, cur?.active ? cur.startedAt : now, exp, now);
    }
    return demoSave({ ...a, plan, orders: a.orders.map((o) => (o.code === code ? { ...o, status: "paid" as const, paidAt: now } : o)) })!;
  },
};
