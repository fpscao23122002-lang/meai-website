// Dữ liệu sản phẩm — bám sát giao diện & tính năng thật của app MeAI.
import { PLAN_RULES, formatVnd } from "../../shared/plans";

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

/** Ảnh chụp màn hình thật của app (mở bằng nút "Xem ảnh chụp thật"); giao diện hiển thị trên web được dựng bằng code */
export type Shot = { label: string; src: string; full?: string };

const studioShot = (label: string, name: string): Shot => ({ label, src: `/screens/${name}.webp` });

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
      studioShot("Muse · Ảnh", "studio-muse-anh"),
      studioShot("Muse · Video", "studio-muse-video"),
      studioShot("Flow · Ảnh", "studio-flow-anh"),
      studioShot("Flow · Video", "studio-flow-video"),
      studioShot("Seedance", "studio-seedance"),
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
    shots: [{ label: "Tư liệu", src: "/screens/tu-lieu.webp" }],
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
    shots: [{ label: "Kịch bản", src: "/screens/kich-ban.webp" }],
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
    shots: [{ label: "Thư viện", src: "/screens/thu-vien.webp" }],
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
    shots: [{ label: "Tài khoản", src: "/screens/tai-khoan.webp" }],
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
    shots: [{ label: "LadiPage", src: "/screens/ladipage.webp" }],
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
    shots: [{ label: "Đăng FB Reels", src: "/screens/dang-reels.webp" }],
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
    shots: [{ label: "Cài đặt", src: "/screens/cai-dat.webp" }],
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
    price: formatVnd(PLAN_RULES.month.amount),
    unit: "/ tháng",
    note: "Test thị trường, chạy thử một ngách trước khi scale",
    cta: "Bắt đầu Gói Tháng",
    features: [
      "Đầy đủ tính năng: Studio, Tư liệu, Kịch bản, Thư viện",
      "Muse, Google Flow, Seedance — tạo ảnh & video hàng loạt",
      "Không giới hạn tài khoản & luồng chạy",
      "LadiPage → kịch bản, Đăng FB Reels",
      "Dùng trên 1 máy tính",
      "Hỗ trợ qua nhóm cộng đồng",
    ],
  },
  {
    id: "year",
    name: "Gói Năm",
    price: formatVnd(PLAN_RULES.year.amount),
    unit: "/ năm",
    note: "Tiết kiệm ~38% — lựa chọn của dân làm content chuyên nghiệp",
    highlight: true,
    badge: "Phổ biến nhất",
    cta: "Chọn Gói Năm",
    features: [
      "Toàn bộ tính năng như Gói Tháng",
      "Dùng trên 2 máy tính",
      "Hỗ trợ 1-1 qua Telegram trong giờ hành chính",
      "Hướng dẫn setup tài khoản, proxy, token Fanpage",
      "Cập nhật engine & model mới miễn phí 12 tháng",
    ],
  },
  {
    id: "lifetime",
    name: "Vĩnh Viễn / Agency",
    price: formatVnd(PLAN_RULES.lifetime.amount),
    unit: "/ trọn đời",
    note: "Dành cho team, agency và studio chạy nhiều dự án song song",
    badge: "Best value",
    cta: "Chọn gói Vĩnh Viễn",
    features: [
      "Toàn bộ tính năng, cập nhật trọn đời",
      "Dùng trên 5 máy tính, chuyển máy linh hoạt",
      "Ưu tiên trải nghiệm tính năng mới (Early Access)",
      "Setup & training 1-1 cho team qua UltraView",
      "Hỗ trợ ưu tiên 7 ngày/tuần",
      "Giá riêng khi mua thêm tài khoản cho team",
    ],
  },
];

export const faqCategories = [
  { id: "mua", label: "Trước khi mua" },
  { id: "goi", label: "Gói & thiết bị" },
  { id: "dung", label: "Trong lúc dùng" },
  { id: "tien", label: "Thanh toán" },
] as const;

