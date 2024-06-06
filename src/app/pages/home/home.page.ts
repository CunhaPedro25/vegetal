import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {LoadingController, ModalController} from '@ionic/angular';
import { AddressSearchPage } from '../address-search/address-search.page';
import { DataService } from '../../services/data.service';
import { Restaurant } from '../../models/restaurant.model';
import {Address} from "../../models/address.model";
import {Storage} from "@ionic/storage-angular";
import {MapComponent} from "../../components/map/map.component";

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
    const modal = await this.modalController.create({
      component: AddressSearchPage
    });

    modal.onDidDismiss().then(async (data) => {
      if (data.data) {
        const address: Address = {
          address: data.data.display_name,
          latitude: parseFloat(data.data.lat),  // Default latitude
          longitude: parseFloat(data.data.lon),  // Default longitude
          city: data.data.address.town,
          zip_code: data.data.address.postcode
        };

        this.data.setSelectedAddress(address);
        await this.loadRestaurants()
        this.mapComponent?.updateMap();
      }
    });

    return await modal.present();
  }

  async onTabChange() {
    await this.storage.set(`tab`, this.tab)
  }

  async ngOnInit() {
    await this.storage.create()
    this.tab = await this.storage.get(`tab`)
    await this.loadRestaurants()
  }
}
