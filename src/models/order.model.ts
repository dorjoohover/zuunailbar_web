import { User } from "./user.model";
import { UserService } from "./user.service.model";

export interface IOrder {
  user_id?: string;
  customer_id?: string;
  description?: string;
  branch_id?: string;
  order_date?: Date;
  start_time?: string;
  category_id?: string;
  end_time?: string;
  // pre_amount: number;
  users?: Record<string, string>;
  user_desc?: string;
  details?: IOrderDetail[] | any[];
  parallel?: boolean;
}

export interface Order {
  id: string;
  description?: string;
  artist_name?: string;
  user_id: string;
  customer_id: string;
  branch_id?: string;
  duration: number;
  order_date: string;
  start_time: string;
  end_time: string;
  order_status: number;
  pre_amount: number;
  is_pre_amount_paid: boolean;
  total_amount: number;
  paid_amount: number;
  created_at?: Date;
  updated_at?: Date;
  details?: IOrderDetail[];
}

export interface IOrderDetail {
  id?: string;
  order_id?: string;
  service_id: string;
  max_price?: number;
  min_price?: number;
  service_name?: string;
  user_id?: string;
  duration?: number;
  category?: number | null;
  created_at?: Date;
  user?: User;
  start_time?: string;
  end_time?: string;
  pre?: number;
}

export interface DateTime {
  [index: number]: number[];
}
export interface UserDateTime extends UserService {
  slots: DateTime;
  services: string[];
}
