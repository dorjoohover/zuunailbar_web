import { Api } from "@/utils/api";
import { find } from "../(api)";
import OrderPage from "./components";
import { Booking, Branch, Service, User, UserService } from "@/models";
import { ROLE } from "@/lib/enum";

export default async function Page() {
  const { data, error } = await find<Service>(Api.service);
  const branch = await find<Branch>(Api.branch);
  const user = await find<User>(Api.user, { limit: -1 }, "client");
  return (
    <>
      <OrderPage data={data} branches={branch.data} users={user.data} />
    </>
  );
}
