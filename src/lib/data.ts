// Dữ liệu sản phẩm — bám sát giao diện & tính năng thật của app MeAI.

export type EngineId = "muse" | "flow" | "seedance";

export const engines: {
  id: EngineId;
  name: string;
  short: string;
  dot: string;
  text: string;
  hex: string;
  tagline: string;
  modes: string[];
  specs: string[];
}[] = [
  {
    id: "muse",
    name: "Muse",
    short: "Muse",
    dot: "bg-engine-muse",
    text: "text-engine-muse",
    hex: "#00F0FF",
    tagline: "Tạo ảnh & video hàng loạt với Người mẫu, Ảnh luân phiên và tối đa 6 ảnh tham chiếu.",
    modes: ["Tạo ảnh", "Tạo video"],
    specs: ["Ảnh tham chiếu tối đa 6", "Số ảnh mỗi prompt", "9:16 · 16:9 · 1:1 · 4:3 · 3:4"],
  },
  {
    id: "flow",
    name: "Google Flow",
    short: "Flow",
    dot: "bg-engine-flow",
    text: "text-engine-flow",
    hex: "#A855F7",
    tagline: "Chọn model ngay trong app (Nano Banana 2, Omni 1.1 Flash…), ảnh đầu/ảnh cuối, xuất tới 4K.",
    modes: ["Tạo ảnh", "Tạo video"],
    specs: ["Ảnh 1K · 2K · 4K", "Video 720p → 4K · 4s/6s/8s", "Tự xoá logo / watermark"],
  },
  {
    id: "seedance",
    name: "Seedance",
    short: "Seedance",
    dot: "bg-engine-seedance",
    text: "text-engine-seedance",
    hex: "#EAB308",
    tagline: "Text → Video, Ảnh → Video, Đầu–cuối với Seedance Pro. Có tạo âm thanh & cố định camera.",
    modes: ["Text → Video", "Ảnh → Video", "Đầu–cuối"],
    specs: ["480p · 720p · 1080p · 5s/10s", "6 tỉ lệ, có cả 21:9", "Seed cố định để tái lập"],
  },
];

/** Nền tảng có thể thêm tài khoản trong tab Tài khoản */
export const platforms = [
  { name: "Muse", dot: "bg-engine-muse" },
  { name: "Flow", dot: "bg-engine-flow" },
  { name: "Seedance", dot: "bg-engine-seedance" },
  { name: "Dola", dot: "bg-engine-dola" },
];

export const aspectRatios = ["9:16", "16:9", "1:1", "4:3", "3:4"] as const;

export type AppScreen = {
  id: string;
  label: string;
  title: string;
  desc: string;
  points: string[];
  shots: Shot[];
};

/**
 * Ảnh màn hình app.
 * - src/w/h: ảnh hiển thị chính (Studio = toàn màn hình độ phân giải gốc; mục khác = cận cảnh vùng nội dung)
 * - srcSet: bản 1280px cho màn hình nhỏ, bản gốc cho màn hình lớn/Retina
 * - full: ảnh toàn màn hình độ phân giải gốc để phóng to
 * - panel: cận cảnh panel cấu hình (chỉ Studio) — đọc rõ từng tuỳ chọn
 */
export type Shot = {
  label: string;
  src: string;
  srcSet?: string;
  w: number;
  h: number;
  full?: string;
  panel?: { src: string; w: number; h: number };
};

/** Ảnh toàn màn hình: bản gốc + bản 1280px */
export function screenSet(name: string, w: number) {
  return `/screens/${name}-1280.webp 1280w, /screens/${name}.webp ${w}w`;
}

const studioShot = (label: string, name: string, w: number, h: number, panelH: number): Shot => ({
  label,
  src: `/screens/${name}.webp`,
  srcSet: screenSet(name, w),
  w,
  h,
  full: `/screens/${name}.webp`,
  panel: { src: `/screens/${name}-panel.webp`, w: 318, h: panelH },
});

