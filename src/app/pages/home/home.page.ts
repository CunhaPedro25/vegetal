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

  constructor(
    protected data: DataService,
    private modalController: ModalController,
    private loadingController: LoadingController
  ) { }

  async ngOnInit() {
    await this.loadRestaurants()
  }

  async loadRestaurants(){
    const loading = await this.loadingController.create();
    await loading.present();

    this.data.getRestaurantsWithinRadius().then(async (data) => {
      await loading.dismiss();
      console.log(data)
      this.restaurants = data
    })
  }

  async openAddressSearch() {
    const modal = await this.modalController.create({
      component: AddressSearchPage
    });

    modal.onDidDismiss().then(async (data) => {
      if (data.data) {
        this.data.setSelectedAddress(data.data);
        await this.loadRestaurants()
      }
    });

    return await modal.present();
  }
}
