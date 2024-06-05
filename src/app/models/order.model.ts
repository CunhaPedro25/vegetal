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
}
