import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LoadingController, ModalController} from '@ionic/angular';
import { AddressSearchPage } from '../address-search/address-search.page';
import { DataService } from '../../services/data.service';
import { Restaurant } from '../../models/restaurant.model';
import {Address} from "../../models/address.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  restaurants: Restaurant[] = [];
  error: string | null = null;
  loaded?: boolean;

  constructor(
    protected data: DataService,
    private modalController: ModalController,
    private loadingController: LoadingController,
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
      }
    });

    return await modal.present();
  }

  changePage(event: any){
    console.log(event);
  }

  async ngOnInit() {
    await this.loadRestaurants()
  }
}
