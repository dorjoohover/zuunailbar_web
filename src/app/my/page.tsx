import { Api } from "@/utils/api";
import { MyOrderPage } from ".";
import { find } from "../(api)";
import { Order } from "@/models";
import { OrderStatus } from "@/lib/constants";

const Page = async ({
  searchParams,
}: {
  searchParams: { status?: string };
}) => {
  const params = await searchParams;

  const res = await find<Order>(Api.order, {
    limit: 20,
    order_status: params.status ?? OrderStatus.Pending,
  });
  return <MyOrderPage data={res.data} params={params.status} />;
};

export default Page;
