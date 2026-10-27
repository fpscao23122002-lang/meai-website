// Kiểm thử API tài khoản: SQLite (node:sqlite) giả lập D1 + token Google tự ký. Chạy: npm run test:api
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { webcrypto } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// Đóng gói server/router.ts (TypeScript) để chạy trực tiếp bằng Node
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "node_modules/.tmp/api-test/router.mjs");
mkdirSync(dirname(out), { recursive: true });
execFileSync(resolve(root, "node_modules/.bin/esbuild"), [resolve(root, "server/router.ts"), "--bundle", "--format=esm", "--platform=neutral", `--outfile=${out}`, "--log-level=warning"], { stdio: "inherit" });
const { handleApi, SCHEMA } = await import(out);

const sqlite = new DatabaseSync(":memory:");
// Không tạo bảng sẵn: API phải tự tạo lược đồ ở lần gọi đầu tiên (ensureSchema)
const norm = (a) => a.map((v) => (v === undefined ? null : v));
function stmt(sql, args = []) {
  return {
    bind: (...a) => stmt(sql, norm(a)),
    first: async () => sqlite.prepare(sql).get(...args) ?? null,
    all: async () => ({ results: sqlite.prepare(sql).all(...args) }),
    run: async () => { const r = sqlite.prepare(sql).run(...args); return { meta: { changes: Number(r.changes) } }; },
    _run() { return sqlite.prepare(sql).run(...args); },
  };
}
const DB = { prepare: (sql) => stmt(sql), batch: async (list) => { sqlite.exec("BEGIN"); try { for (const s of list) s._run(); sqlite.exec("COMMIT"); } catch (e) { sqlite.exec("ROLLBACK"); throw e; } return []; } };

// Khoá RSA giả lập Google
const kp = await webcrypto.subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"]);
const jwk = { ...(await webcrypto.subtle.exportKey("jwk", kp.publicKey)), kid: "k1", alg: "RS256", use: "sig" };
const fetcher = async () => ({ keys: [jwk], maxAgeSec: 3600 });
const b64u = (buf) => Buffer.from(buf).toString("base64url");
async function idToken(claims, key = kp.privateKey) {
  const h = b64u(JSON.stringify({ alg: "RS256", kid: "k1", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const p = b64u(JSON.stringify({ iss: "https://accounts.google.com", aud: "web-client", iat: now, exp: now + 3600, email_verified: true, ...claims }));
  const sig = await webcrypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(`${h}.${p}`));
  return `${h}.${p}.${b64u(sig)}`;
}

const env = { DB, GOOGLE_CLIENT_ID: "web-client", GOOGLE_DESKTOP_CLIENT_IDS: "desk-client", ADMIN_TOKEN: "adm-secret", PAYMENT_WEBHOOK_KEY: "hook-key", BANK_ID: "MB", BANK_ACCOUNT: "0123456789", BANK_ACCOUNT_NAME: "MEAI STUDIO" };
const ORIGIN = "https://meai.vn";
let cookie = "";
async function call(method, path, { body, headers = {}, origin = ORIGIN, useCookie = true } = {}) {
  const h = { ...headers };
  if (body !== undefined) h["content-type"] = "application/json";
  if (origin) h.origin = origin;
  if (useCookie && cookie) h.cookie = cookie;
  const res = await handleApi(new Request(ORIGIN + "/api/" + path, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body) }), env, { fetcher });
  const sc = res.headers.get("set-cookie");
  if (sc && useCookie) cookie = sc.split(";")[0];
  return { status: res.status, data: await res.json(), setCookie: sc };
}
let fails = 0;
const check = (name, cond, extra) => { console.log((cond ? "PASS " : "FAIL ") + name + (cond ? "" : " → " + JSON.stringify(extra))); if (!cond) fails++; };

// Lược đồ tự tạo phải khớp file migration dùng cho wrangler d1 migrations
const migration = readFileSync(resolve(root, "migrations/0001_accounts.sql"), "utf8")
  .split("\n").filter((l) => !l.trim().startsWith("--")).join("\n")
  .split(";").map((x) => x.replace(/\s+--.*$/gm, "").split(/\s+/).join(" ").trim()).filter(Boolean);
check("schema.ts matches migration", JSON.stringify(migration) === JSON.stringify(SCHEMA), { migration, SCHEMA });

