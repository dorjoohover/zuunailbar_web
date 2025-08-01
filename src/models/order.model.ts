export interface IOrder {
  id: string;
  user_id: string;
  customer_id: string;
  duration: number;
  order_date: Date;
  start_time: Date;
  end_time: Date;
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
  id: string;
  order_id: string;
  service_id: string;
  service_name: string;
  price: number;
  created_at?: Date;
}