/** Các màn hình thật của app, theo đúng thứ tự menu bên trái */
export const appScreens: AppScreen[] = [
  {
    id: "studio",
    label: "Studio",
    title: "Studio — tạo ảnh & video hàng loạt",
    desc: "Chọn engine, dán danh sách prompt (mỗi prompt cách nhau 1 dòng trống) rồi bấm Tạo & chạy. Mỗi engine có bộ tuỳ chọn riêng, hiển thị đúng thứ bạn cần.",
    points: [
      "Muse · Google Flow · Seedance trên cùng một màn hình",
      "Chèn mẫu prompt / Lưu làm mẫu chỉ với một click",
      "Hàng đợi có lọc trạng thái, Chọn lỗi, Chạy lại lỗi, Ghép video",
      "Xem trước kết quả, Mở file, Tạo lại hoặc Chỉnh sửa prompt",
    ],
    shots: [
      studioShot("Muse · Ảnh", "studio-muse-anh", 2558, 1384, 695),
      studioShot("Muse · Video", "studio-muse-video", 2559, 1389, 695),
      studioShot("Flow · Ảnh", "studio-flow-anh", 2548, 1374, 804),
      studioShot("Flow · Video", "studio-flow-video", 2559, 1384, 874),
      studioShot("Seedance", "studio-seedance", 2558, 1391, 890),
    ],
  },
  {
    id: "tu-lieu",
    label: "Tư liệu",
    title: "Tư liệu — kho nhân vật, mẫu prompt & ảnh",
    desc: "Nơi giữ “bản gốc” để mọi video đồng nhất: nhân vật, người mẫu cố định và bộ ảnh luân phiên.",
    points: [
      "Nhân vật: prompt có tên nhân vật (viết hoa đúng tên hoặc @tên) tự gắn ảnh",
      "Người mẫu cố định: gắn vào mọi task khi bật (tối đa 3 ảnh)",
      "Ảnh luân phiên: mỗi task lấy 1 ảnh kế tiếp, nạp cả Folder",
      "Mẫu prompt lưu từ Studio, dùng lại cho mọi dự án",
    ],
    shots: [{ label: "Tư liệu", src: "/screens/tu-lieu-focus.webp", w: 1215, h: 482, full: "/screens/tu-lieu.webp" }],
  },
  {
    id: "kich-ban",
    label: "Kịch bản",
    title: "Kịch bản — từ kịch bản phân cảnh ra video hoàn chỉnh",
    desc: "Viết kịch bản theo mốc thời gian (0–10s, 10–20s…) hoặc tạo Từ ảnh, chọn giọng đọc, người dẫn, nhạc nền — MeAI render trên Muse và tự ghép.",
    points: [
      "Cách làm: làm video thẳng, nhanh khoảng 3 phút",
      "Tỉ lệ dọc 9:16 cho TikTok, Reels; thời lượng & tiền tố câu lệnh tuỳ chỉnh",
      "Giọng đọc, Người dẫn, Nhân vật dẫn lấy từ Tư liệu",
      "Ảnh sản phẩm: mỗi ảnh ra 1 bộ video riêng · Tự ghép khi xong · Ghép nhạc",
    ],
    shots: [{ label: "Kịch bản", src: "/screens/kich-ban-focus.webp", w: 1462, h: 737, full: "/screens/kich-ban.webp" }],
  },
  {
    id: "thu-vien",
    label: "Thư viện",
    title: "Thư viện — mọi ảnh & video đã tạo",
    desc: "Toàn bộ thành phẩm lưu tại thư mục output trên máy bạn, lọc theo dự án, theo ảnh/video.",
    points: [
      "Lọc Mọi dự án · Ảnh · Video, mở nhanh thư mục",
      "Ghép video nhiều clip, Lưu vào Tư liệu ảnh đẹp",
      "Đăng FB Reels ngay trên từng video",
    ],
    shots: [{ label: "Thư viện", src: "/screens/thu-vien-focus.webp", w: 1209, h: 983, full: "/screens/thu-vien.webp" }],
  },
  {
    id: "tai-khoan",
    label: "Tài khoản",
    title: "Tài khoản — đa nền tảng, đa luồng",
    desc: "Quản lý tài khoản Muse, Flow, Seedance, Dola ở một nơi, xem trạng thái rảnh, gói và tín dụng còn lại.",
    points: [
      "TK chạy đồng thời, Tổng luồng, Chia việc: Luân phiên / Lần lượt",
      "Tự chuyển tài khoản khi chạm hạn mức ngày (Daily Limit)",
      "Tự tối ưu prompt khi dính bộ lọc an toàn Google (Safety Filter)",
      "Proxy riêng từng tài khoản + kho proxy dự phòng (US/Global)",
    ],
    shots: [{ label: "Tài khoản", src: "/screens/tai-khoan-focus.webp", w: 1209, h: 514, full: "/screens/tai-khoan.webp" }],
  },
  {
    id: "ladipage",
    label: "LadiPage",
    title: "LadiPage — từ landing page ra kịch bản video",
    desc: "Dán link LadiPage sản phẩm: MeAI lấy ảnh gốc, giá, chính sách và sinh 3 kịch bản phân cảnh cho Muse.",
    points: [
      "Bước 1: Dán link · Bước 2: Chọn ảnh sản phẩm",
      "Bước 3: Sửa kịch bản, chọn cách làm",
      "Bước 4: Đưa vào hàng đợi — video tự chạy",
    ],
    shots: [{ label: "LadiPage", src: "/screens/ladipage-focus.webp", w: 1209, h: 246, full: "/screens/ladipage.webp" }],
  },
  {
    id: "dang-reels",
    label: "Đăng FB Reels",
    title: "Đăng Facebook Reels — đăng thẳng từ kho video",
    desc: "Kết nối Fanpage bằng Page Access Token (Graph API v20), chọn video trong kho, viết caption chốt đơn và đăng.",
    points: [
      "Chọn video trong kho hoặc file khác",
      "Caption kèm hashtag (#reels #xuhuong #freeship)",
      "Định dạng Reels dọc 9:16 · có Lịch sử đăng",
    ],
    shots: [{ label: "Đăng FB Reels", src: "/screens/dang-reels-focus.webp", w: 1209, h: 665, full: "/screens/dang-reels.webp" }],
  },
  {
    id: "cai-dat",
    label: "Cài đặt",
    title: "Cài đặt — thư mục lưu, giới hạn & token",
    desc: "Thiết lập một lần, áp dụng cho mọi task chạy sau đó.",
    points: [
      "Thư mục lưu thành phẩm (VD: D:\\MeAI\\output)",
      "Số lần thử khi lỗi, giới hạn thời gian tạo ảnh / tạo video",
      "Facebook token: dán 1 token, app tự quét danh sách Fanpage",
    ],
    shots: [{ label: "Cài đặt", src: "/screens/cai-dat-focus.webp", w: 1209, h: 681, full: "/screens/cai-dat.webp" }],
  },
];

