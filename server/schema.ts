/**
 * Lược đồ D1 — tự tạo bảng ở lần gọi API đầu tiên (CREATE … IF NOT EXISTS), nên chỉ cần tạo database
 * và gắn binding DB là chạy, không phải chạy migration bằng dòng lệnh.
 * Giữ đồng bộ với migrations/0001_accounts.sql (npm run test:api kiểm tra hai bên khớp nhau).
 */
export const SCHEMA: string[] = [
  "CREATE TABLE IF NOT EXISTS users ( id TEXT PRIMARY KEY, email TEXT NOT NULL, name TEXT, picture TEXT, created_at INTEGER NOT NULL, last_login_at INTEGER NOT NULL )",
  "CREATE INDEX IF NOT EXISTS users_email ON users (email)",
  "CREATE TABLE IF NOT EXISTS subscriptions ( user_id TEXT PRIMARY KEY REFERENCES users (id), plan_id TEXT NOT NULL, started_at INTEGER NOT NULL, expires_at INTEGER, updated_at INTEGER NOT NULL )",
  "CREATE TABLE IF NOT EXISTS sessions ( token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users (id), kind TEXT NOT NULL, device_id TEXT, created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL )",
  "CREATE INDEX IF NOT EXISTS sessions_user ON sessions (user_id)",
  "CREATE TABLE IF NOT EXISTS devices ( user_id TEXT NOT NULL REFERENCES users (id), device_id TEXT NOT NULL, name TEXT, first_seen INTEGER NOT NULL, last_seen INTEGER NOT NULL, PRIMARY KEY (user_id, device_id) )",
  "CREATE TABLE IF NOT EXISTS orders ( code TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users (id), plan_id TEXT NOT NULL, amount INTEGER NOT NULL, status TEXT NOT NULL, source TEXT NOT NULL, created_at INTEGER NOT NULL, paid_at INTEGER, payment_ref TEXT UNIQUE )",
  "CREATE INDEX IF NOT EXISTS orders_user ON orders (user_id, created_at)",
  "CREATE TABLE IF NOT EXISTS app_link_codes ( code_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users (id), expires_at INTEGER NOT NULL )",
];

let ready: Promise<void> | null = null;

export function ensureSchema(db: D1Database) {
  ready ??= db
    .batch(SCHEMA.map((s) => db.prepare(s)))
    .then(() => undefined)
    .catch((e) => {
      ready = null; // thử lại ở yêu cầu sau
      throw e;
    });
  return ready;
}
