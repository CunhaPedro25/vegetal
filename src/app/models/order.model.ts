import {Address} from "./address.model";

export interface Order {
  id: number;
  user: string;
  restaurant: number;
  status: string;
  delivery_fee: number;
  subtotal: number;
  total_price: number;
  created_at: string;
  delivery_type: string;
  delivery_info: Address;
  delivery_time: string;
}
