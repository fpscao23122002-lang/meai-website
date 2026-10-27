import { FileText, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/layout/PageHero";
import { Link } from "@/components/ui/Link";
import { TelegramIcon } from "@/components/ui/TelegramIcon";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useProseReveal } from "@/hooks/useProseReveal";
import { siteConfig } from "@/lib/site";
import { PLAN_RULES } from "../../shared/plans";

const { legal, contact } = siteConfig;

function Owner() {
  return legal.company ? (
    <>
      <strong>{legal.company}</strong>
      {legal.taxId ? <> (MST {legal.taxId})</> : null}
      {legal.address ? <>, địa chỉ {legal.address}</> : null}
    </>
  ) : (
    <strong>đội ngũ phát triển MeAI Studio</strong>
  );
}

function Contact() {
  return (
    <p>
      Mọi câu hỏi, yêu cầu về tài khoản và dữ liệu, vui lòng nhắn Telegram{" "}
      <a href={contact.telegram} target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-glow hover:underline">
        {contact.telegramHandle}
      </a>{" "}
      — kênh hỗ trợ chính thức duy nhất của MeAI.
    </p>
  );
}

function Terms() {
  const devices = Object.values(PLAN_RULES)
    .map((r) => `${r.name}: ${r.maxDevices} máy`)
    .join(", ");
  return (
    <>
      <section id="pham-vi">
        <h2>1. Phạm vi áp dụng</h2>
        <p>
          Điều khoản này áp dụng cho website {siteConfig.url.replace(/^https?:\/\//, "")}, Khu vực khách hàng và phần mềm MeAI Studio
          cho Windows (gọi chung là “MeAI”), do <Owner /> cung cấp. Khi đăng nhập, mua gói hoặc sử dụng phần mềm, bạn đồng ý với các
          điều khoản dưới đây.
        </p>
      </section>

      <section id="tai-khoan">
        <h2>2. Tài khoản MeAI</h2>
        <ul>
          <li>
            Bạn đăng nhập MeAI <strong>duy nhất bằng tài khoản Google</strong>. Tài khoản Google này giữ toàn bộ thông tin gói cước,
            hạn dùng, thiết bị và đơn hàng của bạn, dùng chung cho website và phần mềm.
          </li>
          <li>Mỗi tài khoản dành cho một người hoặc một đơn vị sử dụng. Không chia sẻ, cho thuê hay bán lại tài khoản.</li>
          <li>
            Số máy tính dùng cùng lúc theo gói: {devices}. Bạn tự gỡ máy cũ trong{" "}
            <Link href="/dashboard" className="text-cyan-glow hover:underline">
              Khu vực khách hàng
            </Link>
            .
          </li>
          <li>Bạn chịu trách nhiệm bảo mật tài khoản Google của mình và mọi hoạt động diễn ra dưới tài khoản đó.</li>
        </ul>
      </section>

      <section id="goi-cuoc">
        <h2>3. Gói cước & thanh toán</h2>
        <ul>
          <li>
            Giá và quyền lợi từng gói được công bố tại{" "}
            <Link href="/#bang-gia" className="text-cyan-glow hover:underline">
              Bảng giá
            </Link>
            . Phí gói là phí sử dụng phần mềm; lượt tạo ảnh/video được tính trên tài khoản nền tảng AI của chính bạn.
          </li>
          <li>Thanh toán bằng chuyển khoản / VietQR theo đúng mã đơn. Gói được kích hoạt vào tài khoản Google khi thanh toán được xác nhận.</li>
          <li>Gói không tự gia hạn và không tự trừ tiền. Gia hạn trước hạn được cộng nối tiếp, không mất ngày còn lại.</li>
          <li>
            Trường hợp thanh toán sai nội dung, thiếu tiền hoặc cần hỗ trợ về đơn hàng, vui lòng liên hệ Telegram {contact.telegramHandle}{" "}
            kèm mã đơn để được xử lý.
          </li>
        </ul>
      </section>

      <section id="nen-tang">
        <h2>4. Tài khoản nền tảng bên thứ ba</h2>
        <p>
          MeAI là công cụ tự động hoá thao tác trên <strong>tài khoản của chính bạn</strong> tại các nền tảng AI và mạng xã hội (như
          Muse, Google Flow, Seedance, Dola, Facebook). MeAI không cung cấp, không bán tài khoản hay lượt tạo video của các nền tảng này.
        </p>
        <ul>
          <li>Bạn tự chịu trách nhiệm tuân thủ điều khoản sử dụng và chính sách nội dung của từng nền tảng.</li>
          <li>MeAI không chịu trách nhiệm khi nền tảng bên thứ ba giới hạn, tạm khoá tài khoản hoặc thay đổi tính năng, giá cả.</li>
        </ul>
      </section>

      <section id="noi-dung">
        <h2>5. Nội dung bạn tạo ra</h2>
        <ul>
          <li>Bạn sở hữu và chịu trách nhiệm về prompt, hình ảnh, video và nội dung bạn tạo, đăng tải bằng MeAI.</li>
          <li>
            Không dùng MeAI để tạo nội dung vi phạm pháp luật, xâm phạm quyền tác giả, quyền hình ảnh của người khác, giả mạo cá nhân / tổ
            chức, lừa đảo hoặc quảng cáo sai sự thật.
          </li>
        </ul>
      </section>

      <section id="cam">
        <h2>6. Hành vi bị cấm</h2>
        <ul>
          <li>Bẻ khoá, dịch ngược, can thiệp vào cơ chế cấp phép hoặc hệ thống tài khoản của MeAI.</li>
          <li>Phân phối lại, bán lại phần mềm hoặc quyền sử dụng khi chưa có thoả thuận bằng văn bản.</li>
          <li>Gây quá tải, dò quét hoặc tấn công website và API của MeAI.</li>
        </ul>
        <p>Vi phạm các điều trên có thể dẫn tới việc tạm khoá hoặc chấm dứt tài khoản mà không hoàn phí.</p>
      </section>

      <section id="dich-vu">
        <h2>7. Cập nhật & gián đoạn dịch vụ</h2>
        <p>
          MeAI liên tục cập nhật để theo kịp thay đổi của các nền tảng AI. Bản cập nhật trong thời hạn gói được cung cấp miễn phí. Dịch
          vụ có thể tạm gián đoạn khi bảo trì hoặc do sự cố từ nhà cung cấp hạ tầng; chúng tôi sẽ thông báo và khắc phục sớm nhất có
          thể.
        </p>
      </section>

      <section id="trach-nhiem">
        <h2>8. Giới hạn trách nhiệm</h2>
        <p>
          MeAI được cung cấp “như hiện có”. Trong phạm vi pháp luật cho phép, MeAI không chịu trách nhiệm cho thiệt hại gián tiếp phát
          sinh từ việc sử dụng phần mềm, bao gồm doanh thu bị mất hoặc tài khoản nền tảng bị hạn chế. Trách nhiệm tối đa không vượt quá
          số tiền bạn đã thanh toán cho gói đang sử dụng.
        </p>
      </section>

      <section id="thay-doi">
        <h2>9. Thay đổi điều khoản</h2>
        <p>
          Điều khoản có thể được cập nhật. Phiên bản mới có hiệu lực kể từ ngày đăng trên trang này; thay đổi quan trọng sẽ được thông
          báo trên website hoặc trong phần mềm.
        </p>
      </section>

      <section id="lien-he">
        <h2>10. Liên hệ</h2>
        <Contact />
      </section>
    </>
  );
}

function Privacy() {
  return (
    <>
      <section id="thu-thap">
        <h2>1. Dữ liệu chúng tôi thu thập</h2>
        <ul>
          <li>
            <strong>Từ Google khi bạn đăng nhập:</strong> mã định danh tài khoản Google, họ tên, địa chỉ email và ảnh đại diện. MeAI không
            nhận mật khẩu Google và không yêu cầu quyền truy cập Gmail, Drive hay dữ liệu Google khác.
          </li>
          <li>
            <strong>Thiết bị dùng phần mềm:</strong> mã thiết bị, tên máy và thời điểm hoạt động gần nhất — để áp dụng giới hạn số máy
            của gói.
          </li>
          <li>
            <strong>Đơn hàng:</strong> gói, số tiền, mã đơn, trạng thái và mã giao dịch ngân hàng dùng để đối soát. MeAI không lưu số
            thẻ hay thông tin đăng nhập ngân hàng.
          </li>
          <li>
            <strong>Phiên đăng nhập:</strong> cookie <code>__Host-meai_session</code> (HttpOnly) để giữ bạn đăng nhập trên website.
          </li>
        </ul>
        <p>
          Website và hệ thống tài khoản MeAI không nhận prompt, hình ảnh hay video bạn tạo ra.
        </p>
      </section>

      <section id="muc-dich">
        <h2>2. Mục đích sử dụng</h2>
        <ul>
          <li>Xác thực đăng nhập trên website và phần mềm.</li>
          <li>Kích hoạt, gia hạn gói và cho phần mềm biết bạn đang dùng gói nào, còn hạn tới khi nào.</li>
          <li>Quản lý thiết bị, xử lý đơn hàng và hỗ trợ khi bạn liên hệ.</li>
        </ul>
        <p>
          MeAI không bán, cho thuê dữ liệu cá nhân và không dùng dữ liệu của bạn cho quảng cáo. Việc MeAI sử dụng thông tin nhận từ
          Google API tuân thủ{" "}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-glow hover:underline"
          >
            Google API Services User Data Policy
          </a>
          , bao gồm các yêu cầu Limited Use.
        </p>
      </section>

      <section id="ben-thu-ba">
        <h2>3. Dịch vụ bên thứ ba</h2>
        <ul>
          <li>
            <strong>Google</strong> — đăng nhập (Google Identity Services) và phông chữ website.
          </li>
          <li>
            <strong>Cloudflare</strong> — lưu trữ website, máy chủ API và cơ sở dữ liệu tài khoản.
          </li>
          <li>
            <strong>VietQR</strong> — tạo ảnh mã QR thanh toán khi bạn mở đơn hàng.
          </li>
          <li>
            <strong>Dịch vụ đối soát ngân hàng</strong> (nếu được bật) — thông báo giao dịch chuyển khoản để kích hoạt gói tự động.
          </li>
          <li>
            <strong>Telegram</strong> — khi bạn chủ động nhắn tin cho bộ phận hỗ trợ.
          </li>
        </ul>
      </section>

      <section id="luu-tru">
        <h2>4. Lưu trữ & bảo mật</h2>
        <ul>
          <li>Dữ liệu được truyền qua HTTPS và lưu trên hạ tầng Cloudflare.</li>
          <li>Token đăng nhập chỉ được lưu dưới dạng mã băm (SHA-256), không lưu bản gốc.</li>
          <li>Gỡ một máy trong Khu vực khách hàng sẽ thu hồi phiên đăng nhập phần mềm trên máy đó.</li>
          <li>Dữ liệu tài khoản được lưu trong thời gian tài khoản còn sử dụng; lịch sử đơn hàng được giữ để phục vụ đối soát, kế toán.</li>
        </ul>
      </section>

      <section id="cookie">
        <h2>5. Cookie & lưu trữ trên trình duyệt</h2>
        <p>
          MeAI chỉ dùng cookie đăng nhập nêu trên và bộ nhớ trình duyệt (localStorage) cho một số tuỳ chọn hiển thị. MeAI không dùng
          cookie quảng cáo hay công cụ theo dõi của bên thứ ba.
        </p>
      </section>

      <section id="quyen">
        <h2>6. Quyền của bạn</h2>
        <ul>
          <li>
            Xem thông tin tài khoản, gói, thiết bị và đơn hàng bất cứ lúc nào trong{" "}
            <Link href="/dashboard" className="text-cyan-glow hover:underline">
              Khu vực khách hàng
            </Link>
            .
          </li>
          <li>Yêu cầu chỉnh sửa hoặc xoá dữ liệu cá nhân bằng cách nhắn Telegram {contact.telegramHandle} từ chính tài khoản liên quan.</li>
          <li>
            Thu hồi quyền đăng nhập của MeAI bất cứ lúc nào tại{" "}
            <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-cyan-glow hover:underline">
              myaccount.google.com/permissions
            </a>
            .
          </li>
        </ul>
        <p>Chúng tôi xử lý dữ liệu cá nhân theo quy định pháp luật Việt Nam về bảo vệ dữ liệu cá nhân.</p>
      </section>

      <section id="thay-doi">
        <h2>7. Thay đổi chính sách</h2>
        <p>Chính sách có thể được cập nhật; phiên bản mới có hiệu lực kể từ ngày đăng trên trang này.</p>
      </section>

      <section id="lien-he">
        <h2>8. Liên hệ</h2>
        <p>
          Đơn vị chịu trách nhiệm dữ liệu: <Owner />.
        </p>
        <Contact />
      </section>
    </>
  );
}

const DOCS = {
  terms: {
    path: "/dieu-khoan",
    title: "Điều khoản sử dụng",
    description: "Điều khoản sử dụng website và phần mềm MeAI Studio: tài khoản Google, gói cước, thanh toán và trách nhiệm khi dùng nền tảng AI.",
    Icon: FileText,
    Body: Terms,
  },
  privacy: {
    path: "/bao-mat",
    title: "Chính sách bảo mật",
    description: "MeAI thu thập dữ liệu gì khi bạn đăng nhập bằng Google, dùng để làm gì, lưu ở đâu và quyền của bạn với dữ liệu cá nhân.",
    Icon: ShieldCheck,
    Body: Privacy,
  },
} as const;

export default function LegalPage({ doc }: { doc: keyof typeof DOCS }) {
  const d = DOCS[doc];
  usePageMeta({ title: d.title, description: d.description, path: d.path });
  useProseReveal();
  const other = doc === "terms" ? DOCS.privacy : DOCS.terms;

  return (
    <>
      <Navbar />
      <main className="relative pt-16">
        <PageHero
          badge={
            <>
              <d.Icon className="h-3.5 w-3.5" /> Cập nhật {legal.updatedAt}
            </>
          }
          title={[{ text: d.title, className: "text-gradient" }]}
          description={d.description}
        />
        <div className="container grid gap-10 pb-16 pt-10 lg:grid-cols-[minmax(0,1fr)_260px]">
          <article key={doc} className="prose-doc min-w-0 max-w-3xl">
            <d.Body />
          </article>
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="glow-border rounded-2xl bg-panel p-5">
                <p className="text-xs uppercase tracking-wider text-slate-500">Xem thêm</p>
                <Link href={other.path} className="mt-2 flex items-center gap-2 font-semibold text-white hover:text-cyan-glow">
                  <other.Icon className="h-4 w-4 text-cyan-glow" /> {other.title}
                </Link>
              </div>
              <div className="glow-border rounded-2xl bg-panel p-5">
                <p className="text-sm text-slate-400">Cần giải đáp về điều khoản hay dữ liệu của bạn?</p>
                <a
                  href={contact.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-glow hover:underline"
                >
                  <TelegramIcon className="h-4 w-4" /> {contact.telegramHandle}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
