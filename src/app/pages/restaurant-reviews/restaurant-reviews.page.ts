import { Component, OnInit } from '@angular/core';
import {Review} from "../../models/review.model";
import {DataService} from "../../services/data.service";
import {ActivatedRoute, Params, RouterLink} from "@angular/router";

@Component({
  selector: 'app-restaurant-reviews',
  templateUrl: './restaurant-reviews.page.html',
  styleUrls: ['./restaurant-reviews.page.scss'],
})
export class RestaurantReviewsPage implements OnInit {
  reviews: Review[] = []

  constructor(private dataService: DataService, private  route: ActivatedRoute){ }

  async ngOnInit() {
    this.route.params.subscribe(async (params: Params) => {
      this.reviews = await this.dataService.getReviews(+params['id'])
    })
  }
}
