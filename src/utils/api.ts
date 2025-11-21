export enum METHOD {
  get = "GET",
  post = "POST",
  put = "PUT",
  patch = "PATCH",
  delete = "DELETE",
}
const BASE = process.env.API;
// ? process.env.API?.endsWith("/")
//   ? process.env.API
//   : process.env.API + "/"
// :
// :  "http://192.168.1.104:4000/api/v1/";
// "https://api.zunailbar.mn/api/v1/";

export enum Api {
  login = "login",
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
  upload = "upload",
  forget = "forget",
}

export const API = {
  [Api.login]: BASE + "client/login",
  [Api.register]: BASE + "register",
  [Api.otp]: BASE + "otp",
  [Api.send_otp]: BASE + "send/otp",
  [Api.send_otp_forget]: BASE + "forget/otp",
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
  [Api.category]: BASE + "category",
};

export const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://zuunailbar-web.vercel.app";
