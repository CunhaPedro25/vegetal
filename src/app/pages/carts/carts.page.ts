import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {Order} from 'src/app/models/order.model';
import {AuthService} from 'src/app/services/auth.service';

@Component({
  selector: 'app-carts',
  templateUrl: './carts.page.html',
  styleUrls: ['./carts.page.scss'],
})

export class CartsPage implements OnInit, OnDestroy {

  orders!: Order[];
  subscription: any;

  constructor(
    private data: DataService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    const userId = this.authService.getCurrentUserId()
    if(userId)
      this.orders = await this.data.getUserOrders(userId);

    this.subscribeToChanges()
    this.cdr.detectChanges();
  }

  async ionViewWillEnter(){
    const userId = this.authService.getCurrentUserId()
    if(userId)
      this.orders = await this.data.getUserOrders(userId);

    this.subscribeToChanges()
    this.cdr.detectChanges();
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
    const orderId = payload.old.id;
    const existingOrderIndex = this.orders.findIndex(x => x.id === orderId);

    switch(payload.eventType) {
      case 'INSERT':
        this.orders.push(payload.new);
        break;
      case 'UPDATE':
        if (existingOrderIndex !== -1) {
          this.orders[existingOrderIndex] = payload.new;
        }
        break;
      case 'DELETE':
        if (existingOrderIndex !== -1) {
          this.orders.splice(existingOrderIndex, 1);
        }
        break;
      default:
        break;
    }

    this.cdr.detectChanges(); // Trigger change detection to update the view
  }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
