import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const store = await cookies();
  let merchant = store.get("merchant_id")?.value;

  const res = NextResponse.json(
    { ok: true, merchant: merchant ?? process.env.MERCHANT },
    { status: 200 }
  );

  // cookie-г redirect биш JSON response дээр сетлэнэ
  if (!merchant && process.env.MERCHANT) {
    res.cookies.set("merchant_id", process.env.MERCHANT!, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      // secure: true  // prod дээр асаа
    });
  }

  return res;
}
