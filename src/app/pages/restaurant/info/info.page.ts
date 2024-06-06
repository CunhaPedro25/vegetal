import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DataService} from "../../../services/data.service";
import {AuthService} from "../../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingController, NavController} from "@ionic/angular";
import {OpeningHours, Restaurant} from "../../../models/restaurant.model";

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {
  restaurant?: Restaurant;
  loaded?: boolean;
  opening_hours: OpeningHours = {};
  days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  constructor(
    private data: DataService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private loadingController: LoadingController,
    private router: Router,
    private navCtrl: NavController,
  ) { }

  async ngOnInit() {
    const loading = await this.loadingController.create();
    this.loaded = false;


    this.route.params.subscribe(async (params) => {
      this.restaurant = await this.data.getRestaurant(+params['id']);
      await loading.dismiss();
      this.opening_hours = this.restaurant.opening_hours
      this.loaded = true
    });
  }

  protected readonly Math = Math;
  protected readonly open = open;
}