let r = await call("GET", "config");
check("tables auto-created", sqlite.prepare("SELECT COUNT(*) AS n FROM sqlite_master WHERE type='table'").get().n === 6, null);
check("config configured", r.data.configured === true && r.data.googleClientId === "web-client", r.data);
r = await call("GET", "me");
check("me requires login", r.status === 401, r);
r = await call("POST", "auth/google", { body: { credential: await idToken({ sub: "g1", email: "An@Gmail.com", name: "An" }) }, origin: "https://evil.com" });
check("login rejects foreign origin", r.status === 403, r);
r = await call("POST", "auth/google", { body: { credential: await idToken({ sub: "g1", email: "an@gmail.com", aud: "other" }) } });
check("login rejects wrong audience", r.status === 401 && r.data.error === "BAD_GOOGLE_TOKEN", r.data);
const other = await webcrypto.subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"]);
r = await call("POST", "auth/google", { body: { credential: await idToken({ sub: "g1", email: "an@gmail.com" }, other.privateKey) } });
check("login rejects forged signature", r.status === 401, r.data);
r = await call("POST", "auth/google", { body: { credential: await idToken({ sub: "g1", email: "an@gmail.com", exp: 1000 }) } });
check("login rejects expired token", r.status === 401, r.data);
r = await call("POST", "auth/google", { body: { credential: await idToken({ sub: "g1", email: "an@gmail.com", email_verified: false }) } });
check("login rejects unverified email", r.status === 401, r.data);
r = await call("POST", "auth/google", { body: { credential: await idToken({ sub: "g1", email: "An@Gmail.com", name: "An", picture: "https://x/p.png" }) } });
check("login ok + cookie", r.status === 200 && r.data.user.email === "an@gmail.com" && /__Host-meai_session=.+HttpOnly; Secure; SameSite=Lax/.test(r.setCookie), r);
check("new account has no plan", r.data.plan === null, r.data);
r = await call("GET", "me");
check("me with cookie", r.status === 200 && r.data.user.id === "g1", r);

// Đơn hàng
r = await call("POST", "orders", { body: { planId: "nope" } });
check("order rejects bad plan", r.status === 400, r.data);
r = await call("POST", "orders", { body: { planId: "year" } });
const order = r.data.order;
check("order created with VietQR", r.status === 200 && /^MEAI[A-Z2-9]{6}$/.test(order.code) && order.amount === 2990000 && order.payment?.qrUrl.includes("img.vietqr.io/image/MB-0123456789"), r.data);
r = await call("POST", "orders", { body: { planId: "year" } });
check("pending order reused", r.data.order.code === order.code, r.data);

// Webhook
r = await call("POST", "payments/webhook", { body: { content: order.code, transferAmount: 2990000 }, headers: { authorization: "Apikey wrong" }, origin: null, useCookie: false });
check("webhook rejects bad key", r.status === 401, r.data);
r = await call("POST", "payments/webhook", { body: { id: 111, content: `CT ${order.code.slice(0, 5)} ${order.code.slice(5)} chuyen tien`, transferAmount: 1000, transferType: "in" }, headers: { authorization: "Apikey hook-key" }, origin: null, useCookie: false });
check("webhook underpaid not activated", r.data.matched === false && r.data.reason === "UNDERPAID", r.data);
r = await call("POST", "payments/webhook", { body: { id: 112, content: `CT ${order.code.toLowerCase()} chuyen tien`, transferAmount: 2990000, transferType: "in" }, headers: { authorization: "Apikey hook-key" }, origin: null, useCookie: false });
check("webhook activates order", r.data.matched === true, r.data);
r = await call("POST", "payments/webhook", { body: { id: 112, content: order.code, transferAmount: 2990000 }, headers: { authorization: "Apikey hook-key" }, origin: null, useCookie: false });
check("webhook idempotent", r.data.matched === false, r.data);
r = await call("GET", "me");
check("plan = year, 365 days, 2 devices", r.data.plan?.id === "year" && r.data.plan.active && r.data.plan.daysLeft === 365 && r.data.plan.maxDevices === 2, r.data.plan);
check("order marked paid", r.data.orders[0].status === "paid" && r.data.orders[0].payment === null, r.data.orders);

