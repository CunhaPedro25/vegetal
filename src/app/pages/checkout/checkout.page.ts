import {Component, OnInit} from '@angular/core';
import {Order} from "../../models/order.model";
import {OrderItem} from "../../models/order-item.model";
import {DataService} from "../../services/data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Restaurant} from "../../models/restaurant.model";
import {Item} from "../../models/item.model";
import {LoadingController} from "@ionic/angular";
import {Storage} from "@ionic/storage-angular";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  order?: Order;
  orderItems?: OrderItem[];
  items: { [key: number]: Item } = {};
  restaurant?: Restaurant;
  loaded = false;
  paying = false

  constructor(
    protected data: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private storage: Storage,
    private loadingController: LoadingController,
  ) { }

  async ngOnInit() {
    await this.storage.create()
    const loading = await this.loadingController.create();
    this.loaded = false

    this.route.params.subscribe(async (params) => {
      this.order = await this.data.getOrder(+params['id'])
      this.restaurant = await this.data.getRestaurant(this.order.restaurant)
      if(this.order) {
        this.orderItems = await this.data.getOrderItems(this.order.id);
        for (let item of this.orderItems) {
          this.items[item.item] = await this.data.getItem(item.item)
        }

        await loading.dismiss();
        this.loaded = true
      }
    });
  }

  async payOrder() {
    this.paying = true
    for (let item of Object.keys(this.items!)) {
      await this.storage.set(`item_${this.items[parseInt(item)].id}`, 0)
    }
    await this.data.updateOrderStatus(this.order!.id, "pending")
    await this.router.navigate(['/delivery', this.order?.id])
  }
}
