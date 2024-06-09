import {Component, OnInit} from '@angular/core';
import {DataService} from "../../../services/data.service";
import {ActivatedRoute} from "@angular/router";
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
    private route: ActivatedRoute,
  ) { }

  async ngOnInit() {
    this.loaded = false;

    this.route.params.subscribe(async (params) => {
      this.restaurant = await this.data.getRestaurant(+params['id']);
      this.opening_hours = this.restaurant.opening_hours
      this.loaded = true
    });
  }

  protected readonly Math = Math;
  protected readonly open = open;
}
