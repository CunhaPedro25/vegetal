import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {LoadingController, ModalController} from '@ionic/angular';
import { DataService } from '../../services/data.service';
import { Restaurant } from '../../models/restaurant.model';
import {Storage} from "@ionic/storage-angular";
import {MapComponent} from "../../components/map/map.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(MapComponent) mapComponent: MapComponent | undefined;

  restaurants: Restaurant[] = [];
  error: string | null = null;
  loaded?: boolean;
  tab: string = "delivery";

  constructor(
    protected data: DataService,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private router: Router,
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
    })
  }

  async openAddressSearch() {
    await this.router.navigate(['addresses']);
  }

  async onTabChange() {
    await this.storage.set(`tab`, this.tab)
  }

  async ngOnInit() {
    await this.storage.create()
    this.tab = await this.storage.get(`tab`)
    if (!this.tab) this.tab = "delivery"
    await this.loadRestaurants()
  }
}
