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
  @ViewChild(MapComponent) mapComponent: MapComponent | undefined;
  @ViewChild('reviewModal') reviewModal: IonModal | undefined;

  restaurants: Restaurant[] = [];
  error: string | null = null;
  loaded?: boolean;
  tab: string = "delivery";
  reviewAlert: boolean = false;
  param: number = 0;
  type: string = "" 
  restaurantName: string = ""

  constructor(
    protected data: DataService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router,
    private route: ActivatedRoute,
    private storage: Storage,
    private cdr: ChangeDetectorRef
  ) {}

  async loadRestaurants(){
    this.restaurants = []
    const loading = await this.loadingController.create();
    this.loaded = false

    this.data.getRestaurantsWithinRadius().then(async (data) => {
      this.restaurants = data
      await loading.dismiss();
      this.cdr.detectChanges();
      this.loaded = true

      this.route.queryParams.subscribe(async params => {
        if (params["id"] !== undefined) {
          this.param = params["id"]
          this.type = params["type"]
          this.restaurantName = this.restaurants!.find(x => x.id = params["id"])!.name
          this.reviewAlert = true
        }
      })
    })
  }

  async openReview() {
    this.reviewModal?.dismiss().then(() => {
      this.router.navigate([`/restaurant/${this.param}/review`], { queryParams: { type: this.type } });
    });
  }

  async closeModal() {
    await this.reviewModal?.dismiss();
    await this.router.navigate(["/"], {
      relativeTo: this.route,
      queryParams: {},
      queryParamsHandling: 'merge',
    });
  }

  async openAddressSearch() {
    await this.router.navigate(['addresses']);
  }

  async onTabChange() {
    await this.storage.set(`tab`, this.tab)
  }

  search(event: any) {
    const searched = event.detail.value;
  
    if (searched && searched.trim() !== '') {
      this.restaurants = this.restaurants.filter((restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(searched.toLowerCase()) > -1);
      });
    } else {
      this.loadRestaurants();
    }
  }

  async ngOnInit() {
    await this.storage.create()
    this.tab = await this.storage.get(`tab`)
    if (!this.tab) this.tab = "Delivery"
    await this.loadRestaurants()
  }
}
