// Import necessary modules and components from Angular and Ionic
import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {AlertController, IonModal, LoadingController} from '@ionic/angular';
import { DataService } from '../../../services/data.service';
import { Restaurant } from '../../../models/restaurant.model';
import {Storage} from "@ionic/storage-angular";
import {MapComponent} from "../../../components/map/map.component";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  // ViewChild decorators to get references to child components
  @ViewChild(MapComponent) mapComponent: MapComponent | undefined;
  @ViewChild('reviewModal') reviewModal: IonModal | undefined;

  // Define properties used in the component
  restaurants: Restaurant[] = [];
  error: string | null = null;
  loaded?: boolean;
  tab: string = "delivery";
  reviewAlert: boolean = false;
  param: number = 0;
  type: string = "";
  restaurantName: string = "";

  // Dependency injection for various services
  constructor(
    protected data: DataService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router,
    private route: ActivatedRoute,
    private storage: Storage,
    private cdr: ChangeDetectorRef
  ) {}

  // Method to load restaurants
  async loadRestaurants() {
    this.restaurants = [];
    const loading = await this.loadingController.create();
    this.loaded = false;

    // Fetch restaurants from data service
    this.data.getRestaurantsWithinRadius().then(async (data) => {
      this.restaurants = data;
      await loading.dismiss();
      this.cdr.detectChanges();
      this.loaded = true;

      // Check if query params contain an ID and set relevant properties
      this.route.queryParams.subscribe(async params => {
        if (params["id"] !== undefined) {
          this.param = params["id"];
          this.type = params["type"];
          this.restaurantName = this.restaurants!.find(x => x.id = params["id"])!.name;
          this.reviewAlert = true;
        }
      });
    });
  }

  // Method to navigate to the review page
  async openReview() {
    this.reviewModal?.dismiss().then(() => {
      this.router.navigate([`/restaurant/${this.param}/review`], { queryParams: { type: this.type } });
    });
  }

  // Method to close the modal
  async closeModal() {
    await this.reviewModal?.dismiss();
    await this.router.navigate(["/"], {
      relativeTo: this.route,
      queryParams: {},
      queryParamsHandling: 'merge',
    });
  }

  // Method to navigate to the address search page
  async openAddressSearch() {
    await this.router.navigate(['addresses']);
  }

  // Method to handle tab change and store it in local storage
  async onTabChange() {
    await this.storage.set(`tab`, this.tab);
  }

  // Method to handle search input and filter restaurants
  async search(event: any) {
    const searched = event.detail.value;

    if (searched && searched.trim() !== '') {
      this.restaurants = this.restaurants.filter((restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(searched.toLowerCase()) > -1);
      });
    } else {
      await this.loadRestaurants();
    }
  }

  // OnInit lifecycle hook to initialize component
  async ngOnInit() {
    await this.storage.create();
    this.tab = await this.storage.get(`tab`);
    if (!this.tab) this.tab = "Delivery";
    await this.loadRestaurants();

    // Subscribe to selected address observable to reload restaurants
    this.data.getSelectedAddressObservable().subscribe(() => {
      this.loadRestaurants();
    });
  }
}
