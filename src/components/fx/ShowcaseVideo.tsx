import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/cn";

/** Chỉ một video được bật tiếng tại một thời điểm */
const SOUND_EVENT = "meai:video-sound";

/**
 * Video thành phẩm 9:16 trên web: chỉ tải & phát khi cuộn tới (tự dừng khi ra khỏi màn hình để giữ FPS),
 * lặp lại, tắt tiếng mặc định — bấm nút loa để nghe. Có ảnh poster hiện ngay, tôn trọng "Giảm chuyển động".
 */
export function ShowcaseVideo({ src, poster, label, className }: { src: string; poster: string; label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const userPausedRef = useRef(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      userPausedRef.current = true;
      setUserPaused(true);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio >= 0.35) {
          if (v.preload !== "auto") v.preload = "auto";
          if (!userPausedRef.current) void v.play().catch(() => undefined);
        } else {
          v.pause();
        }
      },
      { threshold: [0, 0.35] },
    );
    io.observe(v);
    const onSound = (e: Event) => {
      if ((e as CustomEvent<HTMLVideoElement>).detail !== v) {
        v.muted = true;
        setMuted(true);
      }
    };
    window.addEventListener(SOUND_EVENT, onSound);
    return () => {
      io.disconnect();
      window.removeEventListener(SOUND_EVENT, onSound);
    };
  }, []);

  const toggleSound = () => {
    const v = ref.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
    setMuted(next);
    if (!next) {
      window.dispatchEvent(new CustomEvent(SOUND_EVENT, { detail: v }));
      if (v.paused) {
        userPausedRef.current = false;
        setUserPaused(false);
        void v.play().catch(() => undefined);
      }
    }
  };

  const togglePlay = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      userPausedRef.current = false;
      setUserPaused(false);
      void v.play().catch(() => undefined);
    } else {
      userPausedRef.current = true;
      setUserPaused(true);
      v.pause();
    }
  };

  return (
    <figure className={cn("group relative aspect-[9/16] overflow-hidden rounded-2xl bg-black ring-1 ring-white/10", className)}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onClick={togglePlay}
        aria-label={label}
        className="absolute inset-0 h-full w-full cursor-pointer object-cover"
      />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/75 to-transparent" />
      <figcaption className="pointer-events-none absolute inset-x-2.5 bottom-2.5 text-[11px] font-semibold leading-tight text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.8)] sm:text-xs">
        {label}
      </figcaption>
      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? `Bật tiếng: ${label}` : `Tắt tiếng: ${label}`}
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white ring-1 ring-white/20 transition hover:bg-black/80"
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-cyan-glow" />}
      </button>
      {!playing && userPaused ? (
        <button
          type="button"
          onClick={togglePlay}
          aria-label={`Phát: ${label}`}
          className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-black/50 ring-1 ring-white/40 transition hover:bg-black/70"
        >
          <Play className="h-5 w-5 fill-white text-white" />
        </button>
      ) : null}
      {playing ? (
        <span className="pointer-events-none absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-semibold text-white opacity-0 ring-1 ring-white/15 transition-opacity group-hover:opacity-100">
          <Pause className="h-3 w-3" /> Chạm để dừng
        </span>
      ) : null}
    </figure>
  );
}
