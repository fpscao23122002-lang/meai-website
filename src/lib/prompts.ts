import type { EngineId } from "@/lib/data";

/**
 * Thư viện prompt mẫu (trang /prompt-mau). Mỗi prompt ghi rõ engine & chế độ nên dùng trong MeAI.
 * Nhiều prompt trong cùng nhóm có thể chép một lượt — đã nối sẵn bằng 1 dòng trống đúng định dạng ô Prompt của Studio.
 */
export type PromptItem = {
  title: string;
  engine: EngineId;
  mode: string;
  ratio: string;
  text: string;
  tip?: string;
};

export type PromptGroup = { id: string; label: string; desc: string; items: PromptItem[] };

export const promptGroups: PromptGroup[] = [
  {
    id: "san-pham",
    label: "Quảng cáo sản phẩm",
    desc: "Cảnh sản phẩm sạch, sáng — hợp làm video Ads, ảnh bìa Shopee/TikTok Shop.",
    items: [
      {
        title: "Serum trên đá cẩm thạch",
        engine: "muse",
        mode: "Tạo video",
        ratio: "9:16",
        text: "Lọ serum thuỷ tinh đặt trên mặt đá cẩm thạch trắng, giọt nước lăn chậm trên thân chai,\nánh sáng studio dịu từ bên trái, máy quay macro xoay chậm quanh sản phẩm, không có chữ trên màn hình",
        tip: "Thêm “không có chữ trên màn hình” để nền tảng không tự chèn chữ lỗi chính tả.",
      },
      {
        title: "Cốc cà phê sáng sớm",
        engine: "flow",
        mode: "Tạo ảnh",
        ratio: "4:3",
        text: "Cốc cà phê sữa đá trên bàn gỗ cạnh cửa sổ, nắng sớm xiên qua rèm, hơi nước đọng trên thành cốc,\nphong cách ảnh quảng cáo đồ uống, độ nét cao, màu ấm",
      },
      {
        title: "Nồi chiên không dầu trong bếp",
        engine: "seedance",
        mode: "Tạo video",
        ratio: "16:9",
        text: "Nồi chiên không dầu màu đen trên bàn bếp hiện đại, khay gà rán vàng giòn được kéo ra, hơi nóng bốc lên,\nmáy quay đẩy chậm vào sản phẩm, ánh sáng bếp ấm, phong cách quảng cáo gia dụng",
      },
      {
        title: "Giày chạy bộ bay lơ lửng",
        engine: "muse",
        mode: "Tạo ảnh",
        ratio: "1:1",
        text: "Đôi giày chạy bộ màu trắng xanh lơ lửng giữa không trung, nền gradient xanh ngọc, vệt nước bắn quanh đế giày,\nánh sáng rim viền sắc nét, phong cách poster thể thao",
      },
    ],
  },
  {
    id: "ugc",
    label: "UGC · Review",
    desc: "Nhân vật nói chuyện với camera như khách thật — hợp test Ads và video affiliate.",
    items: [
      {
        title: "Cô gái review kem chống nắng",
        engine: "muse",
        mode: "Tạo video",
        ratio: "9:16",
        text: "Cô gái Việt 25 tuổi ngồi trước bàn trang điểm, cầm tuýp kem chống nắng giơ lên camera và mỉm cười,\nđèn ring light, trung cảnh, phong cách video UGC TikTok quay bằng điện thoại",
        tip: "Dùng Người mẫu cố định trong Tư liệu để cả loạt video giữ đúng một gương mặt.",
      },
      {
        title: "Mở hộp đơn hàng",
        engine: "seedance",
        mode: "Tạo video",
        ratio: "9:16",
        text: "Góc quay từ trên xuống, đôi tay mở hộp carton đơn hàng trên bàn gỗ, lấy ra chiếc tai nghe không dây màu trắng,\nánh sáng tự nhiên, cảm giác chân thực như video unboxing",
      },
      {
        title: "Chú lớn tuổi khoe áo mới",
        engine: "muse",
        mode: "Tạo video",
        ratio: "9:16",
        text: "Người đàn ông 60 tuổi tóc bạc mặc áo thun xám đứng trong tủ quần áo gỗ,\ncầm chiếc áo mới giơ lên camera, mỉm cười hài lòng, ánh sáng ấm, trung cảnh",
      },
    ],
  },
  {
    id: "thoi-trang",
    label: "Thời trang · Người mẫu",
    desc: "Lookbook, phối đồ, ảnh mẫu mặc sản phẩm cho shop thời trang.",
    items: [
      {
        title: "Áo dài phố cổ",
        engine: "flow",
        mode: "Tạo ảnh",
        ratio: "3:4",
        text: "Cô gái mặc áo dài trắng đi bộ trên phố cổ Hội An lúc hoàng hôn, đèn lồng đỏ hai bên,\nảnh toàn thân, ống kính 85mm, hậu cảnh mờ, màu điện ảnh",
      },
      {
        title: "Lookbook streetwear",
        engine: "muse",
        mode: "Tạo ảnh",
        ratio: "9:16",
        text: "Chàng trai 22 tuổi mặc áo hoodie oversize và quần cargo, đứng trước bức tường graffiti,\nánh sáng chiều, góc máy thấp, phong cách lookbook đường phố",
        tip: "Bật Ảnh luân phiên với ảnh sản phẩm thật để mỗi task mặc một mẫu áo khác nhau.",
      },
      {
        title: "Người mẫu xoay váy",
        engine: "seedance",
        mode: "Ảnh đầu → video",
        ratio: "9:16",
        text: "Người mẫu trong ảnh xoay một vòng chậm để khoe tà váy, tóc bay nhẹ, máy quay giữ trung cảnh,\nnền studio trắng sạch",
        tip: "Đưa ảnh sản phẩm làm Ảnh đầu để váy trong video giống ảnh thật.",
      },
    ],
  },
  {
    id: "phim",
    label: "Phim ngắn · Kể chuyện",
    desc: "Cảnh điện ảnh để dựng phim AI, video kể chuyện xây kênh.",
    items: [
      {
        title: "Làng tuyết trung cổ",
        engine: "flow",
        mode: "Tạo video",
        ratio: "16:9",
        text: "Ngôi làng trung cổ phủ tuyết, người cha khoác áo choàng ôm con gái nhỏ bên gốc thông,\nánh sáng lạnh u ám, khói bốc từ ống khói, máy quay lia chậm từ trái sang phải, phong cách phim giả tưởng",
      },
      {
        title: "Tỉ thí võ thuật dưới mưa",
        engine: "seedance",
        mode: "Tạo video",
        ratio: "16:9",
        text: "Hai võ sĩ cúi chào nhau giữa sân gạch cổ dưới mưa, mái ngói Á Đông phía sau,\nmáy quay chuyển động chậm quanh hai nhân vật, không khí phim võ thuật điện ảnh",
      },
      {
        title: "Ông lão kể chuyện bên bếp lửa",
        engine: "muse",
        mode: "Tạo video",
        ratio: "9:16",
        text: "Ông lão tóc bạc ngồi bên bếp lửa trong căn nhà gỗ, ánh lửa bập bùng hắt lên gương mặt,\nông nhìn vào camera và bắt đầu kể chuyện, cận cảnh, màu ấm hoài niệm",
      },
    ],
  },
  {
    id: "am-thuc",
    label: "Ẩm thực",
    desc: "Món ăn bốc khói, cận cảnh nguyên liệu — hợp kênh ẩm thực và quán ăn.",
    items: [
      {
        title: "Bát phở bốc khói",
        engine: "flow",
        mode: "Tạo video",
        ratio: "9:16",
        text: "Bát phở bò bốc khói trên bàn gỗ quán ăn Hà Nội, đôi đũa gắp sợi phở lên chậm,\nhơi nóng bay, cận cảnh macro, ánh sáng buổi sáng",
      },
      {
        title: "Trà sữa rót đá",
        engine: "muse",
        mode: "Tạo video",
        ratio: "9:16",
        text: "Trà sữa được rót vào cốc nhựa đầy đá, lớp sữa hoà vào trà tạo vân xoáy,\nquay chậm, nền quầy bar sáng, phong cách quảng cáo đồ uống",
      },
    ],
  },
];

