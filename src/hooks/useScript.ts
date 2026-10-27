import { useEffect, useRef } from "react";

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
