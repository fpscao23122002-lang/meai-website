import { Link } from "@/components/ui/Link";
import { ArrowRight, Download, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { Callout, CodeBlock, DocShot, DocTable, Steps } from "@/components/docs/DocBlocks";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";
import { screenSet } from "@/lib/data";
import { usePageMeta } from "@/hooks/usePageMeta";

const DOCS_DESCRIPTION =
  "Hướng dẫn MeAI Studio: cài đặt, thêm tài khoản Muse/Flow/Seedance/Dola, tạo ảnh & video hàng loạt, Tư liệu & ảnh tham chiếu, hàng đợi, Kịch bản, LadiPage và đăng Facebook Reels.";

const PROMPT_EXAMPLE = `Chân dung cận cảnh cô gái Việt 25 tuổi, da trắng hồng,
tóc layer uốn sóng nhẹ, ánh nắng sớm xuyên rèm, phong cách quảng cáo mỹ phẩm

Cô gái 25 tuổi cầm lọ serum giơ lên camera, bàn trang điểm gỗ sáng,
đèn ring light, trung cảnh, phong cách UGC TikTok

Lọ serum đặt trên đá cẩm thạch, giọt nước lăn trên thân chai,
ánh sáng studio dịu, macro xoay chậm`;

const SCRIPT_EXAMPLE = `0-10s: Cô gái Việt giơ hộp giữa kho hàng đầy ắp, cận cảnh lung linh đèn Noel
10-20s: Cả gia đình quây quần mở quà hộp lịch Giáng Sinh
20-30s: Cận cảnh sản phẩm trên bàn, chữ "Freeship toàn quốc" hiện lên`;

export default function DocsPage() {
  usePageMeta({ title: "Hướng dẫn sử dụng", description: DOCS_DESCRIPTION, path: "/docs" });

  return (
    <>
      <Navbar />
      <main className="relative pt-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] overflow-hidden">
          <div className="absolute left-1/2 top-[-200px] h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-cyan-brand/15 blur-[120px]" />
        </div>

        <header className="container border-b border-white/[0.06] py-14">
          <p className="text-sm font-semibold text-cyan-glow">Tài liệu · v{siteConfig.latestVersion}</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Hướng dẫn sử dụng <span className="text-gradient">MeAI Studio</span>
          </h1>
          <p className="mt-4 max-w-2xl text-slate-400">
            Từ lúc cài app đến khi video đầu tiên lên sóng Reels — đi theo đúng thứ tự menu trong app, kèm ảnh chụp màn hình
            thật. Mất khoảng 15 phút để làm chủ toàn bộ workflow.
          </p>
        </header>

        <div className="container grid gap-10 pb-10 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-14">
          <DocsSidebar />

          <article className="prose-doc min-w-0 max-w-3xl pb-10 lg:pt-4">
            {/* 1 */}
            <section id="tong-quan">
              <h2>Tổng quan giao diện</h2>
              <p>
                MeAI là phần mềm Desktop cho Windows, đóng vai trò <strong>“quản đốc xưởng”</strong> điều phối các nền tảng AI
                tạo ảnh & video. Bạn cung cấp tài khoản, prompt và tư liệu — MeAI lo chia việc, chạy song song, xử lý lỗi,
                lưu thành phẩm, ghép video và đăng Reels.
              </p>
              <DocShot src="/screens/studio-muse-anh.webp" srcSet={screenSet("studio-muse-anh", 2558)} caption="Màn hình Studio — cấu hình · hàng đợi · xem trước" />
              <h3>Menu bên trái</h3>
              <DocTable
                head={["Mục", "Dùng để"]}
                rows={[
                  ["Studio", "Tạo ảnh & video hàng loạt bằng Muse, Google Flow, Seedance"],
                  ["Tư liệu", "Nhân vật, mẫu prompt, người mẫu cố định, ảnh luân phiên"],
                  ["Kịch bản", "Viết kịch bản phân cảnh → video có giọng đọc, nhạc nền"],
                  ["Thư viện", "Xem, ghép, lưu và đăng mọi ảnh/video đã tạo"],
                  ["Tài khoản", "Thêm tài khoản Muse, Flow, Seedance, Dola; luồng, proxy, hạn mức"],
                  ["LadiPage", "Dán link landing page → sinh 3 kịch bản phân cảnh cho Muse"],
                  ["Đăng FB Reels", "Đăng video lên Fanpage bằng Page Access Token"],
                  ["Cài đặt", "Thư mục lưu, số lần thử khi lỗi, giới hạn thời gian, token Facebook"],
                ]}
              />
              <h3>Thanh công cụ phía trên</h3>
              <ul>
                <li>
                  <strong>Dự án</strong> (mặc định là <code>Mặc định</code>) — tách task & thành phẩm theo từng dự án/khách
                  hàng.
                </li>
                <li>
                  <strong>Tài khoản: x/y rảnh</strong> — số tài khoản đang rảnh trên tổng số tài khoản đang bật.
                </li>
                <li>
                  <strong>Chạy tiếp</strong> / <strong>Dừng tất cả</strong> — tiếp tục hoặc dừng toàn bộ hàng đợi.
                </li>
                <li>
                  <strong>Thư mục</strong> — mở nhanh thư mục chứa thành phẩm.
                </li>
              </ul>
            </section>

            {/* 2 */}
            <section id="cai-dat">
              <h2>Cài đặt & kích hoạt</h2>
              <DocTable
                head={["Thành phần", "Tối thiểu", "Khuyến nghị"]}
                rows={[
                  ["Hệ điều hành", "Windows 10 64-bit", "Windows 11 64-bit"],
                  ["RAM", "8 GB", "16 GB (chạy nhiều luồng)"],
                  ["Ổ cứng trống", "5 GB", "SSD, 50 GB+ cho thư viện video"],
                  ["Mạng", "Ổn định", "Cáp quang, có thể kèm proxy"],
                ]}
              />
              <Steps
                items={[
                  {
                    title: "Tải bộ cài",
                    body: (
                      <>
                        Tải file <code>MeAI-Studio-Setup-x64.exe</code> ở trang chủ hoặc trong{" "}
                        <Link href="/dashboard" className="text-cyan-glow hover:underline">
                          Quản lý License
                        </Link>
                        .
                      </>
                    ),
                  },
                  {
                    title: "Chạy file cài đặt",
                    body: (
                      <>
                        Nếu Windows SmartScreen cảnh báo, bấm <strong>More info → Run anyway</strong> rồi làm theo hướng dẫn.
                      </>
                    ),
                  },
                  {
                    title: "Kích hoạt License",
                    body: (
                      <>
                        Mở app và nhập License Key dạng <code>MEAI-XXXX-XXXX-XXXX</code> đã nhận qua email. Máy đã kích hoạt
                        sẽ hiện trong trang Quản lý License.
                      </>
                    ),
                  },
                ]}
              />
              <Callout type="warn">
                Một số phần mềm diệt virus có thể chặn nhầm vì MeAI điều khiển trình duyệt tự động. Hãy thêm thư mục cài đặt
                vào danh sách loại trừ (Exclusions) nếu app không khởi động được.
              </Callout>
            </section>

            {/* 3 */}
            <section id="thiet-lap">
              <h2>Thiết lập ban đầu (Cài đặt)</h2>
              <p>
                Vào <strong>Cài đặt → Chạy task</strong>. Thiết lập áp dụng cho các task chạy sau khi bấm <strong>Lưu</strong>.
              </p>
              <DocShot src="/screens/cai-dat-focus.webp" w={1209} h={681} full="/screens/cai-dat.webp" caption="Cài đặt: Chạy task & Facebook token" />
              <DocTable
                head={["Tuỳ chọn", "Ý nghĩa", "Gợi ý"]}
                rows={[
                  ["Thư mục lưu", "Nơi lưu mọi ảnh/video thành phẩm (VD: D:\\MeAI\\output)", "Chọn ổ SSD còn trống nhiều"],
                  ["Số lần thử khi lỗi", "Task lỗi sẽ tự chạy lại bấy nhiêu lần", "1–2 lần (thử lại tốn thêm lượt Muse)"],
                  ["Giới hạn tạo ảnh (phút)", "Quá thời gian này task ảnh bị tính là lỗi", "5 phút"],
                  ["Giới hạn tạo video (phút)", "Quá thời gian này task video bị tính là lỗi", "30 phút"],
                ]}
              />
              <p>
                Phần <strong>Facebook token</strong> ở cùng trang dùng cho tính năng Đăng FB Reels — xem mục{" "}
                <a href="#dang-reels" className="text-cyan-glow hover:underline">
                  Đăng Facebook Reels
                </a>
                .
              </p>
            </section>

            {/* 4 */}
            <section id="tai-khoan">
              <h2>Thêm & quản lý tài khoản</h2>
              <p>
                Tab <strong>Tài khoản</strong> gom 4 nền tảng: <strong>Muse</strong>, <strong>Flow</strong>,{" "}
                <strong>Seedance</strong>, <strong>Dola</strong>. Mỗi tab hiện số tài khoản rảnh, ví dụ <code>1/1 rảnh</code>.
              </p>
              <DocShot src="/screens/tai-khoan-focus.webp" w={1209} h={514} full="/screens/tai-khoan.webp" caption="Tài khoản: cấu hình luồng, chia việc, proxy" />
              <Steps
                items={[
                  {
                    title: "Chọn nền tảng → bấm “+ Thêm tài khoản”",
                    body: "Đăng nhập tài khoản trong cửa sổ Chrome do MeAI mở. Muốn xem lại trình duyệt của tài khoản nào, bấm Hiện Chrome.",
                  },
                  {
                    title: "Kiểm tra tài khoản",
                    body: (
                      <>
                        Mỗi dòng hiện trạng thái (<strong>Rảnh</strong>), gói (VD: PRO) và <strong>tín dụng</strong> còn lại.
                        Bấm <strong>Kiểm tra phiên</strong> / <strong>Kiểm tra hạn mức</strong> ở góc trên để cập nhật hàng loạt.
                      </>
                    ),
                  },
                  {
                    title: "Đặt luồng & cách chia việc",
                    body: (
                      <>
                        <strong>TK chạy đồng thời</strong> và <strong>Tổng luồng</strong> quyết định tốc độ. Mỗi tài khoản có ô
                        số luồng riêng (VD: <code>1 luồng</code>). <strong>Chia việc</strong>: <em>Luân phiên</em> chia đều task
                        cho các tài khoản, <em>Lần lượt</em> dùng hết tài khoản này rồi mới sang tài khoản kế.
                      </>
                    ),
                  },
                  {
                    title: "Gán proxy (tuỳ chọn)",
                    body: (
                      <>
                        Nhập <code>ip:port</code> hoặc <code>ip:port:user:pass</code> cho từng tài khoản rồi bấm{" "}
                        <strong>Kiểm tra</strong>. Để trống = không dùng proxy.
                      </>
                    ),
                  },
                ]}
              />
              <h3>3 công tắc nên bật</h3>
              <ul>
                <li>
                  <strong>Tự động chuyển tài khoản khi chạm hạn mức ngày (Daily Limit)</strong> — hết lượt là nhảy sang tài
                  khoản khác, hàng đợi không bị đứng.
                </li>
                <li>
                  <strong>Tự động tối ưu prompt khi dính bộ lọc an toàn Google (Safety Filter)</strong> — prompt bị chặn sẽ
                  được viết lại và chạy tiếp.
                </li>
                <li>
                  <strong>Kho proxy dự phòng (US/Global)</strong> — dùng khi tài khoản cần IP nước ngoài.
                </li>
              </ul>
              <Callout type="tip">
                Tắt công tắc đầu dòng để tạm ngưng một tài khoản mà không phải xoá. Nút <strong>Đăng xuất</strong> / <strong>Xoá</strong>{" "}
                nằm cuối mỗi dòng.
              </Callout>
            </section>

            {/* 5 */}
            <section id="studio">
              <h2>Studio: tạo ảnh & video hàng loạt</h2>
              <p>
                Chọn engine (<strong>Muse</strong>, <strong>Google Flow</strong>, <strong>Seedance</strong>), chọn{" "}
                <strong>Tạo ảnh</strong> hoặc <strong>Tạo video</strong>, rồi dán prompt. Quy tắc quan trọng nhất:
              </p>
              <Callout type="info">
                <strong>Mỗi prompt cách nhau 1 dòng trống.</strong> Nhờ vậy một prompt có thể viết nhiều dòng mô tả chi tiết
                (da, tóc, trang phục, bối cảnh) mà vẫn chỉ tính là 1 task.
              </Callout>
              <CodeBlock title="3 prompt = 3 task">{PROMPT_EXAMPLE}</CodeBlock>
              <ul>
                <li>
                  <strong>Chèn mẫu prompt…</strong> — chèn nhanh prompt đã lưu. <strong>Lưu làm mẫu</strong> — lưu prompt hiện
                  tại vào Tư liệu → Mẫu prompt.
                </li>
                <li>
                  <strong>Tạo &amp; chạy</strong> — tạo task và chạy ngay. <strong>Chỉ thêm vào hàng đợi</strong> — xếp task,
                  chạy sau bằng nút <strong>Chạy</strong> / <strong>Chạy tiếp</strong>.
                </li>
              </ul>
              <h3>Tuỳ chọn theo từng engine</h3>
              <DocTable
                head={["Engine · chế độ", "Tuỳ chọn trong app"]}
                rows={[
                  [
                    "Muse · Tạo ảnh",
                    "Người mẫu, Ảnh luân phiên, Ảnh tham chiếu (tối đa 6), Số ảnh mỗi prompt, Tỉ lệ 9:16 · 16:9 · 1:1 · 4:3 · 3:4, Nâng cao",
                  ],
                  ["Muse · Tạo video", "Người mẫu, Ảnh luân phiên, Ảnh tham chiếu (tối đa 6), Tỉ lệ 5 lựa chọn, Nâng cao"],
                  [
                    "Google Flow · Tạo ảnh",
                    "Model (VD: Nano Banana 2 Lite), Tỷ lệ ảnh 5 lựa chọn, Độ phân giải 1K / 2K / 4K, Ảnh đầu / Ảnh cuối, Xóa logo / watermark",
                  ],
                  [
                    "Google Flow · Tạo video",
                    "Model (VD: Omni 1.1 Flash), Tỷ lệ 16:9 / 9:16, Chất lượng 720p / 1080p / 4K, Thời lượng 4s / 6s / 8s, Ảnh đầu / Ảnh cuối, Xóa logo / watermark",
                  ],
                  [
                    "Seedance",
                    "Chế độ Text → Video / Ảnh → Video / Đầu–cuối, Model Seedance Pro, 480p / 720p / 1080p, 5s / 10s, Tỷ lệ 16:9 · 9:16 · 1:1 · 4:3 · 3:4 · 21:9, Tạo âm thanh, Cố định camera, Xóa watermark, Seed",
                  ],
                ]}
              />
              <DocShot src="/screens/studio-seedance.webp" srcSet={screenSet("studio-seedance", 2558)} h={1391} caption="Studio với Seedance: Chế độ, độ phân giải, thời lượng, seed" />
              <h3>Mẹo viết prompt ra video “ăn view”</h3>
              <ul>
                <li>
                  Công thức: <code>Chủ thể + Hành động + Bối cảnh + Ánh sáng + Góc máy + Phong cách</code>.
                </li>
                <li>Mô tả nhân vật giống hệt nhau giữa các prompt và kết hợp Tư liệu để khoá gương mặt.</li>
                <li>Video: ghi rõ chuyển động máy — “máy đẩy chậm”, “lia ngang”, “xoay 360°”.</li>
                <li>Reels/TikTok chọn 9:16; Seedance có 21:9 cho cảnh điện ảnh.</li>
                <li>
                  Seedance: điền <strong>Seed</strong> cố định để ra kết quả tương tự giữa các lần chạy; để trống = ngẫu nhiên.
                </li>
              </ul>
            </section>

            {/* 6 */}
            <section id="dong-nhat">
              <h2>Tư liệu & ảnh tham chiếu</h2>
              <p>
                Tab <strong>Tư liệu</strong> là nơi giữ “bản gốc” để mọi video đồng nhất. Người mẫu và ảnh luân phiên quản lý
                ở đây và bật/tắt nhanh ngay trong Studio.
              </p>
              <DocShot src="/screens/tu-lieu-focus.webp" w={1215} h={482} full="/screens/tu-lieu.webp" caption="Tư liệu: Nhân vật, Mẫu prompt, Người mẫu cố định, Ảnh luân phiên" />
              <DocTable
                head={["Khối", "Cách hoạt động", "Dùng khi"]}
                rows={[
                  [
                    "Nhân vật",
                    "Prompt có tên nhân vật (viết hoa đúng như tên, hoặc @tên) sẽ tự gắn ảnh của nhân vật đó. Ảnh đẹp ở Thư viện lưu thẳng vào đây được.",
                    "Xây series KOC/KOL ảo, nhiều nhân vật trong một batch",
                  ],
                  ["Mẫu prompt", "Lưu từ ô prompt ở Studio, chèn lại bằng “Chèn mẫu prompt…”.", "Nhân bản kịch bản đã ra số"],
                  ["Người mẫu cố định", "Khi bật, gắn vào mọi task (tối đa 3 ảnh).", "Cả batch dùng chung một gương mặt"],
                  [
                    "Ảnh luân phiên",
                    "Mỗi task lấy 1 ảnh kế tiếp (không giới hạn số ảnh), thêm bằng + Ảnh hoặc + Folder. App hiện “Ảnh tiếp theo: #n”.",
                    "Đa dạng góc chụp/outfit/sản phẩm",
                  ],
                ]}
              />
              <h3>Ảnh tham chiếu & Ảnh đầu / Ảnh cuối</h3>
              <ul>
                <li>
                  <strong>Muse</strong>: ô <em>Ảnh tham chiếu (tối đa 6)</em> — đính kèm cố định cho mọi prompt trong lượt.
                </li>
                <li>
                  <strong>Google Flow</strong>: <em>Ảnh đầu / Ảnh cuối</em> (tuỳ chọn) — khung hình mở đầu và kết thúc.
                </li>
                <li>
                  <strong>Seedance</strong>: chế độ <em>Ảnh → Video</em> hoặc <em>Đầu–cuối</em>.
                </li>
              </ul>
              <Callout type="warn">
                Chỉ dùng hình ảnh bạn có quyền sử dụng. Không dùng ảnh người thật khi chưa có sự đồng ý của họ.
              </Callout>
            </section>

            {/* 7 */}
            <section id="hang-doi">
              <h2>Hàng đợi, xử lý lỗi & ghép video</h2>
              <p>Cột giữa Studio là hàng đợi. Mỗi task hiện engine, loại, tỉ lệ, tài khoản đã chạy, thời gian và trạng thái.</p>
              <ul>
                <li>
                  <strong>Tìm prompt…</strong>, lọc <strong>Mọi trạng thái</strong>, sắp xếp <strong>Mới nhất</strong>.
                </li>
                <li>
                  <strong>Chọn lỗi</strong> / <strong>Chọn chưa chạy</strong> — chọn nhanh nhóm task cần xử lý.
                </li>
                <li>
                  Thanh dưới: <strong>Chạy</strong>, <strong>Dừng</strong>, <strong>Xoá</strong>, <strong>Chạy lại lỗi</strong>,{" "}
                  <strong>Ghép video</strong>.
                </li>
                <li>
                  Bấm một task để xem trước ở cột phải: <strong>Mở file</strong>, <strong>Tạo lại</strong>,{" "}
                  <strong>Chỉnh sửa</strong> prompt.
                </li>
              </ul>
              <h3>Cơ chế xử lý lỗi</h3>
              <ol>
                <li>Task lỗi tự chạy lại theo “Số lần thử khi lỗi” trong Cài đặt.</li>
                <li>Hết hạn mức ngày → tự chuyển sang tài khoản khác (nếu bật).</li>
                <li>Dính bộ lọc an toàn → tự tối ưu prompt rồi chạy lại (nếu bật).</li>
                <li>
                  Vẫn lỗi → task nằm ở trạng thái <strong>Lỗi</strong>: bấm <strong>Chọn lỗi</strong> →{" "}
                  <strong>Chạy lại lỗi</strong>, hoặc <strong>Chỉnh sửa</strong> prompt rồi tạo lại.
                </li>
              </ol>
              <h3>Thư viện & ghép video</h3>
              <DocShot src="/screens/thu-vien-focus.webp" w={1209} h={983} full="/screens/thu-vien.webp" caption="Thư viện: lọc dự án, ảnh/video, Ghép video, Đăng FB Reels" />
              <p>
                Thành phẩm nằm ở <strong>Thư viện</strong> (đường dẫn hiện ngay dưới tiêu đề). Chọn nhiều video →{" "}
                <strong>Ghép video</strong>; chọn ảnh đẹp → <strong>Lưu vào Tư liệu…</strong>; mỗi video có nút{" "}
                <strong>Mở</strong> và <strong>Đăng FB Reels</strong>.
              </p>
            </section>

            {/* 8 */}
            <section id="kich-ban">
              <h2>Kịch bản video</h2>
              <p>
                Tab <strong>Kịch bản</strong> biến một kịch bản phân cảnh thành video hoàn chỉnh có giọng đọc, nhạc nền và
                render trên Muse. Có 2 cách nhập: <strong>Kịch bản</strong> (viết theo mốc thời gian) hoặc{" "}
                <strong>Từ ảnh</strong>.
              </p>
              <CodeBlock title="Kịch bản theo mốc thời gian">{SCRIPT_EXAMPLE}</CodeBlock>
              <DocShot src="/screens/kich-ban-focus.webp" w={1462} h={737} full="/screens/kich-ban.webp" caption="Kịch bản: cách làm, tỉ lệ, giọng đọc, người dẫn, nhạc nền" />
              <DocTable
                head={["Tuỳ chọn", "Ý nghĩa"]}
                rows={[
                  ["Cách làm", "VD: Làm video thẳng · nhanh ~3 phút"],
                  ["Tỉ lệ", "VD: 9:16 · Dọc (TikTok, Reels)"],
                  ["Thời lượng", "VD: 30 giây · gộp các cảnh thành 1 lệnh"],
                  ["Tiền tố câu lệnh", "Thêm vào đầu mọi cảnh, VD: “Tạo video chân thực”"],
                  ["Giọng đọc / Người dẫn", "Chọn giọng AI (VD: Husky Campfire — Nam · khàn), người dẫn theo giọng đọc"],
                  ["Nhân vật dẫn", "Lấy từ Tư liệu → Nhân vật để giữ đúng gương mặt"],
                  ["Từng cảnh · Tự ghép khi xong", "Render từng cảnh rồi tự ghép thành 1 video"],
                  ["Nhạc nền · Ghép nhạc", "Chọn thư mục nhạc, app tự ghép vào video"],
                  ["Số bản / video", "Số phiên bản khác nhau cho cùng kịch bản"],
                  ["Ảnh sản phẩm (tuỳ chọn)", "Kéo thả nhiều ảnh: mỗi ảnh làm ra 1 bộ video riêng"],
                ]}
              />
              <p>
                Bấm <strong>Đưa vào hàng đợi</strong>, theo dõi theo bộ lọc <em>Tất cả · Chờ · Đang làm · Xong · Lỗi</em>, rồi
                bấm <strong>Bắt đầu render trên Muse</strong>. <strong>Thư mục video</strong> mở nơi lưu kết quả.
              </p>
            </section>

            {/* 9 */}
            <section id="ladipage">
              <h2>LadiPage → kịch bản video</h2>
              <p>
                Có sẵn landing page bán hàng? Dán link, MeAI lấy <strong>ảnh gốc, giá, chính sách</strong> và sinh{" "}
                <strong>3 kịch bản phân cảnh cho Muse</strong>.
              </p>
              <DocShot src="/screens/ladipage-focus.webp" w={1209} h={246} full="/screens/ladipage.webp" caption="LadiPage: 4 bước từ link đến hàng đợi" />
              <Steps
                items={[
                  { title: "Dán link", body: "Dán link LadiPage của sản phẩm, bấm Quét và sinh kịch bản." },
                  { title: "Chọn ảnh sản phẩm", body: "Chọn những ảnh gốc từ landing page muốn đưa vào video." },
                  { title: "Sửa kịch bản, chọn cách làm", body: "Chỉnh lại câu chữ, giá, ưu đãi trong 3 kịch bản AI sinh ra." },
                  { title: "Đưa vào hàng đợi", body: "Video được render trên Muse và lưu vào Thư viện như mọi task khác." },
                ]}
              />
            </section>

            {/* 10 */}
            <section id="dang-reels">
              <h2>Đăng Facebook Reels</h2>
              <p>
                MeAI đăng video lên Fanpage bằng <strong>Page Access Token</strong> (Graph API v20). Cần lấy token một lần
                trong Cài đặt.
              </p>
              <h3>Lấy token & quét Fanpage</h3>
              <Steps
                items={[
                  {
                    title: "Mở Graph API Explorer",
                    body: (
                      <>
                        Truy cập <code>developers.facebook.com/tools/explorer</code>.
                      </>
                    ),
                  },
                  { title: "Chọn User Token", body: "Ở mục User or Page, chọn User Token." },
                  {
                    title: "Tích quyền",
                    body: (
                      <>
                        <code>pages_show_list</code>, <code>pages_read_engagement</code>, <code>pages_manage_posts</code>,{" "}
                        <code>publish_video</code>.
                      </>
                    ),
                  },
                  {
                    title: "Generate Access Token → Quét Fanpage",
                    body: (
                      <>
                        Dán token (bắt đầu bằng <code>EAA…</code>) vào <strong>Cài đặt → Facebook token</strong>, bấm{" "}
                        <strong>Quét Fanpage</strong>. App tự lấy danh sách Fanpage bạn quản lý.
                      </>
                    ),
                  },
                ]}
              />
              <h3>Đăng video</h3>
              <DocShot src="/screens/dang-reels-focus.webp" w={1209} h={665} full="/screens/dang-reels.webp" caption="Đăng FB Reels: chọn video, caption, Đăng lên Reels" />
              <ol>
                <li>
                  Vào <strong>Đăng FB Reels</strong> (hoặc bấm nút <em>Đăng FB Reels</em> trên video trong Thư viện).
                </li>
                <li>
                  <strong>Video cần đăng</strong>: chọn trong kho hoặc <strong>Chọn file khác</strong>.
                </li>
                <li>
                  <strong>Caption</strong>: tiêu đề, caption chốt đơn kèm hashtag (VD: <code>#reels #xuhuong #freeship</code>).
                </li>
                <li>
                  Bấm <strong>Đăng lên Reels</strong>. Kết quả hiện ở <strong>Lịch sử đăng</strong>.
                </li>
              </ol>
              <Callout type="warn">
                Định dạng Reels là video dọc 9:16. Hãy tuân thủ Tiêu chuẩn cộng đồng của Meta, không đăng nội dung vi phạm bản
                quyền và không đăng quá dày trên Page mới.
              </Callout>
            </section>

            {/* 11 */}
            <section id="khac-phuc-su-co">
              <h2>Khắc phục sự cố</h2>
              <DocTable
                head={["Hiện tượng", "Nguyên nhân thường gặp", "Cách xử lý"]}
                rows={[
                  [
                    "Tài khoản báo lỗi phiên",
                    "Phiên đăng nhập hết hạn",
                    "Tài khoản → Kiểm tra phiên, bấm Hiện Chrome để đăng nhập lại.",
                  ],
                  [
                    "Hàng đợi đứng, task chờ mãi",
                    "Tài khoản hết tín dụng / chạm Daily Limit",
                    "Kiểm tra hạn mức, bật tự chuyển tài khoản, thêm tài khoản.",
                  ],
                  [
                    "Task lỗi liên tục",
                    "Prompt dính bộ lọc an toàn",
                    "Bật tự tối ưu prompt; bỏ tên thương hiệu/người nổi tiếng rồi Chạy lại lỗi.",
                  ],
                  ["Task video bị huỷ giữa chừng", "Vượt Giới hạn tạo video (phút)", "Tăng giới hạn trong Cài đặt."],
                  ["Proxy không chạy", "Sai định dạng hoặc proxy chết", "Nhập ip:port:user:pass, bấm Kiểm tra."],
                  [
                    "“Chưa kết nối Fanpage”",
                    "Chưa có token hoặc token thiếu quyền",
                    "Lấy lại token đủ 4 quyền, bấm Quét Fanpage.",
                  ],
                  [
                    "“License đã đạt giới hạn thiết bị”",
                    "Đã kích hoạt đủ số máy của gói",
                    <>
                      Vào{" "}
                      <Link href="/dashboard" className="text-cyan-glow hover:underline">
                        Quản lý License
                      </Link>{" "}
                      → gỡ máy cũ.
                    </>,
                  ],
                ]}
              />

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="glow-border rounded-2xl bg-panel p-5">
                  <MessageCircle className="h-5 w-5 text-cyan-glow" />
                  <p className="mt-3 font-semibold text-white">Vẫn bí? Hỏi team MeAI</p>
                  <p className="mt-1 text-sm text-slate-400">Nhắn Zalo kèm ảnh chụp lỗi, team kỹ thuật phản hồi nhanh.</p>
                  <a
                    href={siteConfig.contact.zalo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-cyan-glow hover:underline"
                  >
                    Mở Zalo hỗ trợ <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
                <div className="glow-border rounded-2xl bg-panel p-5">
                  <Download className="h-5 w-5 text-neon-pink" />
                  <p className="mt-3 font-semibold text-white">Bản mới nhất v{siteConfig.latestVersion}</p>
                  <p className="mt-1 text-sm text-slate-400">Nhiều lỗi đã được sửa ở phiên bản mới — hãy cập nhật trước.</p>
                  <ButtonLink href={siteConfig.downloadUrl} download size="sm" className="mt-3">
                    Tải bản cài đặt
                  </ButtonLink>
                </div>
              </div>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
