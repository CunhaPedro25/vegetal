import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { Storage } from '@ionic/storage-angular'; // Import Ionic Storage
import { DataService } from '../../services/data.service';
import { Restaurant } from "../../models/restaurant.model";
import { Item } from "../../models/item.model";
import {Order} from "../../models/order.model";
import {OrderItem} from "../../models/order-item.model";

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.page.html',
  styleUrls: ['./restaurant.page.scss'],
})
export class RestaurantPage implements OnInit {

  restaurant: Restaurant | undefined;
  selectedSegment: string = 'menu';
  drinks: Item[] = [];
  foods: Item[] = [];
  desserts: Item[] = [];
  items: Item[] = [];
  rest: number = 1;
  counter!: number;

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
    this.cdr.detectChanges();
  }

  constructor(
    private data: DataService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private storage: Storage // Inject the Storage service
  ) { }

  async ngOnInit() {
    this.route.params.subscribe(async params => {
      this.restaurant = await this.data.getRestaurant(+params['id']);
    });
    await this.getItems();
    await this.loadItemCounters();
  }

  async getItems() {
    this.items = await this.data.getItems(this.rest);

    this.foods = this.items.filter(item => item.type === 'Food');
    this.drinks = this.items.filter(item => item.type === 'Drinks');
    this.desserts = this.items.filter(item => item.type === 'Dessert');
  }

  async loadItemCounters() {
    await this.storage.create(); // Ensure storage is created
    // Retrieve item counters from storage
    for (let item of this.items) {
      const counter = await this.storage.get(`item_${item.id}_counter`);
      if (counter !== null) {
        this.counter = counter;
      }
    }
    this.cdr.detectChanges();
  }

  async openReviews() {
    await this.router.navigate([`/reviews`, this.restaurant!.id]);
  }

  protected readonly Math = Math;
}
