export interface Review {
  id: string;
  user_id: string;
  restaurant_id: string;
  delivery_type_id: string;
  order_id: string;
  rating: number;
  comment: string;
  created_at: string;
}
