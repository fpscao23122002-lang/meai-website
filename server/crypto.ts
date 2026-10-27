const enc = new TextEncoder();

export function base64url(bytes: Uint8Array) {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function base64urlDecode(s: string) {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** Token ngẫu nhiên 256-bit (dùng cho phiên đăng nhập & mã liên kết app) */
export function randomToken() {
  return base64url(crypto.getRandomValues(new Uint8Array(32)));
}

export async function sha256(s: string) {
  return base64url(new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(s))));
}

/** So sánh chuỗi bí mật không rò rỉ thời gian */
export async function safeEqual(a: string, b: string) {
  const [ha, hb] = await Promise.all([sha256(a), sha256(b)]);
  let diff = ha.length ^ hb.length;
  for (let i = 0; i < ha.length; i++) diff |= ha.charCodeAt(i) ^ hb.charCodeAt(i);
  return diff === 0;
}

/** Mã đơn hàng ngắn, dễ gõ trong nội dung chuyển khoản: MEAI + 6 ký tự (không có 0/O/1/I) */
export function orderCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return "MEAI" + Array.from(bytes, (b) => chars[b % chars.length]).join("");
}
