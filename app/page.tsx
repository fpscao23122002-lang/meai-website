import fs from "node:fs";
import path from "node:path";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { BentoFeatures } from "@/components/landing/BentoFeatures";
import { Workflow } from "@/components/landing/Workflow";
import { InteractiveDemo } from "@/components/landing/InteractiveDemo";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { faqs } from "@/lib/data";

// Nếu có ảnh chụp thật của app tại public/app-preview.png thì Hero dùng ảnh đó,
// ngược lại hiển thị mockup tương tác mô phỏng giao diện Studio.
function getPreviewSrc() {
  return fs.existsSync(path.join(process.cwd(), "public", "app-preview.png")) ? "/app-preview.png" : undefined;
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero previewSrc={getPreviewSrc()} />
        <BentoFeatures />
        <Workflow />
        <InteractiveDemo />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
