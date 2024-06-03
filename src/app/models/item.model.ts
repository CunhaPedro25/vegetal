export interface Item {
  id: number;
  restaurant: number;
  name: string;
  description: string;
  price: number;
  type: string;
  image_url: string | undefined;
  created_at: string;
}
