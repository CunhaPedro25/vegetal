import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../../../services/data.service";
import {AuthService} from "../../../services/auth.service";
import {Restaurant} from "../../../models/restaurant.model";
import {LoadingController} from "@ionic/angular";

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
})
export class ReviewPage implements OnInit {
  restaurant?: Restaurant;
  loaded?: boolean;
  ratings: { [key: string]: number } = {
    overall: 0,
    food: 0,
    atmosphere: 0,
    service: 0,
    delivery: 0
  };
  ratingCategories = [
    { key: 'overall', label: 'Overall' },
    { key: 'food', label: 'Food' },
    { key: 'atmosphere', label: 'Atmosphere' },
    { key: 'service', label: 'Service' },
    { key: 'delivery', label: 'Delivery' }
  ];
  reviewType: string = "dine-in";
  comment = '';

  constructor(
    private data: DataService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private loadingController: LoadingController,
  ) { }

  async ngOnInit() {
    const loading = await this.loadingController.create();
    this.loaded = false;

    this.route.params.subscribe(async (params) => {
      this.restaurant = await this.data.getRestaurant(+params['id']);
      await loading.dismiss();
      this.loaded = true
    });
  }

  setRating(category: string, star: number) {
    this.ratings[category] = (this.ratings[category] === star) ? 0 : star;
  }

  getRating(category: string) {
    return this.ratings[category];
  }

  shouldDisplayCategory(category: string) {
    if (category === 'atmosphere' || category === 'service') {
      return this.reviewType === 'dine-in';
    }
    if (category === 'delivery') {
      return this.reviewType === 'delivery' || this.reviewType === 'pick-up';
    }
    return true;
  }

  calculateFinalRating(): number {
    let ratingsArray = [this.ratings["overall"], this.ratings["food"]];

    if (this.reviewType === 'dine-in') {
      ratingsArray.push(this.ratings["atmosphere"], this.ratings["service"]);
    } else if (this.reviewType === 'delivery' || this.reviewType === 'pick-up') {
      ratingsArray.push(this.ratings["delivery"]);
    }

    const sum = ratingsArray.reduce((a, b) => a + b, 0);
    return sum / ratingsArray.length;
  }

  async submitReview() {
    const finalRating = this.calculateFinalRating();
    console.log('Final Rating:', finalRating);
    console.log('Comment:', this.comment);

    const review = await this.data.uploadReview(this.restaurant!.id, this.auth.getCurrentUserId()!, this.comment, this.calculateFinalRating(), "Dine-in")
    if (review){
      console.log(review)
    }
  }
  protected readonly Math = Math;
}