// Gia hạn: cộng nối tiếp
const o2 = (await call("POST", "orders", { body: { planId: "month" } })).data.order;
r = await call("POST", "admin/grant", { body: { orderCode: o2.code }, headers: { authorization: "Bearer bad" }, origin: null, useCookie: false });
check("admin rejects bad token", r.status === 401, r.data);
r = await call("POST", "admin/grant", { body: { orderCode: o2.code }, headers: { authorization: "Bearer adm-secret" }, origin: null, useCookie: false });
check("admin marks order paid", r.data.ok === true, r.data);
r = await call("GET", "me");
check("renew keeps higher plan & adds 30 days", r.data.plan.id === "year" && r.data.plan.daysLeft === 395, r.data.plan);

// App: liên kết qua website
r = await call("POST", "app/link", { body: {} });
const linkCode = r.data.code;
check("link code issued", typeof linkCode === "string" && linkCode.length > 20, r.data);
r = await call("POST", "app/token", { body: { code: linkCode, deviceId: "bad id!", deviceName: "PC" }, origin: null, useCookie: false });
check("app/token rejects bad deviceId", r.status === 400, r.data);
r = await call("POST", "app/token", { body: { code: linkCode, deviceId: "WIN-AAAA-1111", deviceName: "PC-1" }, origin: null, useCookie: false });
const appToken = r.data.token;
check("app/token ok + entitlement", r.status === 200 && r.data.entitlement.canUse === true && r.data.entitlement.plan.id === "year" && r.data.entitlement.device === "ok", r.data);
r = await call("POST", "app/token", { body: { code: linkCode, deviceId: "WIN-AAAA-1111" }, origin: null, useCookie: false });
check("link code single-use", r.status === 400, r.data);
r = await call("GET", "app/entitlement", { headers: { authorization: "Bearer " + appToken }, origin: null, useCookie: false });
check("entitlement via app token", r.data.canUse === true && r.data.user.email === "an@gmail.com", r.data);

// App: đăng nhập Google trực tiếp (Client ID desktop), máy thứ 2 và thứ 3
r = await call("POST", "app/google", { body: { idToken: await idToken({ sub: "g1", email: "an@gmail.com", aud: "desk-client" }), deviceId: "WIN-BBBB-2222", deviceName: "PC-2" }, origin: null, useCookie: false });
check("app/google device 2 ok", r.data.entitlement?.device === "ok", r.data);
r = await call("POST", "app/google", { body: { idToken: await idToken({ sub: "g1", email: "an@gmail.com", aud: "desk-client" }), deviceId: "WIN-CCCC-3333", deviceName: "PC-3" }, origin: null, useCookie: false });
check("device limit enforced (year = 2)", r.data.entitlement?.device === "limit" && r.data.entitlement.canUse === false, r.data);

// Gỡ máy trên web → app trên máy đó bị đăng xuất
r = await call("DELETE", "devices/WIN-AAAA-1111");
check("device removed", r.data.devices.length === 1, r.data.devices);
r = await call("GET", "app/entitlement", { headers: { authorization: "Bearer " + appToken }, origin: null, useCookie: false });
check("removed device app session revoked", r.status === 401, r.data);

// Admin cấp gói theo email
r = await call("POST", "admin/grant", { body: { email: "AN@gmail.com", planId: "lifetime" }, headers: { authorization: "Bearer adm-secret" }, origin: null, useCookie: false });
check("admin grant lifetime", r.data.plan?.id === "lifetime" && r.data.plan.expiresAt === null && r.data.plan.maxDevices === 5, r.data);
r = await call("POST", "admin/grant", { body: { email: "nobody@gmail.com", planId: "month" }, headers: { authorization: "Bearer adm-secret" }, origin: null, useCookie: false });
check("admin grant unknown email 404", r.status === 404, r.data);

// Đăng xuất
r = await call("POST", "auth/logout", { body: {} });
check("logout clears cookie", /Max-Age=0/.test(r.setCookie), r);
cookie = "";
r = await call("GET", "me");
check("me after logout 401", r.status === 401, r.data);
r = await handleApi(new Request(ORIGIN + "/api/me"), { }, { fetcher });
check("no DB → 503 NOT_CONFIGURED", r.status === 503, await r.json());

console.log(fails ? `\n${fails} FAILED` : "\nALL PASSED");
process.exit(fails ? 1 : 0);
