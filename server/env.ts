/** Biến môi trường / binding của Cloudflare Pages (Settings → Variables and Secrets, wrangler.toml) */
export interface Env {
  /** D1 database lưu tài khoản (binding "DB" trong wrangler.toml) */
  DB?: D1Database;
  /** OAuth Client ID loại "Web application" dùng cho nút Đăng nhập Google trên website */
  GOOGLE_CLIENT_ID?: string;
  /** (Tuỳ chọn) Client ID loại "Desktop app", phân tách bằng dấu phẩy — nếu app tự đăng nhập Google và gửi ID token */
  GOOGLE_DESKTOP_CLIENT_IDS?: string;
  /** Token quản trị để kích hoạt gói thủ công: Authorization: Bearer <ADMIN_TOKEN> */
  ADMIN_TOKEN?: string;
  /** Khoá webhook đối soát chuyển khoản tự động (VD: SePay gửi "Authorization: Apikey <khoá>") */
  PAYMENT_WEBHOOK_KEY?: string;
  /** Thông tin nhận chuyển khoản để hiện mã VietQR (mã ngân hàng theo VietQR, VD: MB, VCB, TCB) */
  BANK_ID?: string;
  BANK_ACCOUNT?: string;
  BANK_ACCOUNT_NAME?: string;
}
