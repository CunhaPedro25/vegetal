import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from '../../../services/data.service';
import {Order} from 'src/app/models/order.model';
import {AuthService} from 'src/app/services/auth.service';
import {Storage} from "@ionic/storage-angular";

@Component({
  selector: 'app-carts',
  templateUrl: './carts.page.html',
  styleUrls: ['./carts.page.scss'],
})

export class CartsPage implements OnInit, OnDestroy {

  orders: Order[] = [];
  deliveries: Order[] = [];
  subscription: any;
  loaded: boolean = false

  constructor(
    private data: DataService,
    private authService: AuthService,
    private storage: Storage,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    await this.getInformation()
  }

  async ionViewWillEnter(){
    await this.getInformation()
  }

  async getInformation(){
    this.loaded = false

    await this.storage.create()
    let userId = this.authService.getCurrentUserId()
    if(!userId) userId = await this.storage.get("user_id")

    if(userId) {
      await this.storage.set("user_id", userId)
      this.orders = await this.data.getUserOrders(userId);
      this.deliveries = this.orders.filter(x => x.status !== null && x.status !== "" && x.status !== "delivered")
      this.orders = this.orders.filter(x => (x.status === null || x.status === "") )
      this.orders = this.orders.filter(x => x.status !== "delivered" )
    }

    this.subscribeToChanges()
    this.cdr.detectChanges();
    this.loaded = true
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
    let existingOrderIndex = this.orders!.findIndex(x => x.id === orderId);

    switch(payload.eventType) {
      case 'INSERT':
        this.orders?.push(payload.new);
        break;
      case 'UPDATE':
        if (existingOrderIndex !== -1) {
          this.orders![existingOrderIndex] = payload.new;
        }
        break;
      case 'DELETE':
        if (existingOrderIndex !== -1) {
          this.orders?.splice(existingOrderIndex, 1);
        }
        break;
      default:
        break;
    }

    this.cdr.detectChanges(); // Trigger change detection to update the view
  }

  handleRefresh(event: { target: { complete: () => void; }; }) {
    this.getInformation().then(x =>{
      event.target.complete()
    })
  }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
