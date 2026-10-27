import { PLAN_RULES, isPlanId } from "../shared/plans";
import type { Env } from "./env";
import { safeEqual } from "./crypto";
import { GoogleTokenError, verifyGoogleIdToken, type JwksFetcher } from "./google";
import * as store from "./store";

/**
 * API tài khoản MeAI (Cloudflare Pages Functions, mount tại /api/*).
 *
 * Website:   POST /api/auth/google · POST /api/auth/logout · GET /api/me
 *            POST /api/orders · POST /api/orders/:code/cancel · DELETE /api/devices/:id · POST /api/app/link
 * App:       POST /api/app/token · POST /api/app/google · GET /api/app/entitlement · POST /api/app/orders · POST /api/app/logout
 * Thanh toán: POST /api/payments/webhook
 * Quản trị:  GET /api/admin/orders · POST /api/admin/grant
 * Chung:     GET /api/config
 */

const COOKIE = "__Host-meai_session";
const DEVICE_ID = /^[A-Za-z0-9._:-]{6,128}$/;

class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public extra: Record<string, unknown> = {},
  ) {
    super(message);
  }
}

const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });

const cookieHeader = (value: string, maxAgeSec: number) =>
  `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAgeSec}`;

function readCookie(req: Request) {
  const raw = req.headers.get("cookie") ?? "";
  for (const part of raw.split(/;\s*/)) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i) === COOKIE) return part.slice(i + 1);
  }
  return null;
}

const bearer = (req: Request) => /^Bearer\s+(.+)$/i.exec(req.headers.get("authorization") ?? "")?.[1]?.trim() ?? null;

async function body<T>(req: Request): Promise<Partial<T>> {
  if (!(req.headers.get("content-type") ?? "").includes("application/json")) throw new HttpError(415, "BAD_CONTENT_TYPE", "Cần gửi JSON");
  try {
    return ((await req.json()) ?? {}) as Partial<T>;
  } catch {
    throw new HttpError(400, "BAD_JSON", "JSON không hợp lệ");
  }
}

/** Chống CSRF cho các thao tác dùng cookie: yêu cầu phải đến từ chính website */
function assertSameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin || origin !== new URL(req.url).origin) throw new HttpError(403, "BAD_ORIGIN", "Yêu cầu không hợp lệ");
}

function requireDb(env: Env) {
  if (!env.DB) throw new HttpError(503, "NOT_CONFIGURED", "Hệ thống tài khoản chưa được cấu hình (thiếu D1 binding DB)");
  return env.DB;
}

const csv = (v?: string) => (v ?? "").split(",").map((s) => s.trim()).filter(Boolean);

function bankInfo(env: Env) {
  if (!env.BANK_ID || !env.BANK_ACCOUNT) return null;
  return { bankId: env.BANK_ID, account: env.BANK_ACCOUNT, accountName: env.BANK_ACCOUNT_NAME ?? "" };
}

/** Ảnh VietQR có sẵn số tiền & nội dung chuyển khoản = mã đơn */
function withPayment(env: Env, order: ReturnType<typeof store.orderView>) {
  const bank = bankInfo(env);
  if (!bank || order.status !== "pending") return { ...order, payment: null };
  const qs = new URLSearchParams({ amount: String(order.amount), addInfo: order.code, accountName: bank.accountName });
  return {
    ...order,
    payment: {
      ...bank,
      transferContent: order.code,
      qrUrl: `https://img.vietqr.io/image/${encodeURIComponent(bank.bankId)}-${encodeURIComponent(bank.account)}-compact2.png?${qs}`,
    },
  };
}

async function accountView(env: Env, db: D1Database, user: store.UserRow) {
  const [plan, devices, orders] = await Promise.all([
    store.getPlan(db, user.id),
    store.listDevices(db, user.id),
    store.listOrders(db, user.id),
  ]);
  return {
    user: { id: user.id, email: user.email, name: user.name, picture: user.picture, createdAt: user.created_at },
    plan,
    devices,
    orders: orders.map((o) => withPayment(env, o)),
  };
}

