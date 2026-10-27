import { useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";

type GsiButtonOptions = {
  type?: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape?: "rectangular" | "pill" | "circle" | "square";
  logo_alignment?: "left" | "center";
  width?: number;
  locale?: string;
};
type Gsi = {
  accounts: {
    id: {
      initialize: (o: {
        client_id: string;
        callback: (r: { credential: string }) => void;
        ux_mode?: "popup" | "redirect";
        auto_select?: boolean;
        cancel_on_tap_outside?: boolean;
        use_fedcm_for_prompt?: boolean;
      }) => void;
      renderButton: (el: HTMLElement, o: GsiButtonOptions) => void;
      disableAutoSelect: () => void;
    };
  };
};
declare global {
  interface Window {
    google?: Gsi;
  }
}

let gsiPromise: Promise<Gsi> | null = null;
/** Tải thư viện Google Identity Services một lần */
function loadGsi() {
  gsiPromise ??= new Promise<Gsi>((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve(window.google);
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = () => (window.google ? resolve(window.google) : reject(new Error("GSI")));
    s.onerror = () => {
      gsiPromise = null;
      reject(new Error("Không tải được Google Sign-In"));
    };
    document.head.appendChild(s);
  });
  return gsiPromise;
}

export function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className}>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.5z" />
    </svg>
  );
}

/**
 * Nút "Đăng nhập với Google".
 * - Có clientId: nút chính thức của Google (popup chọn tài khoản), trả về ID token để server xác minh.
 * - Chưa có (hệ thống tài khoản chưa bật trên website): nút cùng kiểu dáng, bấm vào báo chưa sẵn sàng.
 */
export function GoogleSignIn({
  clientId,
  onCredential,
  busy,
}: {
  clientId: string | null;
  onCredential: (credential: string) => void;
  busy?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "failed">(clientId ? "loading" : "ready");
  const [notReady, setNotReady] = useState(false);
  const cb = useRef(onCredential);
  cb.current = onCredential;

  useEffect(() => {
    if (!clientId) return;
    let alive = true;
    let ro: ResizeObserver | null = null;
    const el = ref.current;
    loadGsi()
      .then((g) => {
        if (!alive || !el) return;
        g.accounts.id.initialize({
          client_id: clientId,
          callback: (r) => cb.current(r.credential),
          ux_mode: "popup",
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        const draw = () => {
          el.innerHTML = "";
          g.accounts.id.renderButton(el, {
            type: "standard",
            theme: "filled_black",
            size: "large",
            text: "continue_with",
            shape: "pill",
            logo_alignment: "center",
            width: Math.max(220, Math.min(400, Math.floor(el.parentElement?.clientWidth ?? 320))),
            locale: "vi",
          });
        };
        draw();
        setState("ready");
        // Nút của Google có chiều rộng cố định → vẽ lại khi khung đổi kích thước (xoay màn hình, đổi cửa sổ)
        let lastW = el.parentElement?.clientWidth ?? 0;
        ro = new ResizeObserver(() => {
          const w = el.parentElement?.clientWidth ?? 0;
          if (Math.abs(w - lastW) > 8) {
            lastW = w;
            draw();
          }
        });
        if (el.parentElement) ro.observe(el.parentElement);
      })
      .catch(() => alive && setState("failed"));
    return () => {
      alive = false;
      ro?.disconnect();
    };
  }, [clientId]);

  if (!clientId) {
    return (
      <div className="w-full">
        <button
          type="button"
          onClick={() => setNotReady(true)}
          className="group relative flex h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-white text-sm font-semibold text-slate-800 shadow-[0_10px_30px_-12px_rgba(255,255,255,0.45)] transition hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <span className="absolute inset-y-0 left-0 w-1/3 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-slate-200/70 to-transparent transition-transform duration-700 group-hover:translate-x-[400%]" />
          <GoogleLogo className="h-5 w-5" />
          Tiếp tục với Google
        </button>
        {notReady ? (
          <p role="status" className="mt-3 rounded-xl border border-amber-300/25 bg-amber-300/10 px-3 py-2 text-center text-xs leading-5 text-amber-100">
            Đăng nhập Google đang được kích hoạt cho website này. Bạn có thể xem tài khoản demo bên dưới, hoặc nhắn Telegram để được hỗ trợ.
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[44px] w-full justify-center">
      {/* color-scheme light: trang dùng nền tối nên iframe của Google sẽ bị phủ nền trắng nếu không đặt lại */}
      <div
        ref={ref}
        style={{ colorScheme: "light" }}
        className={cn("flex w-full justify-center transition-opacity", (state !== "ready" || busy) && "opacity-0")}
      />
      {state === "loading" || busy ? (
        <span className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-slate-400">
          <LoaderCircle className="h-4 w-4 animate-spin" /> {busy ? "Đang đăng nhập…" : "Đang tải Google…"}
        </span>
      ) : null}
      {state === "failed" ? (
        <p className="absolute inset-0 flex items-center justify-center text-center text-sm text-rose-400">
          Không tải được Google Sign-In. Kiểm tra mạng / tắt chặn quảng cáo rồi tải lại trang.
        </p>
      ) : null}
    </div>
  );
}
