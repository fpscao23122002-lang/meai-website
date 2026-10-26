export type EngineId = "muse" | "flow" | "seedance";

export const engines: {
  id: EngineId;
  name: string;
  tagline: string;
  modes: string[];
  speed: string;
  color: string;
}[] = [
  {
    id: "muse",
    name: "Muse",
    tagline: "Ảnh & video phong cách điện ảnh, cực hợp làm content sản phẩm",
    modes: ["Tạo ảnh", "Tạo video"],
    speed: "~45s / video",
    color: "from-cyan-400 to-sky-500",
  },
  {
    id: "flow",
    name: "Google Flow",
    tagline: "Sức mạnh Veo & Imagen từ Google, chuyển động mượt, chi tiết sắc nét",
    modes: ["Tạo ảnh", "Tạo video", "Ảnh → Video"],
    speed: "~60s / video",
    color: "from-sky-400 to-violet-500",
  },
  {
    id: "seedance",
    name: "Seedance",
    tagline: "Chuyển động nhân vật tự nhiên, nhịp nhanh — sinh ra để làm Reels",
    modes: ["Tạo video", "Ảnh → Video"],
    speed: "~35s / video",
    color: "from-fuchsia-500 to-rose-500",
  },
];

export const aspectRatios = ["9:16", "16:9", "1:1", "4:3", "3:4"] as const;

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
      "Đủ 3 engine: Muse, Google Flow, Seedance",
      "Tạo ảnh & video hàng loạt từ danh sách prompt",
      "Ảnh tham chiếu (tối đa 6 ảnh), mọi tỉ lệ khung hình",
      "Quản lý tối đa 10 tài khoản AI",
      "Hàng đợi thông minh, tự chạy lại task lỗi",
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
      "Toàn bộ quyền lợi Gói Tháng",
      "Không giới hạn số tài khoản AI",
      "Tự động đăng Facebook Reels đa fanpage",
      "Tích hợp LadiPage & ghép video trực tiếp",
      "Kho Tư liệu, Kịch bản, Thư viện đầy đủ",
      "Kích hoạt trên 2 máy tính",
      "Hỗ trợ 1-1 qua Zalo trong giờ hành chính",
      "Cập nhật miễn phí suốt 12 tháng",
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
      "Toàn bộ quyền lợi Gói Năm",
      "Sử dụng vĩnh viễn, cập nhật trọn đời",
      "Kích hoạt trên 5 máy tính, chuyển máy linh hoạt",
      "Ưu tiên trải nghiệm tính năng mới (Early Access)",
      "Setup & training 1-1 cho team qua UltraView",
      "Hỗ trợ ưu tiên 7 ngày/tuần",
      "Chính sách giá riêng khi mua thêm license",
    ],
  },
];

export const faqs = [
  {
    q: "MeAI chạy trên hệ điều hành nào? Cấu hình máy cần bao nhiêu?",
    a: "MeAI hiện hỗ trợ Windows 10/11 bản 64-bit. Vì phần render nặng chạy trên server của các engine AI, máy bạn chỉ cần tối thiểu 8GB RAM, CPU 4 nhân và mạng ổn định là đã chạy mượt hàng chục luồng. Không cần card đồ họa rời.",
  },
  {
    q: "Tôi có cần tự mua tài khoản Muse / Google Flow / Seedance không?",
    a: "Có. MeAI là “xưởng điều phối” — bạn đăng nhập tài khoản AI của mình vào app, MeAI lo phần chia việc, xếp hàng đợi, retry và tải kết quả về. Càng nhiều tài khoản, tốc độ ra video càng nhanh vì hệ thống tự phân bổ task cho tài khoản đang rảnh.",
  },
  {
    q: "Tài khoản của tôi có an toàn không?",
    a: "Toàn bộ phiên đăng nhập, cookie và dữ liệu được lưu cục bộ trên máy bạn, được mã hóa và không gửi về server MeAI. Hệ thống chỉ xác thực License Key để kích hoạt phần mềm.",
  },
  {
    q: "Làm sao giữ đồng nhất nhân vật/sản phẩm qua hàng trăm video?",
    a: "Dùng chế độ Người mẫu hoặc Ảnh tham chiếu (tối đa 6 ảnh). MeAI tự đính kèm bộ ảnh này vào mọi prompt trong batch, nên khuôn mặt, trang phục, bao bì sản phẩm giữ ổn định. Chế độ Ảnh luân phiên giúp xoay vòng nhiều góc chụp để video đa dạng mà vẫn nhất quán.",
  },
  {
    q: "Một License dùng được trên mấy máy? Đổi máy thì sao?",
    a: "Gói Tháng: 1 máy, Gói Năm: 2 máy, Gói Vĩnh Viễn/Agency: 5 máy. Bạn có thể tự gỡ máy cũ và kích hoạt máy mới ngay trong trang Quản lý License, không cần chờ admin.",
  },
  {
    q: "Tự động đăng Facebook Reels có bị khóa page không?",
    a: "MeAI đăng theo lịch với khoảng nghỉ ngẫu nhiên, hỗ trợ caption & hashtag riêng cho từng video và chạy trên phiên đăng nhập thật của bạn. Tuy nhiên, chất lượng nội dung và lịch sử page vẫn là yếu tố quyết định — hãy tuân thủ chính sách cộng đồng của Meta.",
  },
  {
    q: "Có bản dùng thử không? Chính sách hoàn tiền thế nào?",
    a: "Bạn có thể tải app và trải nghiệm miễn phí 3 ngày với đầy đủ tính năng. Nếu License kích hoạt lỗi do phía MeAI và đội kỹ thuật không xử lý được trong 48h, bạn được hoàn 100% phí.",
  },
  {
    q: "Thanh toán bằng cách nào? Có xuất hóa đơn VAT không?",
    a: "Hỗ trợ chuyển khoản ngân hàng/QR VietQR, ví MoMo. License được gửi tự động qua email ngay sau khi thanh toán thành công. Gói Năm và Agency có hỗ trợ xuất hóa đơn VAT cho doanh nghiệp.",
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
      "Seedance: hỗ trợ chế độ Ảnh → Video với ảnh tham chiếu",
      "Ghép video trực tiếp: thêm hiệu ứng chuyển cảnh và chèn nhạc nền",
      "Hàng đợi: ưu tiên task theo dự án, kéo-thả để sắp xếp lại",
    ],
  },
  {
    version: "2.5.2",
    date: "02/10/2026",
    tag: "Fix",
    items: [
      "Sửa lỗi Google Flow không tải được video độ phân giải 1080p",
      "Tự động làm mới phiên đăng nhập khi cookie hết hạn",
      "Giảm 30% RAM khi chạy trên 20 luồng",
    ],
  },
  {
    version: "2.5.0",
    date: "15/09/2026",
    tag: "Feature",
    items: [
      "Tự động đăng Facebook Reels theo lịch, đa fanpage",
      "Tích hợp LadiPage: đẩy video & ảnh sản phẩm lên landing page",
      "Thêm tỉ lệ 4:3 và 3:4 cho mọi engine",
    ],
  },
  {
    version: "2.0.0",
    date: "01/08/2026",
    tag: "Major",
    items: [
      "Giao diện Studio mới hoàn toàn, tối ưu cho màn hình 2K",
      "Ra mắt chế độ Người mẫu & Ảnh luân phiên",
      "Quản lý đa tài khoản với cơ chế tự phân bổ tài khoản rảnh",
    ],
  },
];