async function webUser(req: Request, db: D1Database) {
  const token = readCookie(req);
  const s = token ? await store.getSession(db, token, "web") : null;
  if (!s) throw new HttpError(401, "UNAUTHENTICATED", "Bạn cần đăng nhập bằng Google");
  return s.user;
}

async function appSession(req: Request, db: D1Database) {
  const token = bearer(req);
  const s = token ? await store.getSession(db, token, "app") : null;
  if (!s) throw new HttpError(401, "UNAUTHENTICATED", "Phiên đăng nhập app đã hết hạn — đăng nhập lại bằng Google");
  return s;
}

/** Quyền sử dụng app: gói, hạn dùng, giới hạn máy — app áp dụng đúng theo kết quả này */
async function entitlement(db: D1Database, user: store.UserRow, deviceId: string | null, deviceName: string | null) {
  const plan = await store.getPlan(db, user.id);
  let device: "ok" | "limit" | "unknown" = "unknown";
  if (plan?.active && deviceId) {
    device = (await store.touchDevice(db, user.id, deviceId, deviceName, plan.maxDevices)).ok ? "ok" : "limit";
  }
  return {
    user: { id: user.id, email: user.email, name: user.name, picture: user.picture },
    plan,
    canUse: Boolean(plan?.active) && device !== "limit",
    device,
    devices: await store.listDevices(db, user.id),
    checkedAt: Date.now(),
    // App nên kiểm tra lại sau khoảng này (và mỗi lần khởi động)
    recheckAfterSec: 6 * 3600,
  };
}

function readDevice(input: { deviceId?: unknown; deviceName?: unknown }) {
  const deviceId = typeof input.deviceId === "string" ? input.deviceId : "";
  if (!DEVICE_ID.test(deviceId)) throw new HttpError(400, "BAD_DEVICE", "deviceId không hợp lệ");
  const deviceName = typeof input.deviceName === "string" ? input.deviceName.slice(0, 80) : null;
  return { deviceId, deviceName };
}

async function assertAdmin(req: Request, env: Env) {
  const token = bearer(req);
  if (!env.ADMIN_TOKEN || !token || !(await safeEqual(token, env.ADMIN_TOKEN)))
    throw new HttpError(401, "UNAUTHORIZED", "Sai ADMIN_TOKEN");
}

/** Nội dung & số tiền từ webhook ngân hàng (SePay: content/transferAmount/id; Casso: description/amount/tid) */
function parsePayment(p: Record<string, unknown>) {
  const text = [p.content, p.description, p.addInfo, p.code].filter((v) => typeof v === "string").join(" ");
  const amount = Number(p.transferAmount ?? p.amount ?? 0);
  const ref = p.id ?? p.tid ?? p.referenceCode ?? null;
  const incoming = p.transferType === undefined || p.transferType === "in";
  const code = /MEAI[A-HJ-NP-Z2-9]{6}/.exec(text.toUpperCase().replace(/[\s-]/g, ""))?.[0] ?? null;
  return { code, amount, ref: ref === null ? null : String(ref), incoming };
}

type Ctx = { req: Request; env: Env; parts: string[]; fetcher?: JwksFetcher };

