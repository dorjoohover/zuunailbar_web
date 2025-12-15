import { Service } from "@/models";
import ServicesPage from ".";
import { find } from "../(api)";
import { Api } from "@/utils/api";
import { ServiceView } from "@/lib/const";

const Page = async () => {
  const data = await find<Service>(Api.service, {
    limit: 10,
    view: ServiceView.FEATURED,
    sort: true,
  });
  console.log(data)
  return <ServicesPage services={data.data.items} />;
};

export default Page;
