export interface IProduct {
  id?: string;
  brand_id?: string;
  category_id?: string;
  name?: string;
  ref?: string;
  quantity?: number;
  price?: number;
  color?: string;
  size?: string;
  created_at?: Date;
}
export interface Product {
  id: string;
  brand_id: string;
  category_id: string;
  name: string;
  ref: string;
  quantity: number;
  price: number;
  color: string;
  size: string;
  created_at: Date;
}
