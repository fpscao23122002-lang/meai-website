import type { EngineId } from "@/lib/data";

/**
 * Thành phẩm thật (video do chủ sản phẩm tạo) dùng trong các màn hình Studio dựng bằng code:
 * task xong → khung xem trước tự phát đúng video của nền tảng đó. Chia đều 8 video cho 5 nền tảng.
 */
export type Media = { video: string; poster: string; ratio: "9:16" | "16:9"; title: string };

const m = (name: string, ratio: Media["ratio"], title: string): Media => ({
  video: `/videos/${name}.mp4`,
  poster: `/videos/${name}.webp`,
  ratio,
  title,
});

export const ENGINE_MEDIA: Record<EngineId, Media[]> = {
  muse: [
    m("ugc-nuoc-hoa", "9:16", "Cô gái váy đỏ giới thiệu chai nước hoa trong cửa hàng, nói chuyện với camera"),
    m("mua-le-den-noel", "9:16", "Cây thông Noel, đèn bông tuyết và người tuyết LED lần lượt bừng sáng"),
  ],
  flow: [
    m("phim-hoi-uc", "9:16", "Người đàn ông nhìn tấm ảnh cũ sau ô kính vỡ, hồi ức cô gái giữa cánh đồng hoa"),
    m("intro-1", "16:9", "Thế giới giả tưởng: phi thuyền lao vào hố đen, rồng đen, tàu ngầm phát sáng"),
  ],
  seedance: [
    m("phim-kiem-dao", "9:16", "Hai kiếm sĩ giao đấu dưới mưa hoa anh đào, tia lửa toé khi kiếm chạm nhau"),
  ],
  kling: [
    m("ugc-thoi-trang", "9:16", "Người mẫu váy satin đen, tóc bạch kim tạo dáng trước quán cà phê phố cổ"),
    m("intro-2", "16:9", "Chiến đấu cơ giữa mây lửa, kỵ sĩ rồng, phượng hoàng bay qua rừng nấm khổng lồ"),
  ],
  dola: [
    m("mua-le-gia-dinh", "9:16", "Chú Samoyed mặc áo ông già Noel làm cả gia đình bật cười bên lò sưởi"),
  ],
};

/** Mọi thành phẩm, theo thứ tự nền tảng */
export const ALL_MEDIA: Media[] = Object.values(ENGINE_MEDIA).flat();

/** Chọn thành phẩm hợp khung hình: tỉ lệ ngang → ưu tiên video 16:9, còn lại → 9:16; i để xoay vòng giữa các video */
export function pickMedia(engine: EngineId, ratio: string, i = 0): Media {
  const list = ENGINE_MEDIA[engine];
  const [w, h] = ratio.split(":").map(Number);
  const want: Media["ratio"] = w > h ? "16:9" : "9:16";
  const fit = list.filter((x) => x.ratio === want);
  const pool = fit.length ? fit : list;
  return pool[i % pool.length];
}