/** Cụm từ ghép thêm vào cuối prompt */
export const promptSnippets: { group: string; items: { label: string; text: string }[] }[] = [
  {
    group: "Chuyển động máy quay",
    items: [
      { label: "Đẩy vào chậm", text: "máy quay đẩy chậm về phía chủ thể, hậu cảnh mờ dần" },
      { label: "Lia ngang", text: "máy quay lia ngang đều từ trái sang phải, giữ chủ thể ở giữa khung" },
      { label: "Bay vòng quanh", text: "máy quay bay vòng quanh chủ thể một cách mượt mà" },
      { label: "Theo sau nhân vật", text: "máy quay bám theo phía sau nhân vật với khoảng cách đều" },
    ],
  },
  {
    group: "Ánh sáng & phong cách",
    items: [
      { label: "Giờ vàng", text: "ánh nắng giờ vàng ấm áp, bóng đổ dài, màu điện ảnh" },
      { label: "Studio sạch", text: "nền studio trắng, ánh sáng mềm đều, phong cách quảng cáo cao cấp" },
      { label: "Quay điện thoại", text: "cảm giác quay bằng điện thoại cầm tay, chân thực như video UGC" },
      { label: "Không chữ", text: "không có chữ, không có logo trên màn hình" },
    ],
  },
];

export const promptTips = [
  "Một prompt cho một cảnh. Nhồi nhiều cảnh vào một prompt thì video dễ rối — hãy tách ra, mỗi prompt cách nhau 1 dòng trống.",
  "Mô tả rõ ánh sáng và chuyển động máy quay: đây là hai thứ ảnh hưởng nhiều nhất tới độ “điện ảnh” của video.",
  "Giữ nhân vật đồng nhất bằng Tư liệu: đặt tên nhân vật rồi gõ @tên trong prompt, hoặc bật Người mẫu cố định.",
  "Dính bộ lọc an toàn? Tránh mô tả bạo lực, người nổi tiếng thật; bật “Tự động tối ưu prompt” trong Cài đặt.",
  "Prompt nào ra đơn thì bấm Lưu làm mẫu trong Studio để dùng lại cho sản phẩm tiếp theo.",
];
