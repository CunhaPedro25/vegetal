import { Component, OnInit } from '@angular/core';
import {Order} from "../../models/order.model";
import {DataService} from "../../services/data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {LoadingController} from "@ionic/angular";
import {Restaurant} from "../../models/restaurant.model";

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.page.html',
  styleUrls: ['./delivery.page.scss'],
})
export class DeliveryPage implements OnInit {
  order?: Order;
  restaurant?: Restaurant;
  subscription!: any;
  loaded: boolean = false;
  order_status = ["pending", "on-the-way", "almost", "ready", "delivered"]
  counter = 1
  isOpen: boolean = false;

  constructor(
    private data: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingController: LoadingController,
  ) { }

  async ngOnInit() {
    const loading = await this.loadingController.create();
    this.loaded = false;

    this.route.params.subscribe(async (params) => {
      this.order = await this.data.getOrder(+params["id"])
      this.restaurant = await this.data.getRestaurant(this.order.restaurant)
      this.subscribeToChanges();
      await loading.dismiss()
      this.loaded = true

      setInterval(async () => {
        await this.data.updateOrderStatus(this.order!.id, this.order_status[this.counter++])
      }, Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000)
    });
  }

  subscribeToChanges() {
    this.subscription = AuthService.client()
      .channel('supabase_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, async (payload: any) => {
        await this.handleChanges(payload);
      })
      .subscribe();
  }

  async handleChanges(payload: any) {
    if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
      this.order = payload.new;
      if (this.order!.status === 'delivered') {
        await this.router.navigate(["/tabs/home"], { queryParams: { id: this.order?.restaurant, type: this.order?.delivery_type } });
      }
    } else if (payload.eventType === 'DELETE') {
      this.order = undefined
      await this.router.navigate(["/"])
    }
  }

}
