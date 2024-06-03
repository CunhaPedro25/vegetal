export interface Order {
  id: string;
  user_id: string;
  restaurant_id: string;
  status: string;
  total_price: number;
  created_at: string;
  delivery_type_id: string;
}
