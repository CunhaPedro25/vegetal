import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Item} from "../../models/item.model";
import {DataService} from "../../services/data.service";
import {AuthService} from "../../services/auth.service";
import {OrderItem} from "../../models/order-item.model";

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
})
export class ItemCardComponent  implements OnInit {
  @Input() item?: Item;
  @Input() orderItem?: OrderItem;
  @Output() emitter: any
  counter!: number;

  constructor(private data: DataService, private auth: AuthService, private cdr: ChangeDetectorRef) {
    this.emitter = new EventEmitter<{ item: any, count: number }>()
  }

  async ngOnInit() {
    if(this.item) {
      this.counter = 0;
      const order = await this.data.getRecentOrder(this.auth.getCurrentUserId(), this.item!.restaurant)
      if (order) {
        const orderItem = await this.data.getOrderItemByItem(order.id, this.item!.id)
        if (orderItem) {
          this.counter = orderItem.quantity;
        }
      }
    }else if(this.orderItem){
      this.counter = this.orderItem.quantity;
      this.item = await this.data.getItem(this.orderItem.item)
    }
  }

  async incrementCounter() {
    this.emitter?.emit({ item: this.item!.id, count: ++this.counter});
    this.cdr.detectChanges();
  }

  async decrementCounter() {
    if (this.counter > 0) {
      this.emitter?.emit({ item: this.item!.id, count: --this.counter});
      this.cdr.detectChanges();
    }
  }
}
