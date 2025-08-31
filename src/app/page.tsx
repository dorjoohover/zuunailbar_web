import FeatureSection from "@/app/components/FeatureSection";
import HeroSection from "@/app/components/HeroSection";
import ContactSection from "./components/ContactSection";
import { find } from "./(api)";
import { Home } from "@/models/home.model";
import { Api } from "@/utils/api";

export default async function Page() {
  const res = await find<Home>(Api.home, {}, "web/home");

  return (
    <>
      <HeroSection data={res.data} />
      <FeatureSection />
      <ContactSection />
    </>
  );
}
