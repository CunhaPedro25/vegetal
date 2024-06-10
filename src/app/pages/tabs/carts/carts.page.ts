// Import necessary modules and components from Angular and Ionic
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

  // Define properties used in the component
  orders: Order[] = [];
  deliveries: Order[] = [];
  subscription: any;
  loaded: boolean = false;

  // Dependency injection for various services
  constructor(
    private data: DataService,
    private authService: AuthService,
    private storage: Storage,
    private cdr: ChangeDetectorRef
  ) { }

  // OnInit lifecycle hook to initialize component
  async ngOnInit() {
    await this.getInformation();
  }

  // Lifecycle hook that runs when the view is about to be entered
  async ionViewWillEnter() {
    await this.getInformation();
  }

  // Method to fetch and organize user orders
  async getInformation() {
    this.loaded = false;

    // Initialize storage
    await this.storage.create();
    let userId = this.authService.getCurrentUserId();
    if (!userId) userId = await this.storage.get("user_id");

    if (userId) {
      await this.storage.set("user_id", userId);
      this.orders = await this.data.getUserOrders(userId);
      // Filter orders based on their status
      this.deliveries = this.orders.filter(x => x.status !== null && x.status !== "" && x.status !== "delivered");
      this.orders = this.orders.filter(x => (x.status === null || x.status === ""));
      this.orders = this.orders.filter(x => x.status !== "delivered");
    }

    // Subscribe to real-time changes
    this.subscribeToChanges();
    this.cdr.detectChanges();
    this.loaded = true;
  }

  // Method to subscribe to changes in the orders table
  subscribeToChanges() {
    this.subscription = AuthService.client()
      .channel('supabase_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, async (payload: any) => {
        await this.handleChanges(payload);
      })
      .subscribe();
  }

  // Method to handle changes in the orders table
  async handleChanges(payload: any) {
    const orderId = payload.old.id;
    let existingOrderIndex = this.orders!.findIndex(x => x.id === orderId);

    // Handle different types of events
    switch (payload.eventType) {
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

  // Method to handle refresh events
  handleRefresh(event: { target: { complete: () => void; }; }) {
    this.getInformation().then(x => {
      event.target.complete();
    });
  }

  // OnDestroy lifecycle hook to clean up subscriptions
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