export type Plan = {
  id: string;
  name: string;
  price: string;
  unit: string;
  note: string;
  highlight?: boolean;
  badge?: string;
  cta: string;
  features: string[];
};

export const plans: Plan[] = [
  {
    id: "month",
    name: "Gói Tháng",
    price: "399.000",
    unit: "/ tháng",
    note: "Test thị trường, chạy thử một ngách trước khi scale",
    cta: "Bắt đầu Gói Tháng",
    features: [
      "Đầy đủ tính năng: Studio, Tư liệu, Kịch bản, Thư viện",
      "Muse, Google Flow, Seedance — tạo ảnh & video hàng loạt",
      "Không giới hạn tài khoản & luồng chạy",
      "LadiPage → kịch bản, Đăng FB Reels",
      "Kích hoạt trên 1 máy tính",
      "Hỗ trợ qua nhóm cộng đồng",
    ],
  },
  {
    id: "year",
    name: "Gói Năm",
    price: "2.990.000",
    unit: "/ năm",
    note: "Tiết kiệm ~38% — lựa chọn của dân làm content chuyên nghiệp",
    highlight: true,
    badge: "Phổ biến nhất",
    cta: "Chọn Gói Năm",
    features: [
      "Toàn bộ tính năng như Gói Tháng",
      "Kích hoạt trên 2 máy tính",
      "Hỗ trợ 1-1 qua Zalo trong giờ hành chính",
      "Hướng dẫn setup tài khoản, proxy, token Fanpage",
      "Cập nhật engine & model mới miễn phí 12 tháng",
    ],
  },
  {
    id: "lifetime",
    name: "Vĩnh Viễn / Agency",
    price: "6.990.000",
    unit: "/ trọn đời",
    note: "Dành cho team, agency và studio chạy nhiều dự án song song",
    badge: "Best value",
    cta: "Liên hệ Agency",
    features: [
      "Toàn bộ tính năng, cập nhật trọn đời",
      "Kích hoạt trên 5 máy tính, chuyển máy linh hoạt",
      "Ưu tiên trải nghiệm tính năng mới (Early Access)",
      "Setup & training 1-1 cho team qua UltraView",
      "Hỗ trợ ưu tiên 7 ngày/tuần",
      "Giá riêng khi mua thêm license",
    ],
  },
];

