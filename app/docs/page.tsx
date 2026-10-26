import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { Callout, CodeBlock, DocTable, Steps } from "@/components/docs/DocBlocks";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hướng dẫn sử dụng",
  description:
    "Tài liệu hướng dẫn MeAI Studio: cài đặt, kích hoạt License, thêm tài khoản AI, viết prompt hàng loạt, dùng ảnh tham chiếu và tự động đăng Facebook Reels.",
};

const PROMPT_FORMULA = `[Chủ thể] + [Hành động] + [Bối cảnh] + [Ánh sáng] + [Góc máy / chuyển động] + [Phong cách]`;

const PROMPT_EXAMPLE = `Cô gái 25 tuổi thoa serum lên má, phòng tắm tông trắng, nắng sớm xuyên rèm, cận mặt máy đẩy chậm, phong cách quảng cáo mỹ phẩm Hàn Quốc
Cô gái 25 tuổi cầm lọ serum giơ lên camera, bàn trang điểm gỗ sáng, đèn ring light, trung cảnh, phong cách UGC TikTok
Lọ serum đặt trên đá cẩm thạch, giọt nước lăn trên thân chai, ánh sáng studio dịu, macro xoay 180°, phong cách sản phẩm cao cấp
Cô gái 25 tuổi soi gương mỉm cười, da căng bóng, ánh hoàng hôn, toàn cảnh máy lia ngang, phong cách điện ảnh`;

