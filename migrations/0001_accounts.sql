-- Tài khoản MeAI: định danh duy nhất bằng tài khoản Google (claim "sub" trong Google ID token).
-- Áp dụng: npx wrangler d1 migrations apply meai --remote

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,          -- Google "sub" (không đổi kể cả khi người dùng đổi Gmail)
  email         TEXT NOT NULL,
  name          TEXT,
  picture       TEXT,
  created_at    INTEGER NOT NULL,          -- epoch ms
  last_login_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS users_email ON users (email);

-- Gói đang dùng của mỗi tài khoản (1 dòng / tài khoản). expires_at NULL = vĩnh viễn.
CREATE TABLE IF NOT EXISTS subscriptions (
  user_id    TEXT PRIMARY KEY REFERENCES users (id),
  plan_id    TEXT NOT NULL,
  started_at INTEGER NOT NULL,
  expires_at INTEGER,
  updated_at INTEGER NOT NULL
);

-- Phiên đăng nhập: "web" (cookie trên website) hoặc "app" (token của app desktop, gắn với 1 máy).
-- Chỉ lưu SHA-256 của token, không lưu token gốc.
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users (id),
  kind       TEXT NOT NULL,
  device_id  TEXT,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_user ON sessions (user_id);

-- Máy tính đang dùng app (giới hạn theo gói).
CREATE TABLE IF NOT EXISTS devices (
  user_id    TEXT NOT NULL REFERENCES users (id),
  device_id  TEXT NOT NULL,
  name       TEXT,
  first_seen INTEGER NOT NULL,
  last_seen  INTEGER NOT NULL,
  PRIMARY KEY (user_id, device_id)
);

-- Đơn mua gói. code nằm trong nội dung chuyển khoản để đối soát tự động.
CREATE TABLE IF NOT EXISTS orders (
  code        TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users (id),
  plan_id     TEXT NOT NULL,
  amount      INTEGER NOT NULL,
  status      TEXT NOT NULL,               -- pending | paid | cancelled
  source      TEXT NOT NULL,               -- web | app
  created_at  INTEGER NOT NULL,
  paid_at     INTEGER,
  payment_ref TEXT UNIQUE                  -- mã giao dịch ngân hàng (chống cộng gói 2 lần)
);
CREATE INDEX IF NOT EXISTS orders_user ON orders (user_id, created_at);

-- Mã dùng một lần khi app desktop đăng nhập qua trình duyệt (xem /app/connect).
CREATE TABLE IF NOT EXISTS app_link_codes (
  code_hash  TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users (id),
  expires_at INTEGER NOT NULL
);