async function route({ req, env, parts, fetcher }: Ctx): Promise<Response> {
  const m = req.method;
  const p = parts.join("/");

  if (m === "GET" && p === "config") {
    return json({
      configured: Boolean(env.DB && env.GOOGLE_CLIENT_ID),
      googleClientId: env.GOOGLE_CLIENT_ID ?? null,
      payments: { bank: Boolean(bankInfo(env)), auto: Boolean(env.PAYMENT_WEBHOOK_KEY) },
      plans: Object.values(PLAN_RULES),
    });
  }

  /* ----------------------------- Website ----------------------------- */
  if (m === "POST" && p === "auth/google") {
    assertSameOrigin(req);
    const db = requireDb(env);
    if (!env.GOOGLE_CLIENT_ID) throw new HttpError(503, "NOT_CONFIGURED", "Chưa cấu hình GOOGLE_CLIENT_ID");
    const { credential } = await body<{ credential: string }>(req);
    if (typeof credential !== "string") throw new HttpError(400, "BAD_REQUEST", "Thiếu credential");
    const profile = await verifyGoogleIdToken(credential, [env.GOOGLE_CLIENT_ID], { fetcher });
    const user = await store.upsertUser(db, profile);
    const token = await store.createSession(db, user.id, "web", null);
    return json(await accountView(env, db, user), 200, { "set-cookie": cookieHeader(token, store.WEB_SESSION_DAYS * 86400) });
  }

  if (m === "POST" && p === "auth/logout") {
    assertSameOrigin(req);
    const token = readCookie(req);
    if (token && env.DB) await store.deleteSession(env.DB, token);
    return json({ ok: true }, 200, { "set-cookie": cookieHeader("", 0) });
  }

  if (m === "GET" && p === "me") {
    const db = requireDb(env);
    return json(await accountView(env, db, await webUser(req, db)));
  }

  if (m === "POST" && p === "orders") {
    assertSameOrigin(req);
    const db = requireDb(env);
    const user = await webUser(req, db);
    const { planId } = await body<{ planId: string }>(req);
    if (!isPlanId(planId)) throw new HttpError(400, "BAD_PLAN", "Gói không hợp lệ");
    const order = await store.createOrder(db, user.id, planId, "web");
    return json({ order: withPayment(env, order), account: await accountView(env, db, user) });
  }

  if (m === "POST" && parts[0] === "orders" && parts[2] === "cancel" && parts.length === 3) {
    assertSameOrigin(req);
    const db = requireDb(env);
    const user = await webUser(req, db);
    await store.cancelOrder(db, user.id, parts[1]);
    return json(await accountView(env, db, user));
  }

  if (m === "DELETE" && parts[0] === "devices" && parts.length === 2) {
    assertSameOrigin(req);
    const db = requireDb(env);
    const user = await webUser(req, db);
    await store.removeDevice(db, user.id, decodeURIComponent(parts[1]));
    return json(await accountView(env, db, user));
  }

  /** Website cấp mã một lần để app desktop đổi lấy phiên đăng nhập (xem trang /app/connect) */
  if (m === "POST" && p === "app/link") {
    assertSameOrigin(req);
    const db = requireDb(env);
    const user = await webUser(req, db);
    return json({ code: await store.createAppLinkCode(db, user.id) });
  }

  /* ----------------------------- App desktop ----------------------------- */
  if (m === "POST" && p === "app/token") {
    const db = requireDb(env);
    const input = await body<{ code: string; deviceId: string; deviceName: string }>(req);
    const { deviceId, deviceName } = readDevice(input);
    const user = typeof input.code === "string" ? await store.consumeAppLinkCode(db, input.code) : null;
    if (!user) throw new HttpError(400, "BAD_CODE", "Mã liên kết không hợp lệ hoặc đã hết hạn");
    const token = await store.createSession(db, user.id, "app", deviceId);
    return json({ token, expiresInDays: store.APP_SESSION_DAYS, entitlement: await entitlement(db, user, deviceId, deviceName) });
  }

  if (m === "POST" && p === "app/google") {
    const db = requireDb(env);
    const audiences = [...csv(env.GOOGLE_DESKTOP_CLIENT_IDS), ...csv(env.GOOGLE_CLIENT_ID)];
    if (!audiences.length) throw new HttpError(503, "NOT_CONFIGURED", "Chưa cấu hình Google Client ID");
    const input = await body<{ idToken: string; deviceId: string; deviceName: string }>(req);
    const { deviceId, deviceName } = readDevice(input);
    if (typeof input.idToken !== "string") throw new HttpError(400, "BAD_REQUEST", "Thiếu idToken");
    const user = await store.upsertUser(db, await verifyGoogleIdToken(input.idToken, audiences, { fetcher }));
    const token = await store.createSession(db, user.id, "app", deviceId);
    return json({ token, expiresInDays: store.APP_SESSION_DAYS, entitlement: await entitlement(db, user, deviceId, deviceName) });
  }

  if (m === "GET" && p === "app/entitlement") {
    const db = requireDb(env);
    const s = await appSession(req, db);
    const name = new URL(req.url).searchParams.get("deviceName");
    return json(await entitlement(db, s.user, s.deviceId, name ? name.slice(0, 80) : null));
  }

  if (m === "POST" && p === "app/orders") {
    const db = requireDb(env);
    const s = await appSession(req, db);
    const { planId } = await body<{ planId: string }>(req);
    if (!isPlanId(planId)) throw new HttpError(400, "BAD_PLAN", "Gói không hợp lệ");
    return json({ order: withPayment(env, await store.createOrder(db, s.user.id, planId, "app")) });
  }

  if (m === "POST" && p === "app/logout") {
    const token = bearer(req);
    if (token && env.DB) await store.deleteSession(env.DB, token);
    return json({ ok: true });
  }

  /* ----------------------------- Thanh toán ----------------------------- */
  if (m === "POST" && p === "payments/webhook") {
    const db = requireDb(env);
    const auth = /^(?:Apikey|Bearer)\s+(.+)$/i.exec(req.headers.get("authorization") ?? "")?.[1]?.trim();
    if (!env.PAYMENT_WEBHOOK_KEY || !auth || !(await safeEqual(auth, env.PAYMENT_WEBHOOK_KEY)))
      throw new HttpError(401, "UNAUTHORIZED", "Sai khoá webhook");
    const pay = parsePayment(await body<Record<string, unknown>>(req));
    if (!pay.incoming || !pay.code) return json({ success: true, matched: false });
    const order = await store.getOrder(db, pay.code);
    if (!order || order.status !== "pending") return json({ success: true, matched: false });
    if (pay.amount < order.amount) return json({ success: true, matched: false, reason: "UNDERPAID" });
    const paid = await store.markOrderPaid(db, order.code, pay.ref);
    return json({ success: true, matched: paid, order: order.code });
  }

  /* ----------------------------- Quản trị ----------------------------- */
  if (m === "GET" && p === "admin/orders") {
    await assertAdmin(req, env);
    return json({ orders: await store.listPendingOrders(requireDb(env)) });
  }

  if (m === "POST" && p === "admin/grant") {
    await assertAdmin(req, env);
    const db = requireDb(env);
    const input = await body<{ orderCode: string; email: string; planId: string }>(req);
    if (typeof input.orderCode === "string") {
      const ok = await store.markOrderPaid(db, input.orderCode.trim().toUpperCase(), null);
      if (!ok) throw new HttpError(404, "ORDER_NOT_PENDING", "Không có đơn đang chờ với mã này");
      return json({ ok: true, orderCode: input.orderCode });
    }
    if (typeof input.email !== "string" || !isPlanId(input.planId)) throw new HttpError(400, "BAD_REQUEST", "Cần orderCode hoặc email + planId");
    const user = await store.findUserByEmail(db, input.email);
    if (!user) throw new HttpError(404, "USER_NOT_FOUND", "Email này chưa từng đăng nhập MeAI bằng Google");
    const code = await store.grantPlan(db, user.id, input.planId);
    return json({ ok: true, orderCode: code, plan: await store.getPlan(db, user.id) });
  }

  throw new HttpError(404, "NOT_FOUND", "Không tìm thấy API");
}

export async function handleApi(req: Request, env: Env, opts: { fetcher?: JwksFetcher } = {}) {
  const url = new URL(req.url);
  const parts = url.pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean);
  try {
    return await route({ req, env, parts, fetcher: opts.fetcher });
  } catch (e) {
    if (e instanceof HttpError) return json({ error: e.code, message: e.message, ...e.extra }, e.status);
    if (e instanceof GoogleTokenError) return json({ error: "BAD_GOOGLE_TOKEN", message: e.message }, 401);
    console.error(e);
    return json({ error: "INTERNAL", message: "Lỗi hệ thống, vui lòng thử lại" }, 500);
  }
}
