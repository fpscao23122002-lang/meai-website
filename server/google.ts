import { base64urlDecode } from "./crypto";

/**
 * Xác minh Google ID token (JWT RS256) hoàn toàn phía server:
 * chữ ký theo khoá công khai của Google, issuer, audience (Client ID của MeAI), hạn dùng và email đã xác minh.
 */
export type GoogleProfile = { sub: string; email: string; name: string | null; picture: string | null };

type Jwk = JsonWebKey & { kid: string };
const JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";
let cache: { keys: Jwk[]; until: number } | null = null;

export type JwksFetcher = () => Promise<{ keys: Jwk[]; maxAgeSec: number }>;

const defaultFetcher: JwksFetcher = async () => {
  const res = await fetch(JWKS_URL);
  if (!res.ok) throw new Error(`Không tải được khoá Google (${res.status})`);
  const maxAge = Number(/max-age=(\d+)/.exec(res.headers.get("cache-control") ?? "")?.[1] ?? 3600);
  const body = (await res.json()) as { keys: Jwk[] };
  return { keys: body.keys, maxAgeSec: maxAge };
};

async function getKey(kid: string, fetcher: JwksFetcher, now: number) {
  if (!cache || cache.until < now || !cache.keys.some((k) => k.kid === kid)) {
    const { keys, maxAgeSec } = await fetcher();
    cache = { keys, until: now + maxAgeSec * 1000 };
  }
  const jwk = cache.keys.find((k) => k.kid === kid);
  if (!jwk) throw new GoogleTokenError("Khoá ký không hợp lệ");
  return crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
}

export class GoogleTokenError extends Error {}

export async function verifyGoogleIdToken(
  token: string,
  audiences: string[],
  opts: { fetcher?: JwksFetcher; now?: number } = {},
): Promise<GoogleProfile> {
  const now = opts.now ?? Date.now();
  const parts = token.split(".");
  if (parts.length !== 3) throw new GoogleTokenError("Token không đúng định dạng");
  const dec = new TextDecoder();
  let header: { alg?: string; kid?: string };
  let payload: Record<string, unknown>;
  try {
    header = JSON.parse(dec.decode(base64urlDecode(parts[0])));
    payload = JSON.parse(dec.decode(base64urlDecode(parts[1])));
  } catch {
    throw new GoogleTokenError("Token không đúng định dạng");
  }
  if (header.alg !== "RS256" || !header.kid) throw new GoogleTokenError("Thuật toán ký không được hỗ trợ");

  const key = await getKey(header.kid, opts.fetcher ?? defaultFetcher, now);
  const ok = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    base64urlDecode(parts[2]),
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
  );
  if (!ok) throw new GoogleTokenError("Chữ ký không hợp lệ");

  const skew = 60;
  const nowSec = Math.floor(now / 1000);
  if (payload.iss !== "accounts.google.com" && payload.iss !== "https://accounts.google.com")
    throw new GoogleTokenError("Issuer không hợp lệ");
  if (typeof payload.aud !== "string" || !audiences.includes(payload.aud)) throw new GoogleTokenError("Token không dành cho MeAI");
  if (typeof payload.exp !== "number" || payload.exp + skew < nowSec) throw new GoogleTokenError("Token đã hết hạn");
  if (typeof payload.iat === "number" && payload.iat - skew > nowSec) throw new GoogleTokenError("Token chưa có hiệu lực");
  if (typeof payload.sub !== "string" || typeof payload.email !== "string") throw new GoogleTokenError("Thiếu thông tin tài khoản");
  if (payload.email_verified !== true && payload.email_verified !== "true")
    throw new GoogleTokenError("Email Google chưa được xác minh");

  return {
    sub: payload.sub,
    email: payload.email.toLowerCase(),
    name: typeof payload.name === "string" ? payload.name : null,
    picture: typeof payload.picture === "string" ? payload.picture : null,
  };
}

/** Chỉ dùng cho kiểm thử */
export function _resetJwksCache() {
  cache = null;
}
