export interface Order {
  id: number;
  user: string;
  restaurant: number;
  status: string;
  total_price: number;
  created_at: string;
  delivery_type: number;
}
