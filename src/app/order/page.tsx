import { Api } from "@/utils/api";
import { find } from "../(api)";
import OrderPage from "./components";
import { Branch, Service, User } from "@/models";
import { cookies } from "next/headers";

export default async function Page() {
  const { data, error } = await find<Service>(Api.service);
  const branch = await find<Branch>(Api.branch);
  const user = await find<User>(Api.user, { limit: -1 }, "client");
  const store = await cookies();
  const token = store.get("token")?.value;
  return (
    <div className="relative">
      <OrderPage
        data={data}
        token={token}
        branches={branch.data}
        users={user.data}
      />
    </div>
  );
}
