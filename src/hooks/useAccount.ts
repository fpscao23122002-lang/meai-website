import { useCallback, useEffect, useState } from "react";
import type { PlanId } from "../../shared/plans";
import { ApiError, demoApi, getSiteConfig, liveApi, type Account, type SiteConfig } from "@/lib/account";

export type AccountMode = "live" | "demo";

const DEMO_FLAG = "meai-demo-active";
const readDemoFlag = () => {
  try {
    return window.sessionStorage.getItem(DEMO_FLAG) === "1";
  } catch {
    return false;
  }
};
const writeDemoFlag = (on: boolean) => {
  try {
    if (on) window.sessionStorage.setItem(DEMO_FLAG, "1");
    else window.sessionStorage.removeItem(DEMO_FLAG);
  } catch {
    /* storage bị chặn */
  }
};

/**
 * Trạng thái đăng nhập & dữ liệu tài khoản dùng chung cho Khu vực khách hàng và trang kết nối app.
 * - Đăng nhập thật bằng Google (API + D1) là luồng chính.
 * - "Tài khoản demo" là lựa chọn phụ: dữ liệu mô phỏng trên trình duyệt, tách biệt hoàn toàn với tài khoản thật.
 */
export function useAccount() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [demo, setDemo] = useState(false);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mode: AccountMode = demo ? "demo" : "live";
  const configured = Boolean(config?.configured);

  useEffect(() => {
    let alive = true;
    (async () => {
      const cfg = await getSiteConfig();
      const demoOn = readDemoFlag();
      let acc: Account | null = null;
      if (demoOn) {
        acc = (await demoApi.me()) ?? (await demoApi.login());
      } else if (cfg.configured) {
        try {
          acc = await liveApi.me();
        } catch (e) {
          if (!(e instanceof ApiError && e.status === 401)) setError(e instanceof Error ? e.message : String(e));
        }
      }
      if (!alive) return;
      setConfig(cfg);
      setDemo(demoOn);
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

  /** Thoát tài khoản demo, quay về đăng nhập Google thật */
  const exitDemo = useCallback(async () => {
    await demoApi.logout();
    writeDemoFlag(false);
    setDemo(false);
    setError(null);
    let acc: Account | null = null;
    if (configured) acc = await liveApi.me().catch(() => null);
    setAccount(acc);
  }, [configured]);

  const live = !demo;

  return {
    ready,
    mode,
    /** Backend tài khoản thật đã bật (có D1 + GOOGLE_CLIENT_ID) */
    configured,
    config,
    account,
    busy,
    error,
    clearError: () => setError(null),
    loginWithGoogle: (credential: string) => run(() => liveApi.loginWithGoogle(credential), (a) => a),
    /** Vào xem tài khoản demo (không cần đăng nhập) */
    enterDemo: () =>
      run(async () => {
        writeDemoFlag(true);
        setDemo(true);
        return demoApi.login();
      }, (a) => a),
    exitDemo,
    logout: () => (demo ? exitDemo() : run<unknown>(() => liveApi.logout(), () => null)),
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
