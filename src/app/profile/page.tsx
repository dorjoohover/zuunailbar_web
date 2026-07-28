import { User } from "@/models";
import { cookies } from "next/headers";
import { ProfilePage } from ".";
import { find } from "../(api)";
import { Api } from "@/utils/api";

const Page = async () => {
  const store = await cookies();
  const token = store.get("token")?.value;
  const res = await find(Api.order, {}, "user_count");
  return <ProfilePage token={token} orders={res.data.count} />;
};

export default Page;
