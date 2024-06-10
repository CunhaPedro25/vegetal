import { Component, OnInit } from '@angular/core';
import {DataService} from "../../services/data.service";
import {Storage} from "@ionic/storage-angular";
import {AuthService} from "../../services/auth.service";
import {Restaurant} from "../../models/restaurant.model";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  userId: string | null = null;
  favorites: Restaurant[] = [];
  loaded: boolean = true;

  constructor(
    private data: DataService,
    private auth: AuthService,
    private storage: Storage
  ) { }

  async ngOnInit() {
    this.loaded = false;
    await this.storage.create()
    this.userId = this.auth.getCurrentUserId()
    if (!this.userId) this.userId = await this.storage.get("user_id")

    if(this.userId) {
      const favorites = await this.data.getUserFavorites(this.userId);
      for (const favorite of favorites) {
        this.data.getRestaurant(favorite.restaurant).then((restaurant) => {
          this.favorites.push(restaurant);
        })
      }
    }
    this.loaded = true;
  }

}
