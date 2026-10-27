import { PLAN_RULES, isPlanId, type PlanId } from "../shared/plans";
import { orderCode, randomToken, sha256 } from "./crypto";
import type { GoogleProfile } from "./google";

const DAY = 86_400_000;
export const WEB_SESSION_DAYS = 30;
export const APP_SESSION_DAYS = 180;

export type UserRow = { id: string; email: string; name: string | null; picture: string | null; created_at: number };
type SubRow = { plan_id: string; started_at: number; expires_at: number | null };
type DeviceRow = { device_id: string; name: string | null; first_seen: number; last_seen: number };
type OrderRow = {
  code: string;
  user_id: string;
  plan_id: string;
  amount: number;
  status: "pending" | "paid" | "cancelled";
  source: string;
  created_at: number;
  paid_at: number | null;
};

/* ------------------------------ Người dùng ------------------------------ */

export async function upsertUser(db: D1Database, p: GoogleProfile, now = Date.now()) {
  await db
    .prepare(
      `INSERT INTO users (id, email, name, picture, created_at, last_login_at) VALUES (?1, ?2, ?3, ?4, ?5, ?5)
       ON CONFLICT (id) DO UPDATE SET email = ?2, name = ?3, picture = ?4, last_login_at = ?5`,
    )
    .bind(p.sub, p.email, p.name, p.picture, now)
    .run();
  return (await db.prepare("SELECT id, email, name, picture, created_at FROM users WHERE id = ?").bind(p.sub).first<UserRow>())!;
}

export async function findUserByEmail(db: D1Database, email: string) {
  return db
    .prepare("SELECT id, email, name, picture, created_at FROM users WHERE email = ? ORDER BY last_login_at DESC LIMIT 1")
    .bind(email.trim().toLowerCase())
    .first<UserRow>();
}

/* ------------------------------ Phiên đăng nhập ------------------------------ */

export async function createSession(db: D1Database, userId: string, kind: "web" | "app", deviceId: string | null, now = Date.now()) {
  const token = randomToken();
  const days = kind === "web" ? WEB_SESSION_DAYS : APP_SESSION_DAYS;
  await db
    .prepare("INSERT INTO sessions (token_hash, user_id, kind, device_id, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(await sha256(token), userId, kind, deviceId, now, now + days * DAY)
    .run();
  return token;
}

export async function getSession(db: D1Database, token: string, kind: "web" | "app", now = Date.now()) {
  const row = await db
    .prepare(
      `SELECT s.device_id, u.id, u.email, u.name, u.picture, u.created_at
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.kind = ? AND s.expires_at > ?`,
    )
    .bind(await sha256(token), kind, now)
    .first<UserRow & { device_id: string | null }>();
  if (!row) return null;
  const { device_id, ...user } = row;
  return { user: user as UserRow, deviceId: device_id };
}

export async function deleteSession(db: D1Database, token: string) {
  await db.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256(token)).run();
}

/* ------------------------------ Gói cước ------------------------------ */

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

export async function getPlan(db: D1Database, userId: string, now = Date.now()): Promise<PlanView | null> {
  const sub = await db
    .prepare("SELECT plan_id, started_at, expires_at FROM subscriptions WHERE user_id = ?")
    .bind(userId)
    .first<SubRow>();
  if (!sub || !isPlanId(sub.plan_id)) return null;
  const rule = PLAN_RULES[sub.plan_id];
  const active = sub.expires_at === null || sub.expires_at > now;
  return {
    id: rule.id,
    name: rule.name,
    active,
    startedAt: sub.started_at,
    expiresAt: sub.expires_at,
    daysLeft: sub.expires_at === null ? null : Math.max(0, Math.ceil((sub.expires_at - now) / DAY)),
    maxDevices: rule.maxDevices,
    periodDays: rule.days,
  };
}

/**
 * Cộng gói vào tài khoản sau khi thanh toán:
 * - Vĩnh viễn: không hết hạn.
 * - Gói theo thời hạn: cộng nối tiếp vào hạn còn lại (gia hạn / nâng cấp không mất ngày đã trả).
 * - Đang Vĩnh viễn mà mua gói thấp hơn: giữ Vĩnh viễn.
 */
