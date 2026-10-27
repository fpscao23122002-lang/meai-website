import { StudioMock } from "./StudioMock";
import { TuLieuMock } from "./screens/TuLieuMock";
import { KichBanMock } from "./screens/KichBanMock";
import { ThuVienMock } from "./screens/ThuVienMock";
import { TaiKhoanMock } from "./screens/TaiKhoanMock";
import { LadiPageMock } from "./screens/LadiPageMock";
import { DangReelsMock } from "./screens/DangReelsMock";
import { CaiDatMock } from "./screens/CaiDatMock";
import type { EngineId } from "@/lib/data";
import type { Kind } from "@/lib/studioConfig";

const STUDIO_TABS: { engine: EngineId; kind: Kind }[] = [
  { engine: "muse", kind: "image" },
  { engine: "muse", kind: "video" },
  { engine: "flow", kind: "image" },
  { engine: "flow", kind: "video" },
  { engine: "seedance", kind: "video" },
];

/** Chọn bản dựng màn hình app theo id menu */
export function ScreenMock({ id, shotIdx = 0, play }: { id: string; shotIdx?: number; play: boolean }) {
  switch (id) {
    case "studio":
      return <StudioMock key={shotIdx} fixedEngine={STUDIO_TABS[shotIdx] ?? STUDIO_TABS[0]} />;
    case "tu-lieu":
      return <TuLieuMock play={play} />;
    case "kich-ban":
      return <KichBanMock play={play} />;
    case "thu-vien":
      return <ThuVienMock play={play} />;
    case "tai-khoan":
      return <TaiKhoanMock play={play} />;
    case "ladipage":
      return <LadiPageMock play={play} />;
    case "dang-reels":
      return <DangReelsMock play={play} />;
    case "cai-dat":
      return <CaiDatMock play={play} />;
    default:
      return null;
  }
}
