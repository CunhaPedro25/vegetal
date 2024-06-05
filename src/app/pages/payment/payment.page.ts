import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Order} from "../../models/order.model";
import {OrderItem} from "../../models/order-item.model";
import {DataService} from "../../services/data.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  order?: Order;
  orderItems?: OrderItem[];

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
    });
  }

}
