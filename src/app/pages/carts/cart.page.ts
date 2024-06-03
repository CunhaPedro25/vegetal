import {Component, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {Order} from 'src/app/models/order.model';
import {AuthService} from 'src/app/services/auth.service';

@Component({
  selector: 'app-carts',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})

export class CartPage implements OnInit {

  orders: Order[] = [];
  restaurantInfo: { [key: number]: any } = {};
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private data: DataService,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    await this.loadOrders();
  }

  async loadOrders() {
    try {
      const userId = this.authService.getCurrentUserId() || '';
      this.orders = await this.data.getUserOrders(userId);

      for (let order of this.orders) {
        this.restaurantInfo[order.restaurant] = await this.data.getRestaurant(order.restaurant);
      }

      this.isLoading = false;
    } catch (err) {
      this.error = 'Failed to load orders';
      console.error(err);
      this.isLoading = false;
    }
  }

  getRestaurantInfo(id: number) {
    return this.restaurantInfo[id] || {};
  }
}
