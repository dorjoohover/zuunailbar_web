import { OrderStatus } from "@/lib/constants";
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Url = {
  name: string;
  description: string;
  logo: string;
  link: string;
};

export type Invoice = {
  price: number;
  invoice_id: string;
  qr_text: string;
  qr_image: string;
  status: OrderStatus;
  urls: Url[];
  created: Date;
};
