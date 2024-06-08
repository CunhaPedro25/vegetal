import {Component, Input, OnInit} from '@angular/core';
import {Order} from "../../models/order.model";
import {DataService} from "../../services/data.service";
import {Restaurant} from "../../models/restaurant.model";
import {Router} from "@angular/router";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss'],
  imports: [
    IonicModule
  ],
  standalone: true
})
export class OrderCardComponent  implements OnInit {
  @Input() order!: Order;
  restaurant: Restaurant | undefined;
  items_length: number = 0;
  delivery: boolean = false;

  constructor(protected data: DataService,private router: Router,) { }

  async ngOnInit() {
    this.restaurant = await this.data.getRestaurant(this.order.restaurant)
    this.items_length = (await this.data.getOrderItems(this.order.id)).length
    this.delivery = this.order.status !== "" && this.order.status !== null;
  }

  async openOrder(id: number) {
    if(this.delivery){
      return await this.router.navigate([`/delivery`, id]);
    }
    return await this.router.navigate([`/cart`, id]);
  }
}
