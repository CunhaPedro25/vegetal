import {Injectable} from '@angular/core';
import {SupabaseClient} from '@supabase/supabase-js';
import {AuthService} from './auth.service';
import {Restaurant} from '../models/restaurant.model';
import {Review} from '../models/review.model';
import {UserAddress} from '../models/user-address.model';
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
  private selectedAddress: Address = {
    address: 'Av. do Atlântico 644 4900, Viana do Castelo',
    latitude: 41.69427867398096,  // Default latitude
    longitude: -8.846855462371082,  // Default longitude
    city: "Viana do Castelo",
    zip_code: "644-4900"
  };

  setSelectedAddress(address: Address): void {
    this.selectedAddress = address;
  }

  getSelectedAddress(): Address {
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
      restaurant.calculateDistance(this.selectedAddress.latitude, this.selectedAddress.longitude);
      if (restaurant.distance < maxDistance) {
        restaurants.push(restaurant);
      }
    });

    return restaurants;
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
    return data as UserAddress[];
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

    const categoryIds = data.map(rc => rc.category);
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
