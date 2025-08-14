import FeatureSection from "@/app/components/FeatureSection";
import HeroSection from "@/app/components/HeroSection";
import ContactSection from "./components/ContactSection";

export default function Home() {
  return (
    <>
      {/* bg-[url('/images/grid-bg.png')] bg-[url('/images/background.png')]  */}
      {/* bg-[#111315] */}
      <HeroSection />
      <FeatureSection />
      <ContactSection />
    </>
  );
}
