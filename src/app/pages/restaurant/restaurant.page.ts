import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { DataService } from '../../services/data.service';
import { Restaurant } from "../../models/restaurant.model";
import { Item } from "../../models/item.model";
import { AuthService } from 'src/app/services/auth.service';
import {Order} from "../../models/order.model";
import {AlertController} from "@ionic/angular";
import {Storage} from "@ionic/storage-angular";

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.page.html',
  styleUrls: ['./restaurant.page.scss'],
})
export class RestaurantPage implements OnInit, OnDestroy {

  subscription!: any;
  restaurant: Restaurant | undefined;
  selectedSegment: string = 'menu';
  drinks: Item[] = [];
  menus: Item[] = [];
  desserts: Item[] = [];
  items: Item[] = [];
  showBasket!: boolean;
  order: Order | undefined;
  loaded?: boolean;
  isFavorite: boolean = false;
  userId: string | null = "";

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
    this.cdr.detectChanges();
  }

  constructor(
    private data: DataService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private storage: Storage,
    private alertController: AlertController,
    private router: Router,
  ) { }

  async ngOnInit() {
    await this.storage.create()
    this.loaded = false;

    this.route.params.subscribe(async (params) => {
      this.restaurant = await this.data.getRestaurant(+params['id']);
      this.userId = this.auth.getCurrentUserId()
      if (!this.userId) this.userId = await this.storage.get("user_id")

      this.order = await this.data.getRecentOrder(this.userId, this.restaurant.id);
      await this.getItems();
      if(this.order) {
        this.showBasket = true
      }

      if(this.userId) {
        const favorite = await this.data.getUserFavorite(this.userId, this.restaurant.id);
        this.isFavorite = favorite !== null;
      }

      this.subscribeToChanges();
      this.loaded = true
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
      this.showBasket = true
    } else if (payload.eventType === 'DELETE') {
      this.showBasket = false
      this.order = undefined
    }
  }

  async getItems() {
    this.items = await this.data.getItems(this.restaurant!.id);

    this.menus = this.items.filter(item => item.type === 'Menu');
    this.drinks = this.items.filter(item => item.type === 'Drinks');
    this.desserts = this.items.filter(item => item.type === 'Dessert');
  }

  async controlOrders({ item, count }: { item: number; count: number }) {
    if(!this.order) {
      this.order = await this.data.createOrder(this.auth.getCurrentUserId(), this.restaurant!.id);
      await this.data.createOrderItem(this.order.id, item, count);
      return;
    }

    let order_items = await this.data.getOrderItems(this.order.id);
    let orderItem = order_items.find(x => x.item === item);
    if (orderItem) {
      // If the item exists in both sets but the count is different, update it
      if (orderItem.quantity !== count) {
        await this.data.updateOrderItem(orderItem.id, count);
      }
    } else {
      // If the item only exists in Ionic Storage, insert it
      await this.data.createOrderItem(this.order.id, item, count);
    }
  }

  async openCart(){
    if(this.order){
      await this.router.navigate([`/cart`, this.order!.id]);
    }
  }

  async toggleFavorite() {
    if (!this.restaurant) return;

    if (this.isFavorite) {
      // Show alert before removing from favorites
      const alert = await this.alertController.create({
        header: 'Remove Favorite',
        message: 'Are you sure you want to remove this restaurant from your favorites?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {}
          },
          {
            text: 'Remove',
            role: 'confirm',
            handler: async () => {
              await this.data.deleteUserFavorite(this.userId!, this.restaurant!.id);
              this.isFavorite = false;
            }
          }
        ]
      });

      await alert.present();
    } else {
      await this.data.setUserFavorite(this.userId!, this.restaurant!.id);
      this.isFavorite = true;
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  protected readonly Math = Math;
}
