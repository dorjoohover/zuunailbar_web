"use server";
import { defaultPagination, Pagination } from "@/base/query";
import { ListType, PPDT, SearchType } from "@/lib/const";
import { paginationToQuery } from "@/lib/functions";
import { API, METHOD } from "@/utils/api";
import { cookies } from "next/headers";

export const find = async <T>(
  uri: keyof typeof API,
  p: Pagination = {},
  route?: string
): Promise<{ data: ListType<T>; error?: string }> => {
  try {
    const store = await cookies();
    const token = store.get("token")?.value;
    const branch = store.get("branch_id")?.value;
    const merchant =
      store.get("merchant_id")?.value ?? "3f86c0b23a5a4ef89a745269e7849640";

    const merged: Pagination = {
      ...defaultPagination,
      ...p,
    };

    const url = paginationToQuery(uri, merged, route);
    console.log(url);
    const res = await fetch(url, {
      cache: "no-store",

      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "branch-id": branch || "",
        "merchant-id": merchant || "",
      },
    });

    if (!res.ok) {
      return {
        data: { count: 0, items: [] },
        error: `Failed to fetch: ${res.status} ${res.statusText}`,
      };
    }

    const data = (await res.json()).payload;
    return { data: data as ListType<T> };
  } catch (err) {
    return {
      data: { count: 0, items: [] },
      error: (err as Error).message || "Unknown error occurred",
    };
  }
};
export const findOne = async (
  uri: keyof typeof API,
  id: string,
  route?: string
) => {
  const store = await cookies();
  const token = store.get("token")?.value;
  const branch = store.get("branch_id")?.value;
  const merchant =
    store.get("merchant_id")?.value ?? "3f86c0b23a5a4ef89a745269e7849640";
  const url = `${API[uri as keyof typeof API]}${route ? `/${route}/` : "/"}${id}`;
  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "branch-id": branch || "",
      "merchant-id": merchant || "",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  }

  return await res.json();
};
export const deleteOne = async (
  uri: keyof typeof API,
  id: string,
  route?: string
): Promise<PPDT> => {
  try {
    const store = await cookies();
    const token = store.get("token")?.value;
    const branch = store.get("branch_id")?.value;
    const merchant =
      store.get("merchant_id")?.value ?? "3f86c0b23a5a4ef89a745269e7849640";
    const url = `${API[uri as keyof typeof API]}${route ? `/${route}/` : "/"}${id}`;
    const res = await fetch(url, {
      cache: "no-store",
      method: METHOD.delete,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "branch-id": branch || "",
        "merchant-id": merchant || "",
      },
    });

    // if (!res.ok) {
    //   throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    // }
    const data = await res.json();
    if (!res.ok) {
      console.log(data);
      return { error: (data as Error).message, success: false };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
    };
  }
};
export const updateOne = async <T>(
  uri: keyof typeof API,
  id: string,
  body: T,
  route?: string
): Promise<PPDT> => {
  try {
    const store = await cookies();
    const token = store.get("token")?.value;
    const branch = store.get("branch_id")?.value;
    const merchant = store.get("merchant_id")?.value;
    const url = `${API[uri]}${route ? `/${route}` : ""}/${id}`;

    const res = await fetch(url, {
      cache: "no-store",
      method: METHOD.patch,
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        "branch-id": branch || "",
        "merchant-id": merchant || "",
      },
    });
    const data = await res.json();
    if (!res.ok) {
      console.log(data);
      return { error: (data as Error).message, success: false };
    }

    return {
      success: true,
    };
  } catch (error) {
    return { error: (error as Error).message, success: false };
  }
};
export const create = async <T>(
  uri: keyof typeof API,
  body: T,
  route?: string
): Promise<PPDT> => {
  try {
    const store = await cookies();
    const token = store.get("token")?.value;
    const branch = (body as any)?.branch_id
      ? (body as any).branch_id
      : store.get("branch_id")?.value;
    const merchant =
      store.get("merchant_id")?.value ?? "3f86c0b23a5a4ef89a745269e7849640";

    const url = `${API[uri]}${route ? `/${route}` : ""}`;
    console.log(url);
    const res = await fetch(url, {
      cache: "no-store",
      method: METHOD.post,
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        "branch-id": branch || "",
        "merchant-id": merchant || "",
      },
    });

    const data = await res.json();
    if (!res.ok) {
      console.log(data);
      return { error: (data as Error).message, success: false };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.log(error);
    return { error: (error as Error).message, success: false };
  }
};

export const search = async <T>(
  uri: keyof typeof API,
  p = {},
  route?: string
): Promise<{ data: SearchType<T>[]; error?: string }> => {
  try {
    const store = await cookies();
    const token = store.get("token")?.value;
    const branch = store.get("branch_id")?.value;
    const merchant =
      store.get("merchant_id")?.value ?? "3f86c0b23a5a4ef89a745269e7849640";

    const merged = {
      ...p,
    };

    const url = paginationToQuery(uri, merged, `search/{id}${route ?? ""}`);
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "branch-id": branch || "",
        "merchant-id": merchant || "",
      },
    });

    if (!res.ok) {
      return {
        data: [],
        error: `Failed to fetch: ${res.status} ${res.statusText}`,
      };
    }

    const data = (await res.json()).payload;
    return { data: data as SearchType<T>[] };
  } catch (err) {
    return {
      data: [],
      error: (err as Error).message || "Unknown error occurred",
    };
  }
};
