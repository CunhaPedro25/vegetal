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
import {Category} from '../models/category.model';
import {Favorite} from '../models/favorite.model';
import {Storage} from "@ionic/storage-angular";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private supabase: SupabaseClient;
  private selectedAddressSubject: BehaviorSubject<Address>;

  constructor(private storage: Storage) {
    this.supabase = AuthService.client();
    const initialAddress: Address = {
      address: 'Av. do Atlântico 644 4900, Viana do Castelo',
      latitude: 41.69427867398096,
      longitude: -8.846855462371082,
      city: "Viana do Castelo",
      zip_code: "644-4900",
      door: 45,
      info: "Big school"
    };
    this.selectedAddressSubject = new BehaviorSubject<Address>(initialAddress);
  }

  async setSelectedAddress(address: Address) {
    this.selectedAddressSubject.next(address);
  }

  getSelectedAddress(): Address {
    return this.selectedAddressSubject.value;
  }

  getSelectedAddressObservable() {
    return this.selectedAddressSubject.asObservable();
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
      restaurant.calculateDistance(this.getSelectedAddress().latitude, this.getSelectedAddress().longitude);
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
    const restaurant = new Restaurant(data);
    restaurant.calculateDistance(this.getSelectedAddress().latitude, this.getSelectedAddress().longitude);
    return restaurant;
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

  async uploadReview(restaurant: number, user: string, comment: string, rating: number, delivery_type: string): Promise<Review> {
    const { data, error } = await this.supabase
      .from('reviews')
      .insert({ restaurant: restaurant, user: user, comment: comment, rating: rating, delivery_type: delivery_type })
      .select()
      .single();
    if (error) throw error;
    return data as Review;
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

  async checkAddressExists(user: string, address: string): Promise<Address | null> {
    const { data, error } = await this.supabase
      .from('addresses')
      .select('*')
      .eq('user', user)
      .eq('address', address)
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data ? (data as Address) : null;
  }

  async createAddress(user: string, address: Address): Promise<Address> {
    const { data, error } = await this.supabase
      .from('addresses')
      .insert({ ...address, user: user })
      .select()
      .single();

    if (error) throw error;
    return data as Address;
  }

  async updateAddress(id: number | undefined, address: Address): Promise<Address> {
    const { data, error } = await this.supabase
      .from('addresses')
      .update(address)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Address;
  }



  // ------ Items -------
  async getItems(restaurant: number): Promise<Item[]> {
    const { data, error } = await this.supabase
      .from('items')
      .select('*')
      .eq('restaurant', restaurant);
    if (error) throw error;
    return data as Item[];
  }

  async getItem(id: number): Promise<Item> {
    const { data, error } = await this.supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Item;
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

  // ------ Favorites ------
  async getUserFavorites(user: string): Promise<Favorite[]> {
    const { data, error } = await this.supabase
      .from('favorites')
      .select('*')
      .eq('user', user);
    if (error) throw error;
    return data as Favorite[];
  }

  async getUserFavorite(user: string, restaurant: number): Promise<Favorite | null> {
    const { data, error } = await this.supabase
      .from('favorites')
      .select('*')
      .eq('user', user)
      .eq('restaurant', restaurant)
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data ? (data as Favorite) : null;
  }

  async setUserFavorite(user: string, restaurant: number): Promise<void> {
    const { data, error } = await this.supabase
      .from('favorites')
      .insert({ restaurant: restaurant, user: user });
    if (error) throw error;
  }

  async deleteUserFavorite(user: string, restaurant: number): Promise<void> {
    const { data, error } = await this.supabase
      .from('favorites')
      .delete()
      .eq('user', user)
      .eq('restaurant', restaurant);
    if (error) throw error;
  }

  // ------ Order ------
  async getOrder(id: number): Promise<Order> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Order;
  }

  async getUserOrders(user: string): Promise<Order[]> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .eq('user', user);
    if (error) throw error;
    return data as Order[];
  }

  async getRecentOrder(user: string | null, restaurant: number): Promise<Order> {
    const { data, error } = await this.supabase
      .from('orders')
      .select()
      .eq('user', user)
      .eq('restaurant', restaurant)
      .is('status', "NULL");
    if (error) throw error;
    return data[0] as Order;
  }

  async createOrder(user: string | null, restaurant: number): Promise<Order> {
    const type = await this.storage.get(`tab`)
    const { data, error } = await this.supabase
      .from('orders')
      .insert({ user: user, restaurant: restaurant, delivery_info: this.getSelectedAddress(), delivery_type: type })
      .select()
      .single();
    if (error) throw error;
    return data as Order;
  }

  async updateOrderStatus(id: number, status: string) {
    const { data, error } = await this.supabase
      .from('orders')
      .update({status: status})
      .eq('id', id)
    if (error) throw error;
  }

  async updateOrderDeliveryTime(id: number, deliveryTime?: string) {
    const time = deliveryTime ? deliveryTime : new Date().toISOString();
    const { data, error } = await this.supabase
      .from('orders')
      .update({ delivery_time: time })
      .eq('id', id);
    if (error) throw error;
  }



  // ------ Order Items ------
  async getOrderItems(order: number): Promise<OrderItem[]> {
    const { data, error } = await this.supabase
      .from('order_item')
      .select('*')
      .eq('"order"', order);
    if (error) throw error;
    return data as OrderItem[];
  }

  async getOrderItemByItem(order: number, item: number): Promise<OrderItem> {
    const { data, error } = await this.supabase
      .from('order_item')
      .select('*')
      .eq('"order"', order)
      .eq('item', item);
    if (error) throw error;
    return data[0] as OrderItem;
  }

  async createOrderItem(order: number, item: number, quantity: number): Promise<OrderItem> {
    const { data, error } = await this.supabase
      .from('order_item')
      .insert({order: order, item: item, quantity: quantity})
      .single();
    if (error) throw error;
    return data as OrderItem;
  }

  async updateOrderItem(id: number, quantity: number) {
    const { data, error } = await this.supabase
      .from('order_item')
      .update({quantity: quantity})
      .eq('id', id)
    if (error) throw error;
  }

}