export async function applyPurchase(db: D1Database, userId: string, planId: PlanId, now = Date.now()) {
  const current = await getPlan(db, userId, now);
  const rule = PLAN_RULES[planId];
  if (current?.active && current.expiresAt === null) return; // đã vĩnh viễn

  let planToKeep: PlanId = planId;
  if (current?.active && PLAN_RULES[current.id].rank > rule.rank) planToKeep = current.id; // không hạ cấp khi đang dùng gói cao hơn

  const expiresAt =
    rule.days === null ? null : Math.max(now, current?.active && current.expiresAt ? current.expiresAt : now) + rule.days * DAY;
  const startedAt = current?.active ? current.startedAt : now;

  await db
    .prepare(
      `INSERT INTO subscriptions (user_id, plan_id, started_at, expires_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5)
       ON CONFLICT (user_id) DO UPDATE SET plan_id = ?2, started_at = ?3, expires_at = ?4, updated_at = ?5`,
    )
    .bind(userId, planToKeep, startedAt, expiresAt, now)
    .run();
}

/* ------------------------------ Thiết bị ------------------------------ */

export async function listDevices(db: D1Database, userId: string) {
  const { results } = await db
    .prepare("SELECT device_id, name, first_seen, last_seen FROM devices WHERE user_id = ? ORDER BY last_seen DESC")
    .bind(userId)
    .all<DeviceRow>();
  return results.map((d) => ({ id: d.device_id, name: d.name, firstSeen: d.first_seen, lastSeen: d.last_seen }));
}

/** Ghi nhận máy đang dùng app; từ chối nếu vượt số máy của gói */
export async function touchDevice(db: D1Database, userId: string, deviceId: string, name: string | null, maxDevices: number, now = Date.now()) {
  const existing = await db
    .prepare("SELECT device_id FROM devices WHERE user_id = ? AND device_id = ?")
    .bind(userId, deviceId)
    .first();
  if (existing) {
    await db
      .prepare("UPDATE devices SET last_seen = ?, name = COALESCE(?, name) WHERE user_id = ? AND device_id = ?")
      .bind(now, name, userId, deviceId)
      .run();
    return { ok: true as const };
  }
  const count = (await db.prepare("SELECT COUNT(*) AS n FROM devices WHERE user_id = ?").bind(userId).first<{ n: number }>())?.n ?? 0;
  if (count >= maxDevices) return { ok: false as const };
  await db
    .prepare("INSERT INTO devices (user_id, device_id, name, first_seen, last_seen) VALUES (?, ?, ?, ?, ?)")
    .bind(userId, deviceId, name, now, now)
    .run();
  return { ok: true as const };
}

/** Gỡ máy: xoá máy và đăng xuất app trên máy đó */
export async function removeDevice(db: D1Database, userId: string, deviceId: string) {
  await db.batch([
    db.prepare("DELETE FROM devices WHERE user_id = ? AND device_id = ?").bind(userId, deviceId),
    db.prepare("DELETE FROM sessions WHERE user_id = ? AND kind = 'app' AND device_id = ?").bind(userId, deviceId),
  ]);
}

/* ------------------------------ Đơn hàng ------------------------------ */

export const orderView = (o: OrderRow) => ({
  code: o.code,
  planId: o.plan_id,
  planName: isPlanId(o.plan_id) ? PLAN_RULES[o.plan_id].name : o.plan_id,
  amount: o.amount,
  status: o.status,
  source: o.source,
  createdAt: o.created_at,
  paidAt: o.paid_at,
});

export async function listOrders(db: D1Database, userId: string, limit = 20) {
  const { results } = await db
    .prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ?")
    .bind(userId, limit)
    .all<OrderRow>();
  return results.map(orderView);
}

