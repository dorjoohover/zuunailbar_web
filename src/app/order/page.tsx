import { Api } from "@/utils/api";
import { find } from "../(api)";
import OrderPage from "./components";
import { Branch, BranchService, Service, User, UserService } from "@/models";
import { cookies } from "next/headers";

export default async function Page() {
  const { data, error } = await find<Service>(Api.service, { limit: -1 });
  const branchService = await find<BranchService>(Api.branch_service, {
    limit: -1,
    order_by: "index",
    sort: false,
  });
  const branch = await find<Branch>(Api.branch);
  const user = await find<User>(Api.user, { limit: -1 }, "client");

  const store = await cookies();
  const token = store.get("token")?.value;
  return (
    <div className="relative">
      <OrderPage
        data={data}
        token={token}
        branch_services={branchService.data}
        branches={branch.data}
        users={user.data}
      />
    </div>
  );
}
