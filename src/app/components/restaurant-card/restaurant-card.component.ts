import { Component, Input, OnInit } from '@angular/core';
import {Restaurant} from "../../models/restaurant.model";

@Component({
  selector: 'app-restaurant-card',
  templateUrl: './restaurant-card.component.html',
  styleUrls: ['./restaurant-card.component.scss'],
})
export class RestaurantCardComponent  implements OnInit {
  @Input() restaurant: Restaurant | undefined;
  filledStars: number = 0;
  semiFilledStars: number = 0;
  emptyStars: number = 5;

  constructor() { }

  ngOnInit() {
    if (this.restaurant) {
      this.calculateStars(this.restaurant.average_rating);
    }
  }

  calculateStars(rating: number) {
    this.filledStars = Math.floor(rating);
    this.semiFilledStars = rating % 1 >= 0.5 ? 1 : 0;
    this.emptyStars = 5 - this.filledStars - this.semiFilledStars;
  }

}
