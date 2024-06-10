import { Component, Input, OnInit } from '@angular/core';
import {Restaurant} from "../../models/restaurant.model";
import {Router} from "@angular/router";
import {AlertController} from "@ionic/angular";
import {DataService} from "../../services/data.service";
import {AuthService} from "../../services/auth.service";
import {Storage} from "@ionic/storage-angular";

@Component({
  selector: 'app-restaurant-card',
  templateUrl: './restaurant-card.component.html',
  styleUrls: ['./restaurant-card.component.scss'],
})
export class RestaurantCardComponent  implements OnInit {
  @Input() restaurant?: Restaurant;
  @Input() skeleton?: boolean
  @Input() full_width?: boolean
  isFavorite: boolean = false;
  userId: string | null = "";

  constructor(
    private router: Router,
    private data: DataService,
    private auth: AuthService,
    private storage: Storage,
    private alertController: AlertController
  ) { }

  async ngOnInit() {
    await this.storage.create()
    if (this.restaurant) {
      this.userId = this.auth.getCurrentUserId()
      if (!this.userId) this.userId = await this.storage.get("user_id")

      if(this.userId) {
        const favorite = await this.data.getUserFavorite(this.userId, this.restaurant.id);
        this.isFavorite = favorite !== null;
      }
    }
  }

  protected readonly Math = Math;

  async openRestaurant() {
    if(!this.skeleton)
      await this.router.navigate([`/restaurant`, this.restaurant?.id]);
  }

  async toggleFavorite(event: Event) {
    event.stopPropagation();

    if (!this.restaurant) return;

    if (this.isFavorite) {
      // Show alert before removing from favorites
      const alert = await this.alertController.create({
        header: 'Remove Favorite',
        message: 'Are you sure you want to remove this restaurant from your favorites?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {}
          },
          {
            text: 'Remove',
            role: 'confirm',
            handler: async () => {
              await this.data.deleteUserFavorite(this.userId!, this.restaurant!.id);
              this.isFavorite = false;
            }
          }
        ]
      });

      await alert.present();
    } else {
      await this.data.setUserFavorite(this.userId!, this.restaurant!.id);
      this.isFavorite = true;
    }
  }
}
