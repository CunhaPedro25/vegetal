import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../../../services/data.service";
import {ActivatedRoute} from "@angular/router";
import {OpeningHours, Restaurant} from "../../../models/restaurant.model";
import { Clipboard } from '@capacitor/clipboard';
import {AlertController, IonToast} from "@ionic/angular";
import {AuthService} from "../../../services/auth.service";
import {Storage} from "@ionic/storage-angular";

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {
  @ViewChild('toast') toast: IonToast | undefined;

  restaurant?: Restaurant;
  reviewsCount: number = 0;
  loaded?: boolean;
  opening_hours: OpeningHours = {};
  days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  isFavorite: boolean = false;
  userId: string | null = "";

  constructor(
    private data: DataService,
    private auth: AuthService,
    private storage: Storage,
    private route: ActivatedRoute,
    private alertController: AlertController,
  ) { }

  async ngOnInit() {
    this.loaded = false;

    this.route.params.subscribe(async (params) => {
      this.restaurant = await this.data.getRestaurant(+params['id']);
      this.reviewsCount = (await this.data.getReviews(this.restaurant.id)).length
      this.opening_hours = this.restaurant.opening_hours
      this.loaded = true

      this.userId = this.auth.getCurrentUserId()
      if (!this.userId) this.userId = await this.storage.get("user_id")

      if(this.userId) {
        const favorite = await this.data.getUserFavorite(this.userId, this.restaurant.id);
        this.isFavorite = favorite !== null;
      }
    });
  }

  async copyAddress(){
    this.toast?.present()
    await Clipboard.write({
      string: this.restaurant?.address,
    });
  }

  async toggleFavorite() {
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

  protected readonly Math = Math;
  protected readonly open = open;
}
