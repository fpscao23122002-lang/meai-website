import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ScrollManager } from "@/components/layout/ScrollManager";
import HomePage from "@/pages/HomePage";

// Trang phụ tải theo nhu cầu để trang chủ nhẹ hơn
const DocsPage = lazy(() => import("@/pages/DocsPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-glow/30 border-t-cyan-glow" />
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}
