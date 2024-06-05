import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../services/data.service";
import {Order} from "../../models/order.model";
import {OrderItem} from "../../models/order-item.model";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-restaurant-carts',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit, OnDestroy {
  order!: Order;
  orderItems?: OrderItem[];
  subscription!: any;

  constructor(
    private data: DataService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) { }

  async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.order = await this.data.getOrder(+params['id'])
      if(this.order) {
        this.orderItems = await this.data.getOrderItems(this.order.id);
      }

      this.subscribeToChanges();
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
    if (payload.eventType === 'UPDATE') {
      this.order = payload.new;
    } else if (payload.eventType === 'DELETE') {
      await this.router.navigate([""]);
    }
  }

  async controlOrders({ item, count }: { item: number; count: number }) {
    let order_items = await this.data.getOrderItems(this.order?.id);
    let orderItem = order_items.find(x => x.item === item);
    if (orderItem) {
      // If the item exists in both sets but the count is different, update it
      if (orderItem.quantity !== count) {
        await this.data.updateOrderItem(orderItem.id, count);
      }

      if(orderItem.quantity !== 0 && count === 0) {
        const i = order_items.findIndex(x => x.item === item);
        this.orderItems?.splice(i, 1)
      }
    } else {
      // If the item only exists in Ionic Storage, insert it
      await this.data.createOrderItem(this.order.id, item, count);
    }
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
