import FeatureSection from "@/app/components/FeatureSection";
import HeroSection from "@/app/components/HeroSection";
import ContactSection from "./components/ContactSection";
import { find } from "./(api)";
import { Home } from "@/models/home.model";
import { Api } from "@/utils/api";

export default async function Page() {
  const res = await find<Home>(Api.home, {}, "web/home");

  console.log(res.data);
  return (
    <>
      {/* bg-[url('/images/grid-bg.png')] bg-[url('/images/background.png')]  */}
      {/* bg-[#111315] */}
      <HeroSection data={res.data} />
      <FeatureSection />
      <ContactSection />
    </>
  );
}
