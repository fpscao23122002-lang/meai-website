import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, MessageCircle, Play, Send } from "lucide-react";
import { useDemoControl, useScript, useTask } from "@/hooks/useScript";
import { AppFrame, Btn, Interactive, Label, Panel, PTitle, ProgressBar } from "../atoms";
import { cn } from "@/lib/cn";

const CAPTION = "Da căng bóng chỉ sau 7 ngày ✨ Serum dưỡng trắng giá 299K, freeship toàn quốc!\n#reels #xuhuong #freeship";
const VIDEOS = ["/samples/video-3.webp", "/samples/video-1.webp", "/samples/video-5.webp"];

/** Đăng FB Reels: chọn video trong kho, viết caption, đăng qua Page Access Token */
export function DangReelsMock({ play }: { play: boolean }) {
  const [video, setVideo] = useState(-1);
  const [caption, setCaption] = useState("");
  const [upload, setUpload] = useState(-1);
  const [posted, setPosted] = useState(false);
  const [likes, setLikes] = useState(0);
  const [history, setHistory] = useState<{ video: number; text: string }[]>([]);
  const [editing, setEditing] = useState(false);
  const ctl = useDemoControl(play);
  const task = useTask();

  const post = async (wait: (ms: number) => Promise<void>) => {
    if (video < 0) setVideo(0);
    setPosted(false);
    setLikes(0);
    for (let p = 0; p <= 100; p += 8) {
      setUpload(Math.min(100, p));
      await wait(90);
    }
    setPosted(true);
    setHistory((h) => [{ video: Math.max(0, video), text: caption.split("\n")[0] || "Reels mới" }, ...h].slice(0, 3));
    for (let i = 0; i < 12; i++) {
      await wait(150);
      setLikes((l) => l + 7 + i * 3);
    }
  };

  useScript(ctl.active, async ({ wait, type }) => {
    setHistory([]);
    setVideo(-1);
    setCaption("");
    setUpload(-1);
    setPosted(false);
    setLikes(0);
    await wait(500);
    setVideo(0);
    await wait(500);
    await type(CAPTION, setCaption, 16);
    await wait(400);
    for (let p = 0; p <= 100; p += 8) {
      setUpload(Math.min(100, p));
      await wait(90);
    }
    setPosted(true);
    setHistory([{ video: 0, text: CAPTION.split("\n")[0] }]);
    for (let i = 0; i < 12; i++) {
      await wait(150);
      setLikes((l) => l + 7 + i * 3);
    }
    await wait(1600);
  });

  return (
    <Interactive user={ctl.user} onTakeOver={ctl.takeOver} onReplay={ctl.replay}>
    <AppFrame title="Đăng FB Reels" active="dang-reels">
      <div className="grid gap-2.5 md:grid-cols-[1fr_170px]">
        <div>
          <PTitle>Đăng Facebook Reels</PTitle>
          <p className="text-[10.5px] text-slate-500">Page Access Token · Graph API v20 · Fanpage: Serum Dưỡng Trắng</p>
          <Panel className="mt-2.5 space-y-2.5">
            <div>
              <Label>Video cần đăng</Label>
              <div className="mt-1 flex items-center gap-1.5">
                {VIDEOS.map((src, i) => (
                  <button
                    type="button"
                    key={src}
                    onClick={() => {
                      setVideo(i);
                      setPosted(false);
                      setUpload(-1);
                    }}
                    className={cn(
                      "relative h-14 w-10 overflow-hidden rounded-md ring-1 transition-all duration-300",
                      i === video ? "ring-2 ring-cyan-glow shadow-[0_0_14px_-2px_rgba(0,240,255,0.8)]" : "ring-white/10 opacity-60 hover:opacity-100",
                    )}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover object-top" />
                  </button>
                ))}
                <Btn className="ml-1" onClick={() => setVideo((v) => (v + 1) % VIDEOS.length)}>
                  Chọn file khác
                </Btn>
              </div>
            </div>
            <div>
              <Label>Caption</Label>
              {editing ? (
                <textarea
                  autoFocus
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  onBlur={() => setEditing(false)}
                  className="mt-1 h-[58px] w-full resize-none rounded-md border border-cyan-glow/50 bg-ink/60 px-2 py-1 text-[11px] leading-4 text-slate-200 outline-none"
                />
              ) : (
              <div
                role="textbox"
                tabIndex={0}
                onClick={() => setEditing(true)}
                onFocus={() => setEditing(true)}
                className="mt-1 h-[58px] cursor-text overflow-hidden whitespace-pre-wrap rounded-md border border-white/[0.08] bg-ink/60 px-2 py-1 text-[11px] leading-4 text-slate-200 hover:border-cyan-glow/40"
              >
                {caption ? (
                  caption.split(/(#\w+)/).map((part, i) =>
                    part.startsWith("#") ? (
                      <span key={i} className="text-cyan-glow">
                        {part}
                      </span>
                    ) : (
                      <span key={i}>{part}</span>
                    ),
                  )
                ) : (
                  <span className="text-slate-600">Tiêu đề, caption chốt đơn, hashtag…</span>
                )}
              </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500">Định dạng Reels dọc 9:16</span>
              {upload >= 0 && !posted ? <ProgressBar value={upload} className="ml-auto w-24" /> : null}
              <Btn variant="primary" className={cn(upload < 0 || posted ? "ml-auto" : "")} pressed={upload === 0} onClick={() => task(post)}>
                <Send className="h-3 w-3" /> Đăng lên Reels
              </Btn>
            </div>
          </Panel>
          <Label className="mt-2.5 text-[10px] text-slate-500">Lịch sử đăng</Label>
          <Panel className="mt-1 min-h-[38px] space-y-1.5 p-2">
            <AnimatePresence initial={false}>
              {history.length ? (
                history.map((h, i) => (
                  <motion.div
                    key={`${h.text}-${history.length - i}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-[10.5px]"
                  >
                    <img src={VIDEOS[h.video]} alt="" className="h-7 w-5 rounded object-cover" />
                    <span className="min-w-0 flex-1 truncate text-slate-200">{h.text}</span>
                    <span className="rounded-full border border-cyan-glow/50 bg-cyan-glow/10 px-1.5 text-[9.5px] font-semibold text-cyan-glow">Đã đăng</span>
                  </motion.div>
                ))
              ) : (
                <p className="text-[10.5px] text-slate-600">Chưa có bài đăng</p>
              )}
            </AnimatePresence>
          </Panel>
        </div>

        {/* Điện thoại xem trước Reel */}
        <div className="mx-auto hidden w-[150px] md:block">
          <div className="relative aspect-[9/18] overflow-hidden rounded-[22px] border-[3px] border-white/15 bg-black shadow-[0_0_40px_-10px_rgba(252,49,153,0.6)]">
            <AnimatePresence>
              {video >= 0 ? (
                <motion.img
                  key={video}
                  src={VIDEOS[video]}
                  alt=""
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 h-full w-full animate-[fx-kenburns_6s_ease-in-out_infinite] object-cover object-top"
                />
              ) : null}
            </AnimatePresence>
            <div className="absolute inset-x-0 top-0 h-1 bg-white/20">
              <div className={cn("h-full origin-left scale-x-0 bg-white", posted && "animate-[fx-fill_4s_linear_infinite]")} />
            </div>
            {!posted ? (
              <Play className="absolute inset-0 m-auto h-6 w-6 fill-white/80 text-white/80" />
            ) : null}
            <div className="absolute bottom-10 right-1.5 flex flex-col items-center gap-2 text-white">
              <span className={cn("flex flex-col items-center text-[8px]", posted && "animate-[fx-heart_1.3s_ease-in-out_infinite]")}>
                <Heart className={cn("h-4 w-4", posted && "fill-neon-pink text-neon-pink")} />
                {likes}
              </span>
              <span className="flex flex-col items-center text-[8px]">
                <MessageCircle className="h-4 w-4" />
                {Math.round(likes / 9)}
              </span>
            </div>
            <p className="absolute inset-x-2 bottom-2 line-clamp-2 text-[8px] leading-3 text-white">
              <b>Serum Dưỡng Trắng</b> {caption.split("\n")[0]}
            </p>
          </div>
        </div>
      </div>
    </AppFrame>
    </Interactive>
  );
}
