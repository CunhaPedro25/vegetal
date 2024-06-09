import {Component, Input, OnInit} from '@angular/core';
import {Order} from "../../models/order.model";
import {DataService} from "../../services/data.service";
import {Restaurant} from "../../models/restaurant.model";
import {Router} from "@angular/router";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss'],
  providers: [DatePipe]
})
export class OrderCardComponent  implements OnInit {
  @Input() order?: Order;
  @Input() skeleton?: boolean;
  restaurant: Restaurant | undefined;
  items_length: number = 0;
  carts: boolean = false;

  constructor(
    protected data: DataService,
    private router: Router,
    private datePipe: DatePipe
    ) { }

  async ngOnInit() {
    if(this.order) {
      this.restaurant = await this.data.getRestaurant(this.order.restaurant)
      this.items_length = (await this.data.getOrderItems(this.order.id)).length
      this.carts = this.order.status !== "" && this.order.status !== null && this.order.status !== "delivered";
    }
  }

  formatDeliveryTime(time: string | undefined): string | null {
    return this.datePipe.transform(time, 'MMM d, y, HH:mm', 'GMT+0');
  }

  async openOrder(id: number) {
    if(this.carts){
      return await this.router.navigate([`/delivery`, id]);
    }else if(this.order?.status !== "delivered"){
      return await this.router.navigate([`/cart`, id]);
    }
    return undefined
  }
}
