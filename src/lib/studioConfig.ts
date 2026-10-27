/** Tuỳ chọn panel trái của Studio theo từng engine — đúng như trong app */

export type Kind = "image" | "video";
export type Seg = { key: string; label: string; options: string[] };
export type ToggleDef = { key: string; label: string; hint?: string };
export type ConfigDef = {
  model?: string;
  segs: Seg[];
  toggles: ToggleDef[];
  refs?: "reference" | "firstLast";
  perPrompt?: boolean;
  seed?: boolean;
};
export type OptValue = string | boolean;

export const R5 = ["9:16", "16:9", "1:1", "4:3", "3:4"];

export const CONFIGS: Record<string, ConfigDef> = {
  "muse-image": {
    segs: [{ key: "ratio", label: "Tỉ lệ", options: R5 }],
    toggles: [
      { key: "nguoiMau", label: "Người mẫu", hint: "từ Tư liệu" },
      { key: "luanPhien", label: "Ảnh luân phiên", hint: "từ Tư liệu" },
    ],
    refs: "reference",
    perPrompt: true,
  },
  "muse-video": {
    segs: [{ key: "ratio", label: "Tỉ lệ", options: R5 }],
    toggles: [
      { key: "nguoiMau", label: "Người mẫu", hint: "từ Tư liệu" },
      { key: "luanPhien", label: "Ảnh luân phiên", hint: "từ Tư liệu" },
    ],
    refs: "reference",
  },
  "flow-image": {
    model: "Nano Banana 2 Lite",
    segs: [
      { key: "ratio", label: "Tỷ lệ ảnh", options: R5 },
      { key: "res", label: "Độ phân giải", options: ["1K", "2K", "4K"] },
    ],
    toggles: [{ key: "wm", label: "Xóa logo / watermark" }],
    refs: "firstLast",
  },
  "flow-video": {
    model: "Omni 1.1 Flash (Linh hoạt)",
    segs: [
      { key: "ratio", label: "Tỷ lệ video", options: ["16:9", "9:16"] },
      { key: "quality", label: "Chất lượng", options: ["720p", "1080p", "4K"] },
      { key: "duration", label: "Thời lượng", options: ["4s", "6s", "8s"] },
    ],
    toggles: [{ key: "wm", label: "Xóa logo / watermark" }],
    refs: "firstLast",
  },
  "seedance-video": {
    model: "Seedance Pro",
    segs: [
      { key: "mode", label: "Chế độ", options: ["Text → Video", "Ảnh → Video", "Đầu–cuối"] },
      { key: "res", label: "Độ phân giải", options: ["480p", "720p", "1080p"] },
      { key: "duration", label: "Thời lượng", options: ["5s", "10s"] },
      { key: "ratio", label: "Tỷ lệ", options: ["16:9", "9:16", "1:1", "4:3", "3:4", "21:9"] },
    ],
    toggles: [
      { key: "audio", label: "Tạo âm thanh", hint: "nếu model hỗ trợ" },
      { key: "camera", label: "Cố định camera" },
      { key: "wm", label: "Xóa watermark" },
    ],
    seed: true,
  },
};

export const DEFAULT_OPTS: Record<string, Record<string, OptValue>> = {
  "muse-image": { ratio: "16:9", nguoiMau: false, luanPhien: false, perPrompt: "1" },
  "muse-video": { ratio: "9:16", nguoiMau: false, luanPhien: false },
  "flow-image": { ratio: "16:9", res: "2K", wm: true },
  "flow-video": { ratio: "16:9", quality: "4K", duration: "8s", wm: true },
  "seedance-video": { mode: "Text → Video", res: "720p", duration: "5s", ratio: "16:9", audio: false, camera: false, wm: true },
};
