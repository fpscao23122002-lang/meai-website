import { useEffect, useRef, useState } from "react";

export type ScriptCtx = {
  /** Chờ ms mili-giây; tự huỷ khi component ẩn/unmount */
  wait: (ms: number) => Promise<void>;
  /** Gõ chữ từng ký tự vào setter */
  type: (text: string, set: (v: string) => void, speed?: number) => Promise<void>;
};

const CANCEL = Symbol("cancel");

/**
 * Chạy một "kịch bản hoạt cảnh" lặp vô hạn khi `play` = true (thường là khi đang hiển thị trên màn hình).
 * Dừng ngay và dọn dẹp khi `play` = false hoặc component bị huỷ.
 */
export function useScript(play: boolean, script: (ctx: ScriptCtx) => Promise<void>) {
  const scriptRef = useRef(script);
  scriptRef.current = script;

  useEffect(() => {
    if (!play) return;
    let alive = true;
    const timers = new Set<number>();
    const wait = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        const t = window.setTimeout(() => {
          timers.delete(t);
          if (alive) resolve();
          else reject(CANCEL);
        }, ms);
        timers.add(t);
      });
    const type = async (text: string, set: (v: string) => void, speed = 22) => {
      for (let i = 1; i <= text.length; i++) {
        set(text.slice(0, i));
        await wait(text[i - 1] === "\n" ? speed * 4 : speed);
      }
    };
    (async () => {
      try {
        while (alive) await scriptRef.current({ wait, type });
      } catch (e) {
        if (e !== CANCEL) throw e;
      }
    })();
    return () => {
      alive = false;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [play]);
}

/**
 * Điều khiển demo tự chạy: `active` = đang hiển thị và người dùng chưa chạm vào.
 * `takeOver` chuyển sang chế độ người dùng tự thao tác; `replay` chạy lại demo từ đầu.
 */
export function useDemoControl(visible: boolean) {
  const [user, setUser] = useState(false);
  return {
    user,
    active: visible && !user,
    takeOver: () => setUser(true),
    replay: () => setUser(false),
  };
}

/**
 * Chạy một chuỗi hành động có thời gian chờ khi người dùng bấm nút (VD: "Đưa vào hàng đợi").
 * Gọi lại `start` sẽ huỷ chuỗi đang chạy; tự huỷ khi component unmount.
 */
export function useTask() {
  const gen = useRef(0);
  useEffect(() => {
    const g = gen;
    return () => {
      g.current++;
    };
  }, []);
  return (fn: (wait: (ms: number) => Promise<void>) => Promise<void>) => {
    const my = ++gen.current;
    const wait = (ms: number) =>
      new Promise<void>((resolve, reject) => window.setTimeout(() => (gen.current === my ? resolve() : reject(CANCEL)), ms));
    fn(wait).catch((e) => {
      if (e !== CANCEL) throw e;
    });
  };
}
