import { createContext } from "react";
import { Clapperboard, LayoutGrid, Search, Settings, Sparkles, UserRound, Users, Volume2 } from "lucide-react";

/** Menu bên trái của app (đúng thứ tự trong app) */
export const SIDEBAR = [
  { id: "studio", label: "Studio", Icon: Sparkles },
  { id: "tu-lieu", label: "Tư liệu", Icon: UserRound },
  { id: "kich-ban", label: "Kịch bản", Icon: Clapperboard },
  { id: "thu-vien", label: "Thư viện", Icon: LayoutGrid },
  { id: "tai-khoan", label: "Tài khoản", Icon: Users },
  { id: "ladipage", label: "LadiPage", Icon: Search },
  { id: "dang-reels", label: "Đăng FB Reels", Icon: Volume2 },
  { id: "cai-dat", label: "Cài đặt", Icon: Settings },
];

/** Tính toạ độ phần tử con so với khung chứa (để con trỏ ảo bay tới) */
export function pointTo(container: HTMLElement | null, target: HTMLElement | null) {
  if (!container || !target) return null;
  const c = container.getBoundingClientRect();
  const t = target.getBoundingClientRect();
  return { x: t.left - c.left + t.width * 0.55, y: t.top - c.top + t.height * 0.6 };
}

/** Khi đặt true, AppFrame chỉ hiển thị nội dung (dùng bên trong khung demo đã có thanh tiêu đề & menu riêng) */
export const BareFrame = createContext(false);
