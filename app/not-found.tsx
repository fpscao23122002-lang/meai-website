import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="container flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
        <p className="text-gradient text-8xl font-extrabold">404</p>
        <h1 className="mt-4 text-2xl font-bold text-white">Trang này đã bị AI “render” mất rồi</h1>
        <p className="mt-3 max-w-md text-slate-400">Đường dẫn không tồn tại hoặc đã được di chuyển.</p>
        <div className="mt-8 flex gap-3">
          <ButtonLink href="/">Về trang chủ</ButtonLink>
          <ButtonLink href="/docs" variant="outline">
            Xem hướng dẫn
          </ButtonLink>
        </div>
      </main>
      <Footer />
    </>
  );
}
