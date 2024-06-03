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

  constructor(
    protected data: DataService,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    await this.loadRestaurants()
  }

  async loadRestaurants(){
    this.restaurants = []
    const loading = await this.loadingController.create();
    await loading.present();

    this.data.getRestaurantsWithinRadius().then(async (data) => {
      await loading.dismiss();
      this.restaurants = data
      this.cdr.detectChanges();
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
}