export default function DocsPage() {
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
            Từ lúc tải bộ cài đến khi video đầu tiên lên sóng Reels — đọc theo thứ tự hoặc nhảy thẳng tới phần bạn cần.
            Mất khoảng 15 phút để làm chủ toàn bộ workflow.
          </p>
        </header>

        <div className="container grid gap-10 pb-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14">
          <DocsSidebar />

          <article className="prose-doc min-w-0 max-w-3xl pb-10 lg:pt-4">
            {/* 1 */}
            <section id="tong-quan">
              <h2>Tổng quan</h2>
              <p>
                MeAI Studio là phần mềm Desktop cho Windows, đóng vai trò <strong>“quản đốc xưởng”</strong> điều phối các
                engine AI tạo ảnh & video (Muse, Google Flow, Seedance). Bạn cung cấp tài khoản AI, danh sách prompt và tư
                liệu hình ảnh — MeAI lo phần chia việc, chạy song song, xử lý lỗi, tải thành phẩm, ghép video và đăng
                Reels.
              </p>
              <p>Các khu vực chính trong app:</p>
              <ul>
                <li>
                  <strong>Studio</strong> — nơi chọn engine, chế độ (ảnh/video), tỉ lệ, ảnh tham chiếu và nhập prompt.
                </li>
                <li>
                  <strong>Tư liệu</strong> — kho ảnh người mẫu, ảnh sản phẩm, logo dùng làm tham chiếu.
                </li>
                <li>
                  <strong>Kịch bản</strong> — lưu các bộ prompt/hook đã “win” để tái sử dụng.
                </li>
                <li>
                  <strong>Thư viện</strong> — toàn bộ ảnh/video đã tạo, lọc theo dự án, engine, ngày.
                </li>
                <li>
                  <strong>Tài khoản</strong> & <strong>Hàng đợi</strong> — quản lý pool tài khoản và theo dõi tiến độ task.
                </li>
                <li>
                  <strong>Ghép video</strong>, <strong>Đăng Reels</strong>, <strong>LadiPage</strong> — hậu kỳ và phân phối.
                </li>
              </ul>
            </section>

            {/* 2 */}
            <section id="cai-dat">
              <h2>Cài đặt & kích hoạt</h2>
              <h3>Yêu cầu hệ thống</h3>
              <DocTable
                head={["Thành phần", "Tối thiểu", "Khuyến nghị"]}
                rows={[
                  ["Hệ điều hành", "Windows 10 64-bit", "Windows 11 64-bit"],
                  ["RAM", "8 GB", "16 GB trở lên (chạy > 10 luồng)"],
                  ["CPU", "4 nhân", "Intel i5 Gen 10 / Ryzen 5 trở lên"],
                  ["Ổ cứng trống", "5 GB", "SSD, 50 GB+ để lưu thư viện video"],
                  ["Mạng", "20 Mbps", "100 Mbps, ổn định"],
                ]}
              />
              <h3>Các bước cài đặt</h3>
              <Steps
                items={[
                  {
                    title: "Tải bộ cài",
                    body: (
                      <>
                        Tải file <code>MeAI-Studio-Setup-x64.exe</code> ({siteConfig.installerSize}) tại trang chủ hoặc mục{" "}
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
                        Nếu Windows SmartScreen hiện cảnh báo, bấm <strong>More info → Run anyway</strong>. Chọn thư mục cài
                        đặt (khuyến nghị ổ SSD) rồi bấm <strong>Install</strong>.
                      </>
                    ),
                  },
                  {
                    title: "Mở app & nhập License Key",
                    body: (
                      <>
                        Lần đầu mở app, cửa sổ kích hoạt hiện ra. Dán License Key dạng <code>MEAI-XXXX-XXXX-XXXX</code> đã
                        nhận qua email rồi bấm <strong>Kích hoạt</strong>. Chưa mua? Chọn <strong>Dùng thử 3 ngày</strong>.
                      </>
                    ),
                  },
                  {
                    title: "Cập nhật tự động",
                    body: "MeAI tự kiểm tra phiên bản mới mỗi khi khởi động và hỏi bạn trước khi cập nhật. Dữ liệu, tài khoản và thư viện được giữ nguyên.",
                  },
                ]}
              />
              <Callout type="warn">
                Một số phần mềm diệt virus có thể chặn nhầm vì MeAI điều khiển trình duyệt tự động. Hãy thêm thư mục cài
                đặt vào danh sách loại trừ (Exclusions) nếu app không khởi động được.
              </Callout>
            </section>

            {/* 3 */}
            <section id="them-tai-khoan">
              <h2>Thêm tài khoản AI</h2>
              <p>
                Mỗi tài khoản là một “công nhân” trong xưởng. Càng nhiều tài khoản, hàng đợi chạy càng nhanh vì MeAI phân
                bổ task song song cho tất cả tài khoản đang rảnh.
              </p>
              <Steps
                items={[
                  {
                    title: "Mở tab Tài khoản → Thêm tài khoản",
                    body: "Chọn engine tương ứng: Muse, Google Flow hoặc Seedance. Đặt tên gợi nhớ (VD: flow_acc_01).",
                  },
                  {
                    title: "Đăng nhập trong cửa sổ trình duyệt riêng",
                    body: "MeAI mở một profile trình duyệt cô lập cho từng tài khoản. Đăng nhập như bình thường, kể cả xác minh 2 bước. Đóng cửa sổ khi đã vào được trang chính.",
                  },
                  {
                    title: "Kiểm tra trạng thái",
                    body: (
                      <>
                        Tài khoản hợp lệ hiển thị chấm xanh <strong>Sẵn sàng</strong>. Bấm <strong>Kiểm tra</strong> để
                        xem số credit/lượt còn lại (nếu engine hỗ trợ).
                      </>
                    ),
                  },
                  {
                    title: "Gom nhóm (tùy chọn)",
                    body: "Gắn tag theo dự án hoặc theo khách hàng để giới hạn hàng đợi chỉ dùng một nhóm tài khoản nhất định.",
                  },
                ]}
              />
              <Callout type="info">
                Phiên đăng nhập và cookie được mã hóa và lưu cục bộ trên máy bạn. MeAI không gửi thông tin tài khoản về
                server. Khi chuyển máy, dùng chức năng <strong>Xuất / Nhập tài khoản</strong> để mang theo.
              </Callout>
              <Callout type="tip">
                Với batch lớn, hãy trộn tài khoản của nhiều engine: Seedance cho cảnh chuyển động nhanh, Google Flow cho cảnh
                cần chi tiết cao, Muse cho ảnh/video sản phẩm.
              </Callout>
            </section>

            {/* 4 */}
            <section id="prompt-hang-loat">
              <h2>Viết prompt hàng loạt</h2>
              <p>
                Trong Studio, ô <strong>Danh sách prompt</strong> nhận <strong>mỗi dòng là một task</strong>. Bạn có thể dán
                trực tiếp, nhập từ file <code>.txt</code> / <code>.csv</code>, hoặc kéo một bộ có sẵn từ tab{" "}
                <strong>Kịch bản</strong>.
              </p>
              <h3>Công thức prompt ra video “ăn view”</h3>
              <CodeBlock title="Công thức">{PROMPT_FORMULA}</CodeBlock>
              <p>Ví dụ một bộ 4 prompt cho chiến dịch serum, giữ cùng nhân vật nhưng đổi bối cảnh để tránh trùng lặp:</p>
              <CodeBlock title="serum-q4.txt">{PROMPT_EXAMPLE}</CodeBlock>
              <h3>Nguyên tắc để batch chạy mượt</h3>
              <ul>
                <li>Mỗi prompt tối đa 1–2 câu, ưu tiên danh từ & động từ cụ thể thay vì tính từ chung chung.</li>
                <li>
                  Mô tả nhân vật <strong>giống hệt nhau</strong> giữa các dòng (tuổi, tóc, trang phục) — kết hợp ảnh tham
                  chiếu để khóa khuôn mặt.
                </li>
                <li>Mô tả chuyển động máy rõ ràng cho video: “máy đẩy chậm”, “lia ngang”, “xoay 360°”.</li>
                <li>Tránh tên thương hiệu, người nổi tiếng và nội dung nhạy cảm — đây là nguyên nhân số 1 khiến task bị từ chối.</li>
                <li>Với Reels, chọn tỉ lệ <code>9:16</code>; YouTube/Facebook feed dùng <code>16:9</code> hoặc <code>1:1</code>.</li>
              </ul>
              <Callout type="tip">
                Nhờ ChatGPT/Claude viết nhanh 50 biến thể theo công thức trên, rồi dán thẳng vào MeAI. Bộ nào ra số đẹp, lưu
                vào <strong>Kịch bản</strong> để nhân bản cho sản phẩm khác.
              </Callout>
            </section>

            {/* 5 */}
            <section id="anh-tham-chieu">
              <h2>Ảnh tham chiếu & đồng nhất nhân vật</h2>
              <p>
                Đây là “vũ khí” để làm series video cùng một KOC ảo hoặc cùng một sản phẩm mà không bị lệch mặt, lệch bao
                bì. MeAI hỗ trợ ba chế độ:
              </p>
              <DocTable
                head={["Chế độ", "Cách hoạt động", "Dùng khi"]}
                rows={[
                  [
                    "Người mẫu",
                    "Chọn 1 người mẫu từ Tư liệu, MeAI đính kèm bộ ảnh khuôn mặt đó vào mọi prompt trong batch.",
                    "Xây kênh KOC/KOL ảo, series review cùng một người.",
                  ],
                  [
                    "Ảnh luân phiên",
                    "Chọn nhiều ảnh, mỗi prompt lần lượt dùng một ảnh theo vòng (1 → 2 → 3 → 1…).",
                    "Cần đa dạng góc chụp/outfit nhưng vẫn cùng nhân vật, sản phẩm.",
                  ],
                  [
                    "Ảnh tham chiếu",
                    "Đính kèm cố định tối đa 6 ảnh cho mỗi prompt (mặt, dáng, sản phẩm, logo…).",
                    "Video sản phẩm cần đúng bao bì, màu sắc, chi tiết.",
                  ],
                ]}
              />
              <h3>Chuẩn bị ảnh tham chiếu tốt</h3>
              <ul>
                <li>Ảnh rõ nét, đủ sáng, tối thiểu 1024px cạnh ngắn; nền đơn giản càng tốt.</li>
                <li>Với người mẫu: 1 ảnh chính diện, 1 ảnh nghiêng 3/4, 1 ảnh toàn thân là đủ để giữ nhận diện.</li>
                <li>Với sản phẩm: chụp mặt trước có logo, một ảnh cầm trên tay để AI hiểu kích thước thật.</li>
                <li>
                  Tỉ lệ đầu ra chọn tự do: <code>9:16</code>, <code>16:9</code>, <code>1:1</code>, <code>4:3</code>,{" "}
                  <code>3:4</code> — không cần ảnh tham chiếu cùng tỉ lệ.
                </li>
              </ul>
              <Callout type="warn">
                Chỉ sử dụng hình ảnh bạn có quyền sử dụng. Không dùng ảnh người thật khi chưa có sự đồng ý của họ.
              </Callout>
            </section>

            {/* 6 */}
            <section id="hang-doi">
              <h2>Hàng đợi & ghép video</h2>
              <p>
                Khi bấm <strong>Chạy</strong>, toàn bộ prompt được đẩy vào Hàng đợi. Hệ thống làm việc theo nguyên tắc:
              </p>
              <ol>
                <li>
                  <strong>Tự phân bổ:</strong> task tiếp theo luôn được giao cho tài khoản đang rảnh — không tài khoản nào
                  phải ngồi chơi.
                </li>
                <li>
                  <strong>Tự lọc lỗi:</strong> task bị từ chối, timeout hoặc tài khoản hết lượt được đánh dấu và đưa lại vào
                  cuối hàng đợi, chuyển sang tài khoản khác.
                </li>
                <li>
                  <strong>Giới hạn retry:</strong> mặc định chạy lại tối đa 3 lần. Task vẫn lỗi được gom vào bộ lọc{" "}
                  <strong>Lỗi</strong> để bạn sửa prompt và chạy lại một chạm.
                </li>
                <li>
                  <strong>Tự tải về:</strong> thành phẩm được lưu vào Thư viện theo cấu trúc <code>Dự án / Ngày / Engine</code>.
                </li>
              </ol>
              <h3>Ghép video trực tiếp</h3>
              <p>
                Chọn nhiều clip trong Thư viện → <strong>Ghép video</strong>. Sắp xếp thứ tự bằng kéo-thả, thêm hiệu ứng
                chuyển cảnh, chèn nhạc nền và xuất ra một video hoàn chỉnh đúng tỉ lệ đã chọn — không cần CapCut hay
                Premiere.
              </p>
              <Callout type="tip">
                Muốn ưu tiên một dự án gấp? Kéo dự án đó lên đầu Hàng đợi, các task khác sẽ tạm lùi lại mà không bị hủy.
              </Callout>
            </section>

            {/* 7 */}
            <section id="dang-reels">
              <h2>Đăng Facebook Reels tự động</h2>
              <Steps
                items={[
                  {
                    title: "Kết nối Fanpage",
                    body: "Vào tab Đăng Reels → Thêm Fanpage. Đăng nhập Facebook trong cửa sổ riêng của MeAI, chọn các Page bạn quản trị.",
                  },
                  {
                    title: "Chọn video từ Thư viện",
                    body: "Lọc video tỉ lệ 9:16, thời lượng phù hợp Reels. Có thể chọn hàng loạt cả trăm video một lúc.",
                  },
                  {
                    title: "Viết caption & hashtag",
                    body: (
                      <>
                        Nhập caption chung hoặc riêng cho từng video. Dùng nhiều dòng caption để MeAI xoay vòng, tránh trùng
                        lặp nội dung. Gắn link sản phẩm/LadiPage ở bình luận đầu nếu cần.
                      </>
                    ),
                  },
                  {
                    title: "Lên lịch",
                    body: "Chọn khung giờ vàng (VD: 11:30, 18:30, 21:00), số video mỗi Page mỗi ngày và khoảng nghỉ ngẫu nhiên giữa các lần đăng.",
                  },
                  {
                    title: "Theo dõi",
                    body: "Tab Lịch đăng hiển thị trạng thái từng video: Chờ đăng, Đã đăng (kèm link), Lỗi (kèm lý do). Video lỗi có thể đăng lại một chạm.",
                  },
                ]}
              />
              <Callout type="warn">
                Đừng đăng quá dày trên Page mới. Khuyến nghị bắt đầu 3–5 Reels/ngày/Page, tăng dần sau 1–2 tuần. Luôn tuân
                thủ Tiêu chuẩn cộng đồng của Meta và không reup nội dung có bản quyền.
              </Callout>
            </section>

            {/* 8 */}
            <section id="ladipage">
              <h2>Tích hợp LadiPage</h2>
              <p>
                Đẩy ảnh/video sản phẩm vừa tạo thẳng lên landing page để chạy ads hoặc gắn link Reels, không cần tải về rồi
                upload thủ công.
              </p>
              <ol>
                <li>
                  Vào <strong>Cài đặt → Tích hợp → LadiPage</strong>, dán API Key lấy từ tài khoản LadiPage của bạn.
                </li>
                <li>Chọn landing page đích và khu vực (section) muốn cập nhật media.</li>
                <li>
                  Trong Thư viện, chọn ảnh/video → <strong>Gửi sang LadiPage</strong>. Media được tải lên thư viện của
                  LadiPage và sẵn sàng sử dụng.
                </li>
              </ol>
            </section>

            {/* 9 */}
            <section id="khac-phuc-su-co">
              <h2>Khắc phục sự cố</h2>
              <DocTable
                head={["Hiện tượng", "Nguyên nhân thường gặp", "Cách xử lý"]}
                rows={[
                  [
                    "Tài khoản báo “Hết phiên”",
                    "Cookie hết hạn hoặc engine yêu cầu đăng nhập lại",
                    "Bấm Đăng nhập lại trong tab Tài khoản. Bật “Tự làm mới phiên” trong Cài đặt.",
                  ],
                  [
                    "Task lỗi liên tục",
                    "Prompt vi phạm chính sách nội dung của engine",
                    "Mở bộ lọc Lỗi, đọc lý do, bỏ tên thương hiệu/người nổi tiếng rồi chạy lại.",
                  ],
                  [
                    "Hàng đợi chạy chậm",
                    "Ít tài khoản rảnh hoặc tài khoản hết credit",
                    "Thêm tài khoản, kiểm tra credit, giảm số luồng nếu mạng yếu.",
                  ],
                  [
                    "“License đã đạt giới hạn thiết bị”",
                    "Đã kích hoạt đủ số máy của gói",
                    <>
                      Vào{" "}
                      <Link href="/dashboard" className="text-cyan-glow hover:underline">
                        Quản lý License
                      </Link>{" "}
                      → gỡ máy cũ, sau đó kích hoạt lại.
                    </>,
                  ],
                  [
                    "Đăng Reels thất bại",
                    "Page bị hạn chế hoặc video sai định dạng",
                    "Kiểm tra Page Quality, đảm bảo video 9:16, dưới 90 giây.",
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
