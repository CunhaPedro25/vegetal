import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Review} from "../../../models/review.model";
import {DataService} from "../../../services/data.service";
import {ActivatedRoute, Params} from "@angular/router";
import {Restaurant} from "../../../models/restaurant.model";
import {AuthService} from "../../../services/auth.service";
import {LoadingController} from "@ionic/angular";

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
})
export class ReviewsPage implements OnInit {
  reviews: Review[] = []
  dineReviews: Review[] = []
  restaurant?: Restaurant
  reviewStats: number[] = []
  loaded?: boolean;

  constructor(
    private data: DataService,
    private auth: AuthService,
    private loadingController: LoadingController,
    private  route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ){ }

  async ngOnInit() {
    const loading = await this.loadingController.create();
    this.loaded = false;

    this.route.params.subscribe(async (params: Params) => {
      this.restaurant = await this.data.getRestaurant(+params['id'])
      this.reviews = await this.data.getReviews(+params['id'])
      for (const x of this.reviews) {
        x.user_name = await this.getUserName(x.user)
      }
      this.dineReviews = this.reviews.filter(x => x.delivery_type === "Dine-in")
      this.calculateReviewStats();

      await loading.dismiss();
      this.loaded = true
      setTimeout(()=>{
        this.cdr.detectChanges();
      }, 100)
    })
  }

  async getUserName(id: string){
    const user = await this.auth.getUser(id);
    return user.name;
  }

  calculateReviewStats() {
    const totalReviews = this.reviews.length;

    if (totalReviews === 0) {
      this.reviewStats = [0, 0, 0, 0, 0];
    } else {
      this.reviewStats = [
        this.reviews.filter(r => r.rating >= 1 && r.rating < 2).length / totalReviews,
        this.reviews.filter(r => r.rating >= 2 && r.rating < 3).length / totalReviews,
        this.reviews.filter(r => r.rating >= 3 && r.rating < 4).length / totalReviews,
        this.reviews.filter(r => r.rating >= 4 && r.rating < 5).length / totalReviews,
        this.reviews.filter(r => r.rating === 5).length / totalReviews,
      ];
    }
  }
}
