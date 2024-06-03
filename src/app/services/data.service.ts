import { Injectable } from '@angular/core';
import {SupabaseClient} from "@supabase/supabase-js";
import {AuthService} from "./auth.service";
import {Restaurant} from "../models/restarurant.model";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private supabase: SupabaseClient

  public selectedRestaurant?: Restaurant

  constructor() {
    this.supabase = AuthService.getSupabaseClient()
  }

  async getRestaurants(): Promise<Restaurant[]> {
    let { data, error } = await this.supabase
      .from('restaurants')
      .select('*')

    return data as Restaurant[]
  }

  async getRestaurant(id: number): Promise<Restaurant> {
    let { data, error } = await this.supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single()

    return data as Restaurant
  }

  // async getReviews(restaurant_id: number): Promise<Review[]> {
  //   let { data, error } = await this.supabase
  //     .from('reviews')
  //     .select('*')
  //     .eq('restaurant', restaurant_id)
  //
  //   return data as Review[]
  // }
}