export const faqs: { cat: (typeof faqCategories)[number]["id"]; q: string; a: string }[] = [
  {
    cat: "mua",
    q: "MeAI chạy trên hệ điều hành nào? Máy cần cấu hình bao nhiêu?",
    a: "MeAI là phần mềm Desktop cho Windows 10/11 64-bit. Việc tạo ảnh/video chạy trên server của các nền tảng AI, máy bạn chủ yếu điều phối trình duyệt và tải thành phẩm — 8GB RAM, CPU 4 nhân là chạy ổn; nhiều luồng thì nên 16GB RAM.",
  },
  {
    cat: "mua",
    q: "Tôi có cần tự có tài khoản Muse / Google Flow / Seedance không?",
    a: "Có. MeAI là “xưởng điều phối”: bạn thêm tài khoản Muse, Flow, Seedance hoặc Dola trong tab Tài khoản, app hiển thị trạng thái rảnh, gói, tín dụng còn lại và tự chia task. Càng nhiều tài khoản, hàng đợi chạy càng nhanh.",
  },
  {
    cat: "dung",
    q: "Prompt hàng loạt nhập thế nào?",
    a: "Trong Studio, dán toàn bộ prompt vào ô Prompt, mỗi prompt cách nhau 1 dòng trống — nhờ vậy một prompt có thể dài nhiều dòng (mô tả da, tóc, trang phục…). Prompt hay có thể Lưu làm mẫu và Chèn mẫu prompt ở lần sau.",
  },
  {
    cat: "dung",
    q: "Làm sao giữ đồng nhất nhân vật/sản phẩm qua hàng trăm video?",
    a: "Kết hợp 4 cách: Nhân vật trong Tư liệu (prompt có tên nhân vật hoặc @tên tự gắn ảnh), Người mẫu cố định (tối đa 3 ảnh gắn vào mọi task), Ảnh luân phiên (mỗi task lấy 1 ảnh kế tiếp) và Ảnh tham chiếu tối đa 6 ảnh. Với Google Flow và Seedance có thêm Ảnh đầu / Ảnh cuối.",
  },
  {
    cat: "dung",
    q: "Tài khoản bị hết hạn mức hoặc dính bộ lọc an toàn thì sao?",
    a: "Bật “Tự động chuyển tài khoản khi chạm hạn mức ngày” để MeAI nhảy sang tài khoản khác, và “Tự động tối ưu prompt khi dính bộ lọc an toàn Google” để prompt được viết lại và chạy tiếp. Task vẫn lỗi được gom lại — bấm Chọn lỗi → Chạy lại lỗi.",
  },
  {
    cat: "dung",
    q: "Đăng Facebook Reels hoạt động thế nào?",
    a: "Vào Cài đặt, dán 1 Facebook token (User hoặc Page) có quyền pages_show_list, pages_read_engagement, pages_manage_posts, publish_video rồi bấm Quét Fanpage. Sau đó ở tab Đăng FB Reels chọn video trong kho, viết caption và bấm Đăng lên Reels. Video nên ở dạng dọc 9:16.",
  },
  {
    cat: "goi",
    q: "Đăng nhập thế nào? Một gói dùng được trên mấy máy?",
    a: "MeAI chỉ dùng tài khoản Google: đăng nhập cùng một Gmail trên website và trong app, gói bạn mua gắn vào tài khoản đó nên app tự nhận đúng gói và hạn dùng — không cần nhập mã kích hoạt. Gói Tháng: 1 máy, Gói Năm: 2 máy, Gói Vĩnh Viễn/Agency: 5 máy; tự gỡ máy cũ trong Khu vực khách hàng. Nhắn Telegram @meai_support để được dùng thử trước khi mua.",
  },
  {
    cat: "tien",
    q: "Thanh toán bằng cách nào? Có xuất hóa đơn VAT không?",
    a: "Chọn gói trên website hoặc ngay trong app, quét VietQR / chuyển khoản đúng nội dung của đơn. Khi thanh toán được xác nhận, gói tự kích hoạt vào tài khoản Google của bạn — app nhận ngay ở lần mở kế tiếp. Gói Năm và Agency hỗ trợ xuất hóa đơn VAT cho doanh nghiệp.",
  },
  {
    cat: "mua",
    q: "MeAI có thu thêm tiền cho mỗi video không?",
    a: "Không. Phí gói là phí sử dụng phần mềm. Lượt tạo ảnh/video được tính trên tài khoản Muse, Flow, Seedance của chính bạn theo gói của từng nền tảng — MeAI không thu thêm đồng nào trên mỗi video và không bán credit.",
  },
  {
    cat: "mua",
    q: "MeAI có bán tài khoản AI hay credit không?",
    a: "Không. MeAI chỉ là phần mềm điều phối chạy trên tài khoản bạn tự sở hữu. Bạn tự chuẩn bị tài khoản và chịu trách nhiệm tuân thủ điều khoản của từng nền tảng.",
  },
  {
    cat: "mua",
    q: "Có dùng thử trước khi mua không?",
    a: "Có 2 cách: bấm thử Studio mô phỏng ngay trên website (mục Trải nghiệm), hoặc nhắn Telegram @meai_support để được cấp bản dùng thử trên máy của bạn.",
  },
  {
    cat: "goi",
    q: "Đổi máy hoặc cài lại Windows thì có mất gói không?",
    a: "Không. Gói gắn với tài khoản Google chứ không gắn với máy. Cài lại xong chỉ cần đăng nhập đúng Gmail; nếu app báo đã đủ số máy, vào Khu vực khách hàng gỡ máy cũ là dùng được ngay.",
  },
  {
    cat: "goi",
    q: "Mua gói trên web hay trong app có khác nhau không?",
    a: "Như nhau. Dù mua ở đâu, gói đều cộng vào cùng một tài khoản Google; app kiểm tra lại gói mỗi lần khởi động nên nhận ngay gói mới.",
  },
  {
    cat: "dung",
    q: "Video và dữ liệu của tôi lưu ở đâu?",
    a: "Thành phẩm được tải về thư mục bạn chọn trong Cài đặt của app. Website và hệ thống tài khoản MeAI không nhận prompt, ảnh hay video của bạn — chỉ lưu thông tin gói, thiết bị và đơn hàng.",
  },
  {
    cat: "tien",
    q: "Hết hạn có tự trừ tiền không?",
    a: "Không. Thanh toán bằng chuyển khoản nên không có gia hạn tự động. Gói sắp hết hạn sẽ hiện cảnh báo trong Khu vực khách hàng; gia hạn sớm được cộng nối tiếp vào hạn còn lại.",
  },
  {
    cat: "tien",
    q: "Đã chuyển khoản nhưng chưa thấy gói được kích hoạt?",
    a: "Kiểm tra nội dung chuyển khoản đã đúng mã đơn (dạng MEAIxxxxxx) chưa — trang thanh toán tự cập nhật khi nhận tiền. Nếu vẫn chưa thấy, nhắn Telegram @meai_support kèm mã đơn và ảnh chuyển khoản để được kích hoạt ngay.",
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
