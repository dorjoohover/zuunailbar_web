"use server";
import { baseUrl } from "@/utils/api";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const store = await cookies();
    console.log(body);
    store.set("token", body.token);
    store.set("merchant_id", body.merchant);

    return NextResponse.redirect(new URL("/", baseUrl));
  } catch (error) {
    console.error("⛔ Route error:", error);
    return NextResponse.json({ success: false });
  }
}
