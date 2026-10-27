import { lazy, Suspense, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ScrollManager } from "@/components/layout/ScrollManager";
import { ScrollProgress } from "@/components/fx/ScrollProgress";
import { Aurora } from "@/components/fx/Aurora";
import { ScrollProvider } from "@/components/fx/ScrollProvider";
import { CursorGlow } from "@/components/fx/CursorGlow";
import { RippleLayer } from "@/components/fx/Ripple";
import { BackToTop } from "@/components/fx/BackToTop";
import { Intro } from "@/components/fx/Intro";
import { OffscreenPause } from "@/components/fx/OffscreenPause";
import HomePage from "@/pages/HomePage";

// Trang phụ tải theo nhu cầu để trang chủ nhẹ hơn
const DocsPage = lazy(() => import("@/pages/DocsPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const AppConnectPage = lazy(() => import("@/pages/AppConnectPage"));

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-glow/30 border-t-cyan-glow" />
    </div>
  );
}

export default function App() {
  const location = useLocation();
  // Trang chính chỉ dựng khi màn mở đầu bắt đầu "mở rèm" → hiệu ứng xuất hiện của trang chạy đúng lúc
  // Trang /app/* (app desktop mở để đăng nhập) vào thẳng nội dung, không chạy màn mở đầu
  const [skipIntro] = useState(() => location.pathname.startsWith("/app/"));
  const [revealed, setRevealed] = useState(skipIntro);

  return (
    // reducedMotion="user": tự tắt hiệu ứng chuyển động nếu người dùng bật "Giảm chuyển động" trong hệ điều hành
    <MotionConfig reducedMotion="user">
      <ScrollProvider>
      {skipIntro ? null : <Intro onReveal={() => setRevealed(true)} />}
      <Aurora />
      <CursorGlow />
      <RippleLayer />
      <ScrollProgress />
      <BackToTop />
      {/* ScrollManager dựng cùng trang để cuộn tới #section sau khi màn mở đầu kết thúc */}
      {revealed ? <ScrollManager /> : null}
      {revealed ? <OffscreenPause /> : null}
      {revealed ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense fallback={<PageFallback />}>
              <Routes location={location}>
                <Route path="/" element={<HomePage />} />
                <Route path="/docs" element={<DocsPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/app/connect" element={<AppConnectPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      ) : null}
      </ScrollProvider>
    </MotionConfig>
  );
}
