"use server";

import { LoginDto, RegisterDto } from "@/models";
import { API, METHOD } from "@/utils/api";
import { cookies } from "next/headers";

export const sendOtp = async (mobile: string) => {
  try {
    const res = await fetch(`${API.send_otp}`, {
      cache: "no-store",
      method: METHOD.post,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mobile,
      }),
    });
    const data = await res.json();

    if (!res.ok)
      return {
        error: data.message,
      };

    return { data: data.payload };
  } catch (error) {
    console.log(error);
    return {
      error: (error as Error).message,
    };
  }
};
export const sendOtpForget = async (mobile: string) => {
  try {
    const res = await fetch(`${API.send_otp_forget}`, {
      cache: "no-store",
      method: METHOD.post,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mobile,
      }),
    });
    const data = await res.json();

    if (!res.ok)
      return {
        error: data.message,
      };

    return { data: data.payload };
  } catch (error) {
    console.log(error);
    return {
      error: (error as Error).message,
    };
  }
};
export const register = async (dto: RegisterDto) => {
  try {
    const merchant =
      (await cookies()).get("merchant_id")?.value ?? process.env.MERCHANT;
    const res = await fetch(`${API.register}`, {
      cache: "no-store",
      method: METHOD.post,
      headers: {
        "Content-Type": "application/json",
        "merchant-id": merchant ?? "",
      },
      body: JSON.stringify(dto),
    });
    const data = await res.json();
    if (!res.ok)
      return {
        error: data.message,
      };

    return { data: data.payload };
  } catch (error) {
    console.log(error);
    return {
      error: (error as Error).message,
    };
  }
};
export const login = async (dto: LoginDto) => {
  try {
    const merchant = (await cookies()).get("merchant_id")?.value;
    const res = await fetch(`${API.login}`, {
      cache: "no-store",
      method: METHOD.post,
      headers: {
        "Content-Type": "application/json",
        "merchant-id": merchant ?? "",
      },
      body: JSON.stringify(dto),
    });
    const data = await res.json();
    if (!res.ok)
      return {
        error: data.message,
      };

    return { data: data.payload };
  } catch (error) {
    console.log(error);
    return {
      error: (error as Error).message,
    };
  }
};
export const updatePassword = async (dto: RegisterDto) => {
  try {
    const merchant = (await cookies()).get("merchant_id")?.value;
    const res = await fetch(`${API.otp}`, {
      cache: "no-store",
      method: METHOD.post,
      headers: {
        "Content-Type": "application/json",
        "merchant-id": merchant ?? "",
      },
      body: JSON.stringify(dto),
    });
    const data = await res.json();
    if (!res.ok)
      return {
        error: data.message,
      };

    return { data: data.payload };
  } catch (error) {
    console.log(error);
    return {
      error: (error as Error).message,
    };
  }
};
export const forgetPassword = async (mobile: string) => {
  try {
    const merchant = (await cookies()).get("merchant_id")?.value;
    const res = await fetch(`${API.forget}/${mobile}`, {
      cache: "no-store",
      method: METHOD.get,
      headers: {
        "Content-Type": "application/json",
        "merchant-id": merchant ?? "",
      },
    });
    const data = await res.json();
    if (!res.ok)
      return {
        error: data.message,
      };

    return { data: data.payload };
  } catch (error) {
    console.log(error);
    return {
      error: (error as Error).message,
    };
  }
};