/** Tạo đơn mới; đơn đang chờ cùng gói được dùng lại để người dùng không chuyển khoản nhầm 2 mã */
export async function createOrder(db: D1Database, userId: string, planId: PlanId, source: "web" | "app", now = Date.now()) {
  await db
    .prepare("UPDATE orders SET status = 'cancelled' WHERE user_id = ? AND status = 'pending' AND created_at < ?")
    .bind(userId, now - 3 * DAY)
    .run();
  const pending = await db
    .prepare("SELECT * FROM orders WHERE user_id = ? AND plan_id = ? AND status = 'pending' ORDER BY created_at DESC LIMIT 1")
    .bind(userId, planId)
    .first<OrderRow>();
  if (pending) return orderView(pending);
  const row: OrderRow = {
    code: orderCode(),
    user_id: userId,
    plan_id: planId,
    amount: PLAN_RULES[planId].amount,
    status: "pending",
    source,
    created_at: now,
    paid_at: null,
  };
  await db
    .prepare("INSERT INTO orders (code, user_id, plan_id, amount, status, source, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .bind(row.code, row.user_id, row.plan_id, row.amount, row.status, row.source, row.created_at)
    .run();
  return orderView(row);
}

export async function cancelOrder(db: D1Database, userId: string, code: string) {
  await db.prepare("UPDATE orders SET status = 'cancelled' WHERE code = ? AND user_id = ? AND status = 'pending'").bind(code, userId).run();
}

export async function getOrder(db: D1Database, code: string) {
  return db.prepare("SELECT * FROM orders WHERE code = ?").bind(code).first<OrderRow>();
}

export async function listPendingOrders(db: D1Database) {
  const { results } = await db
    .prepare(
      `SELECT o.*, u.email FROM orders o JOIN users u ON u.id = o.user_id
       WHERE o.status = 'pending' ORDER BY o.created_at DESC LIMIT 100`,
    )
    .all<OrderRow & { email: string }>();
  return results.map((o) => ({ ...orderView(o), email: o.email }));
}

/**
 * Đánh dấu đơn đã thanh toán và cộng gói (chỉ một lần cho mỗi đơn / mỗi mã giao dịch).
 * Trả về false nếu đơn không tồn tại, không còn chờ, hoặc giao dịch đã được dùng.
 */
export async function markOrderPaid(db: D1Database, code: string, paymentRef: string | null, now = Date.now()) {
  const res = await db
    .prepare(
      `UPDATE orders SET status = 'paid', paid_at = ?, payment_ref = ?
       WHERE code = ? AND status = 'pending'
         AND (? IS NULL OR NOT EXISTS (SELECT 1 FROM orders WHERE payment_ref = ?))`,
    )
    .bind(now, paymentRef, code, paymentRef, paymentRef)
    .run();
  if (!res.meta.changes) return false;
  const order = (await getOrder(db, code))!;
  if (isPlanId(order.plan_id)) await applyPurchase(db, order.user_id, order.plan_id, now);
  return true;
}

/** Kích hoạt gói trực tiếp (quản trị viên, không qua đơn) — tạo đơn "paid" để lưu lịch sử */
export async function grantPlan(db: D1Database, userId: string, planId: PlanId, now = Date.now()) {
  const code = orderCode();
  await db
    .prepare(
      "INSERT INTO orders (code, user_id, plan_id, amount, status, source, created_at, paid_at) VALUES (?, ?, ?, 0, 'paid', 'admin', ?, ?)",
    )
    .bind(code, userId, planId, now, now)
    .run();
  await applyPurchase(db, userId, planId, now);
  return code;
}

/* ------------------------------ Liên kết app desktop ------------------------------ */

export async function createAppLinkCode(db: D1Database, userId: string, now = Date.now()) {
  const code = randomToken();
  await db.prepare("DELETE FROM app_link_codes WHERE expires_at < ?").bind(now).run();
  await db
    .prepare("INSERT INTO app_link_codes (code_hash, user_id, expires_at) VALUES (?, ?, ?)")
    .bind(await sha256(code), userId, now + 5 * 60_000)
    .run();
  return code;
}

/** Đổi mã liên kết (dùng 1 lần, hạn 5 phút) lấy user */
export async function consumeAppLinkCode(db: D1Database, code: string, now = Date.now()) {
  const hash = await sha256(code);
  const row = await db
    .prepare("DELETE FROM app_link_codes WHERE code_hash = ? AND expires_at > ? RETURNING user_id")
    .bind(hash, now)
    .first<{ user_id: string }>();
  if (!row) return null;
  return db.prepare("SELECT id, email, name, picture, created_at FROM users WHERE id = ?").bind(row.user_id).first<UserRow>();
}
