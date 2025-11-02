import { Api } from "@/utils/api";
import { MyOrderPage } from ".";
import { find } from "../(api)";
import { Order } from "@/models";

const Page = async () => {
  const res = await find<Order>(Api.order, { limit: 20 });
  return <MyOrderPage data={res.data} />;
};

export default Page;
