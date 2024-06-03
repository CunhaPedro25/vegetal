import { Component, Input, OnInit } from '@angular/core';
import {Restaurant} from "../../models/restaurant.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-restaurant-card',
  templateUrl: './restaurant-card.component.html',
  styleUrls: ['./restaurant-card.component.scss'],
})
export class RestaurantCardComponent  implements OnInit {
  @Input() restaurant!: Restaurant;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  protected readonly Math = Math;

  async openRestaurant(id: number) {
    await this.router.navigate([`/restaurant`, id]);
  }
}
