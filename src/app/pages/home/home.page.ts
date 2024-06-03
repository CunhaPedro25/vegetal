import { Component, OnInit } from '@angular/core';
import {LoadingController, ModalController} from '@ionic/angular';
import { AddressSearchPage } from '../address-search/address-search.page';
import { DataService } from '../../services/data.service';
import { Restaurant } from '../../models/restaurant.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  restaurants: Restaurant[] = [];
  error: string | null = null;
  selectedAddress: any = {
    display_name: 'Av. do Atlântico 644 4900, Viana do Castelo',
    lat: 41.69427867398096,  // Default latitude
    lon: -8.846855462371082   // Default longitude
  };

  constructor(
    private data: DataService,
    private modalController: ModalController,
    private loadingController: LoadingController
  ) { }

  async ngOnInit() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.data.getRestaurants().then(async (data) => {
      await loading.dismiss();
      this.restaurants = data

      this.updateRestaurantDistances()
    })
  }

  async openAddressSearch() {
    const modal = await this.modalController.create({
      component: AddressSearchPage
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.selectedAddress = data.data;
        this.updateRestaurantDistances();
      }
    });

    return await modal.present();
  }

  updateRestaurantDistances() {
    const userLat = parseFloat(this.selectedAddress.lat);
    const userLon = parseFloat(this.selectedAddress.lon);

    this.restaurants.forEach(restaurant => {
      restaurant.calculateDistance(userLat, userLon);
    });
  }
}