export const faqs = [
  {
    q: "MeAI chạy trên hệ điều hành nào? Máy cần cấu hình bao nhiêu?",
    a: "MeAI là phần mềm Desktop cho Windows 10/11 64-bit. Việc tạo ảnh/video chạy trên server của các nền tảng AI, máy bạn chủ yếu điều phối trình duyệt và tải thành phẩm — 8GB RAM, CPU 4 nhân là chạy ổn; nhiều luồng thì nên 16GB RAM.",
  },
  {
    q: "Tôi có cần tự có tài khoản Muse / Google Flow / Seedance không?",
    a: "Có. MeAI là “xưởng điều phối”: bạn thêm tài khoản Muse, Flow, Seedance hoặc Dola trong tab Tài khoản, app hiển thị trạng thái rảnh, gói, tín dụng còn lại và tự chia task. Càng nhiều tài khoản, hàng đợi chạy càng nhanh.",
  },
  {
    q: "Prompt hàng loạt nhập thế nào?",
    a: "Trong Studio, dán toàn bộ prompt vào ô Prompt, mỗi prompt cách nhau 1 dòng trống — nhờ vậy một prompt có thể dài nhiều dòng (mô tả da, tóc, trang phục…). Prompt hay có thể Lưu làm mẫu và Chèn mẫu prompt ở lần sau.",
  },
  {
    q: "Làm sao giữ đồng nhất nhân vật/sản phẩm qua hàng trăm video?",
    a: "Kết hợp 4 cách: Nhân vật trong Tư liệu (prompt có tên nhân vật hoặc @tên tự gắn ảnh), Người mẫu cố định (tối đa 3 ảnh gắn vào mọi task), Ảnh luân phiên (mỗi task lấy 1 ảnh kế tiếp) và Ảnh tham chiếu tối đa 6 ảnh. Với Google Flow và Seedance có thêm Ảnh đầu / Ảnh cuối.",
  },
  {
    q: "Tài khoản bị hết hạn mức hoặc dính bộ lọc an toàn thì sao?",
    a: "Bật “Tự động chuyển tài khoản khi chạm hạn mức ngày” để MeAI nhảy sang tài khoản khác, và “Tự động tối ưu prompt khi dính bộ lọc an toàn Google” để prompt được viết lại và chạy tiếp. Task vẫn lỗi được gom lại — bấm Chọn lỗi → Chạy lại lỗi.",
  },
  {
    q: "Đăng Facebook Reels hoạt động thế nào?",
    a: "Vào Cài đặt, dán 1 Facebook token (User hoặc Page) có quyền pages_show_list, pages_read_engagement, pages_manage_posts, publish_video rồi bấm Quét Fanpage. Sau đó ở tab Đăng FB Reels chọn video trong kho, viết caption và bấm Đăng lên Reels. Video nên ở dạng dọc 9:16.",
  },
  {
    q: "Một License dùng được trên mấy máy? Có dùng thử không?",
    a: "Gói Tháng: 1 máy, Gói Năm: 2 máy, Gói Vĩnh Viễn/Agency: 5 máy. Bạn tự gỡ máy cũ và kích hoạt máy mới trong trang Quản lý License. Liên hệ Zalo để được cấp bản dùng thử trước khi mua.",
  },
  {
    q: "Thanh toán bằng cách nào? Có xuất hóa đơn VAT không?",
    a: "Hỗ trợ chuyển khoản ngân hàng/VietQR, ví MoMo. License được gửi qua email ngay sau khi xác nhận thanh toán. Gói Năm và Agency hỗ trợ xuất hóa đơn VAT cho doanh nghiệp.",
  },
];

export type ChangelogEntry = {
  version: string;
  date: string;
  tag: "Major" | "Feature" | "Fix";
  items: string[];
};

export const changelog: ChangelogEntry[] = [
  {
    version: "2.6.0",
    date: "20/10/2026",
    tag: "Feature",
    items: [
      "Seedance: thêm chế độ Đầu–cuối, tỉ lệ 21:9, tuỳ chọn Tạo âm thanh & Cố định camera",
      "Google Flow: chọn độ phân giải ảnh 1K/2K/4K, video tới 4K, tự xoá logo/watermark",
      "Studio: Chèn mẫu prompt / Lưu làm mẫu",
    ],
  },
  {
    version: "2.5.0",
    date: "02/10/2026",
    tag: "Feature",
    items: [
      "LadiPage: dán link sản phẩm, tự sinh 3 kịch bản phân cảnh cho Muse",
      "Đăng Facebook Reels qua Page Access Token (Graph API v20)",
      "Kịch bản: giọng đọc, người dẫn, nhân vật dẫn, ghép nhạc nền",
    ],
  },
  {
    version: "2.4.0",
    date: "15/09/2026",
    tag: "Feature",
    items: [
      "Tài khoản: tự chuyển tài khoản khi chạm Daily Limit",
      "Tự tối ưu prompt khi dính Safety Filter của Google",
      "Proxy riêng từng tài khoản + kho proxy dự phòng (US/Global)",
    ],
  },
  {
    version: "2.0.0",
    date: "01/08/2026",
    tag: "Major",
    items: [
      "Giao diện Studio mới: cấu hình · hàng đợi · xem trước trên một màn hình",
      "Tư liệu: Nhân vật (@tên), Người mẫu cố định, Ảnh luân phiên",
      "Thư viện: ghép video, lưu vào Tư liệu, đăng Reels từng video",
    ],
  },
];
