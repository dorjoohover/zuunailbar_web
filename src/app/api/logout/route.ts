import { baseUrl } from "@/utils/api";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const store = await cookies();
  store.delete("token");
  store.delete("merchant_id");

  return NextResponse.redirect(new URL("/login", baseUrl));
}
