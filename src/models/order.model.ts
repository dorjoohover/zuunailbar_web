export interface IOrder {
  user_id?: string;
  customer_id?: string;
  customer_desc?: string;
  branch_id?: string;
  order_date?: Date;
  start_time?: string;
  // pre_amount: number;
  user_desc?: string;
  details?: IOrderDetail[];
}
export interface Order {
  id: string;
  user_id: string;
  customer_id: string;
  duration: number;
  order_date: Date;
  start_time: string;
  end_time: string;
  order_status: number;
  pre_amount: number;
  is_pre_amount_paid: boolean;
  total_amount: number;
  paid_amount: number;
  customer_desc: string;
  user_desc: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface IOrderDetail {
  id?: string;
  order_id?: string;
  service_id: string;
  service_name?: string;
  duration?: number;
  created_at?: Date;
}
