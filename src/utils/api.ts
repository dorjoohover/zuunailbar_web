export enum METHOD {
  get = "GET",
  post = "POST",
  put = "PUT",
  patch = "PATCH",
  delete = "DELETE",
}
// Хуучин код-т "http://localhost:5050/api/v1/" гэж hardcode хийсэн байсан.
// Docker дотор энэ нь зөвхөн БРАУЗЕРЭЭС (client component) хийгдэх fetch-д л
// зөв ажиллана ("use client" файлууд, ж: NavbarDemo.tsx) — учир нь браузер нь
// Mac дээрээ ажиллаж, host руу publish хийсэн 5050 портыг харна. Харин
// server action-ууд (ж: app/(api)/auth.ts, "use server") нь web container
// ДОТОР ажилладаг тул "localhost:5050" өөрийнхөө container-ыг л зааж,
// backend container руу хүрдэггүй — яг үүнээс "fetch failed" гардаг байсан.
//
// Тиймээс хоёр өөр URL ашиглана:
//   - PUBLIC_BASE:  build үед next.config.js-ийн `env.API`-аар inline хийгдэж
//     browser bundle-д ордог (client-side fetch-д зориулав).
//   - INTERNAL_BASE: зөвхөн server дээр (Node process) runtime-д уншигдана
//     (docker-compose.yml-ийн `environment.API_INTERNAL`, ж:
//     http://backend:5000/api/v1/) — client bundle-д огт орохгүй.
const normalize = (url?: string | null) =>
  !url ? null : url.endsWith("/") ? url : `${url}/`;

const PUBLIC_BASE =
  normalize(process.env.API) ?? "https://api.zunailbar.mn/api/v1/";
const INTERNAL_BASE = normalize(process.env.API_INTERNAL) ?? PUBLIC_BASE;

const BASE = typeof window === "undefined" ? INTERNAL_BASE : PUBLIC_BASE;
export enum Api {
  login = "login",
  resetPassword = "reset_password",
  home = "home",
  register = "register",
  user = "user",
  user_product = "user_product",
  branch = "branch",
  otp = "otp",
  file = "file",
  send_otp = "send_otp",
  send_otp_forget = "send_otp_forget",
  category = "category",
  service = "service",
  branch_service = "branch_service",
  order = "order",
  schedule = "schedule",
  booking = "booking",
  voucher = "voucher",
  user_service = "user_service",
  product = "product",
  product_transaction = "product_transaction",
  product_transaction_admin = "product_transaction_admin",
  product_log = "product_log",
  brand = "brand",
  slots = "slots",
  upload = "upload",
  forget = "forget",
}

export const API = {
  [Api.login]: BASE + "client/login",
  [Api.register]: BASE + "register",
  [Api.otp]: BASE + "otp",
  [Api.send_otp]: BASE + "send/otp",
  [Api.send_otp_forget]: BASE + "forget/otp",
  [Api.resetPassword]: BASE + "reset_password",
  [Api.forget]: BASE + "forget",
  [Api.home]: BASE + "home",
  [Api.user]: BASE + "user",
  [Api.product]: BASE + "product",
  [Api.order]: BASE + "order",
  [Api.booking]: BASE + "booking",
  [Api.voucher]: BASE + "voucher",
  [Api.service]: BASE + "service",
  [Api.file]: BASE + "file",
  [Api.schedule]: BASE + "schedule",
  [Api.branch_service]: BASE + "branch_service",
  [Api.user_service]: BASE + "user_service",
  [Api.brand]: BASE + "brand",
  [Api.user_product]: BASE + "user_product",
  [Api.product_transaction]: BASE + "product_transaction",
  [Api.product_transaction_admin]: BASE + "product_transaction" + "/admin",
  [Api.product_log]: BASE + "product_log",
  [Api.branch]: BASE + "branch",
  [Api.upload]: BASE + "upload",
  [Api.slots]: BASE + "slots",
  [Api.category]: BASE + "category",
};

export const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://zunailbar.mn";
