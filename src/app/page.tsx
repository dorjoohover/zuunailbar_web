import FeatureSection from "@/app/components/FeatureSection";
import HeroSection from "@/app/components/HeroSection";
import ContactSection from "./components/ContactSection";
import { find } from "./(api)";
import { Feature, Home } from "@/models/home.model";
import { Api } from "@/utils/api";
import { Service } from "@/models";
import { ServiceView } from "@/lib/const";

export default async function Page() {
  const res = await find<Home>(Api.home, {}, "web/home");
  const feature = await find<Feature>(Api.home, { limit: 4 }, "web/feature");
  const main = await find<Service>(Api.service, {
    limit: 2,
    view: ServiceView.SPECIAL,
    sort: false,
  });
  const services = await find<Service>(Api.service, {
    limit: 8,
    view: ServiceView.FEATURED,
    sort: false,
  });
  console.log(res)
  return (
    <>
      <HeroSection data={res.data} />
      <FeatureSection
        data={feature.data}
        main={main.data.items}
        services={services.data}
      />
      <ContactSection />
    </>
  );
}
