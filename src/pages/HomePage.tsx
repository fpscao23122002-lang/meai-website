import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { TechMarquee } from "@/components/landing/TechMarquee";
import { BentoFeatures } from "@/components/landing/BentoFeatures";
import { AppTour } from "@/components/landing/AppTour";
import { Workflow } from "@/components/landing/Workflow";
import { InteractiveDemo } from "@/components/landing/InteractiveDemo";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { faqs } from "@/lib/data";
import { usePageMeta } from "@/hooks/usePageMeta";

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
  usePageMeta({ path: "/" });

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TechMarquee />
        <BentoFeatures />
        <AppTour />
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
