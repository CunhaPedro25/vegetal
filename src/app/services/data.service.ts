import {Injectable} from '@angular/core';
import {SupabaseClient} from '@supabase/supabase-js';
import {AuthService} from './auth.service';
import {Restaurant} from '../models/restaurant.model';
import {Review} from '../models/review.model';
import {Address} from '../models/address.model';
import {Item} from '../models/item.model';
import {Order} from '../models/order.model';
import {OrderItem} from '../models/order-item.model';
import {Delivery} from '../models/delivery.model';
import {DeliveryType} from '../models/delivery-type.model';
import {Category} from '../models/category.model';
import {Favorite} from '../models/favorite.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private supabase: SupabaseClient;
  private selectedAddress: any = {
    display_name: 'Av. do Atlântico 644 4900, Viana do Castelo',
    lat: 41.69427867398096,  // Default latitude
    lon: -8.846855462371082   // Default longitude
  };

  setSelectedAddress(address: any): void {
    this.selectedAddress = address;
  }

  getSelectedAddress(): any {
    return this.selectedAddress;
  }

  constructor() {
    this.supabase = AuthService.getSupabaseClient();
  }

  // Restaurants
  async getRestaurants(): Promise<Restaurant[]> {
    const { data, error } = await this.supabase
      .from('restaurants')
      .select('*');
    if (error) throw error;
    return data.map(item => new Restaurant(item));
  }

  async getRestaurantsWithinRadius(maxDistance: number = 10): Promise<Restaurant[]> {
    const data = await this.getRestaurants();
    const restaurants: Restaurant[] = [];

    data.forEach(item => {
      const restaurant = new Restaurant(item);
      restaurant.calculateDistance(this.selectedAddress.lat, this.selectedAddress.lon);
      if (restaurant.distance < maxDistance) {
        restaurants.push(restaurant);
      }
    });

    return restaurants;
  }


  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }


  async getRestaurant(id: number): Promise<Restaurant> {
    const { data, error } = await this.supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Restaurant;
  }

  // Reviews
  async getReviews(restaurant: number): Promise<Review[]> {
    const { data, error } = await this.supabase
      .from('reviews')
      .select('*')
      .eq('restaurant', restaurant);
    if (error) throw error;
    return data as Review[];
  }

  // Addresses
  async getUserAddresses(user: string): Promise<Address[]> {
    const { data, error } = await this.supabase
      .from('addresses')
      .select('*')
      .eq('user', user);
    if (error) throw error;
    return data as Address[];
  }

  // Items
  async getItems(restaurant: number): Promise<Item[]> {
    const { data, error } = await this.supabase
      .from('items')
      .select('*')
      .eq('restaurant', restaurant);
    if (error) throw error;
    return data as Item[];
  }

  // Orders
  async getUserOrders(user: string): Promise<Order[]> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .eq('user', user);
    if (error) throw error;
    return data as Order[];
  }

  // Order Items
  async getOrderItems(order: number): Promise<OrderItem[]> {
    const { data, error } = await this.supabase
      .from('order_items')
      .select('*')
      .eq('order', order);
    if (error) throw error;
    return data as OrderItem[];
  }

  // Deliveries
  async getDelivery(order: number): Promise<Delivery> {
    const { data, error } = await this.supabase
      .from('deliveries')
      .select('*')
      .eq('order', order)
      .single();
    if (error) throw error;
    return data as Delivery;
  }

  // Delivery Types
  async getDeliveryTypes(): Promise<DeliveryType[]> {
    const { data, error } = await this.supabase
      .from('delivery_types')
      .select('*');
    if (error) throw error;
    return data as DeliveryType[];
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*');
    if (error) throw error;
    return data as Category[];
  }

  // Restaurant Categories
  async getRestaurantCategories(restaurant: string): Promise<Category[]> {
    const { data, error } = await this.supabase
      .from('restaurant_categories')
      .select('category_id')
      .eq('restaurant', restaurant);
    if (error) throw error;

    const categoryIds = data.map(rc => rc.category_id);
    const categories = await this.supabase
      .from('categories')
      .select('*')
      .in('id', categoryIds);
    return categories.data as Category[];
  }

  // Favorites
  async getUserFavorites(user: string): Promise<Favorite[]> {
    const { data, error } = await this.supabase
      .from('favorites')
      .select('*')
      .eq('user', user);
    if (error) throw error;
    return data as Favorite[];
  }
}
