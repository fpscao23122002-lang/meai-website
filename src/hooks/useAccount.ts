import { useCallback, useEffect, useState } from "react";
import type { PlanId } from "../../shared/plans";
import { ApiError, demoApi, getSiteConfig, liveApi, type Account, type SiteConfig } from "@/lib/account";

export type AccountMode = "live" | "demo";

/**
 * Trạng thái đăng nhập & dữ liệu tài khoản dùng chung cho Khu vực khách hàng và trang kết nối app.
 * "live": API thật (Google + D1). "demo": backend chưa cấu hình → dữ liệu mô phỏng trên trình duyệt.
 */
export function useAccount() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mode: AccountMode = config?.configured ? "live" : "demo";

  useEffect(() => {
    let alive = true;
    (async () => {
      const cfg = await getSiteConfig();
      let acc: Account | null = null;
      if (cfg.configured) {
        try {
          acc = await liveApi.me();
        } catch (e) {
          if (!(e instanceof ApiError && e.status === 401)) setError(e instanceof Error ? e.message : String(e));
        }
      } else {
        acc = await demoApi.me();
      }
      if (!alive) return;
      setConfig(cfg);
      setAccount(acc);
      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  /** Chạy một thao tác, cập nhật tài khoản & báo lỗi thống nhất */
  const run = useCallback(async <T,>(fn: () => Promise<T>, apply?: (r: T) => Account | null): Promise<T | undefined> => {
    setBusy(true);
    setError(null);
    try {
      const r = await fn();
      if (apply) setAccount(apply(r));
      return r;
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) setAccount(null);
      setError(e instanceof Error ? e.message : String(e));
      return undefined;
    } finally {
      setBusy(false);
    }
  }, []);

  const live = mode === "live";

  return {
    ready,
    mode,
    config,
    account,
    busy,
    error,
    clearError: () => setError(null),
    loginWithGoogle: (credential: string) => run(() => liveApi.loginWithGoogle(credential), (a) => a),
    loginDemo: () => run(() => demoApi.login(), (a) => a),
    logout: () => run<unknown>(() => (live ? liveApi.logout() : demoApi.logout()), () => null),
    /** Làm mới im lặng (dùng khi chờ thanh toán) */
    refresh: useCallback(async () => {
      try {
        const a = live ? await liveApi.me() : await demoApi.me();
        setAccount(a);
        return a;
      } catch {
        return null;
      }
    }, [live]),
    createOrder: (planId: PlanId) => run(() => (live ? liveApi.createOrder(planId) : demoApi.createOrder(planId)), (r) => r.account),
    cancelOrder: (code: string) => run(() => (live ? liveApi.cancelOrder(code) : demoApi.cancelOrder(code)), (a) => a),
    removeDevice: (id: string) => run(() => (live ? liveApi.removeDevice(id) : demoApi.removeDevice(id)), (a) => a),
    simulatePaid: (code: string) => run(() => demoApi.simulatePaid(code), (a) => a),
    createAppLink: () => run(() => liveApi.createAppLink()),
  };
}

export type AccountState = ReturnType<typeof useAccount>;
