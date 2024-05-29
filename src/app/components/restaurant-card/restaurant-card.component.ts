import { Component, Input, OnInit } from '@angular/core';
import {Restaurant} from "../../models/restarurant.model";

@Component({
  selector: 'app-restaurant-card',
  templateUrl: './restaurant-card.component.html',
  styleUrls: ['./restaurant-card.component.scss'],
})
export class RestaurantCardComponent  implements OnInit {
  @Input() restaurant: Restaurant | undefined;
  constructor() { }

  ngOnInit() {}

}
