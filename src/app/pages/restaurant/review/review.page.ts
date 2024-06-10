import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../../services/data.service";
import {AuthService} from "../../../services/auth.service";
import {Restaurant} from "../../../models/restaurant.model";
import {IonToast, LoadingController} from "@ionic/angular";

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
})
export class ReviewPage implements OnInit {
  @ViewChild('toast') toast: IonToast | undefined;

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
  reviewType: string = "Dine-in";
  comment = '';
  submitting: boolean = false;

  constructor(
    private data: DataService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
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

    this.route.queryParams.subscribe(async params => {
      if (params["type"] !== undefined) {
        this.reviewType = params["type"]
      }
    })
  }

  setRating(category: string, star: number) {
    this.ratings[category] = (this.ratings[category] === star) ? 0 : star;
  }

  getRating(category: string) {
    return this.ratings[category];
  }

  shouldDisplayCategory(category: string) {
    if (category === 'atmosphere' || category === 'service') {
      return this.reviewType === 'Dine-in';
    }
    if (category === 'delivery') {
      return this.reviewType === 'Delivery' || this.reviewType === 'Pick-up';
    }
    return true;
  }

  calculateFinalRating(): number {
    let ratingsArray = [this.ratings["overall"], this.ratings["food"]];

    if (this.reviewType === 'Dine-in') {
      ratingsArray.push(this.ratings["atmosphere"], this.ratings["service"]);
    } else if (this.reviewType === 'Delivery' || this.reviewType === 'Pick-up') {
      ratingsArray.push(this.ratings["delivery"]);
    }

    const sum = ratingsArray.reduce((a, b) => a + b, 0);
    return sum / ratingsArray.length;
  }

  async submitReview() {
    this.submitting = true
    this.data.uploadReview(this.restaurant!.id, this.auth.getCurrentUserId()!, this.comment, this.calculateFinalRating(), this.reviewType).then((res: any) => {
      this.submitting = false

      this.toast?.present()
      this.toast?.onDidDismiss().then(async () => {
        await this.router.navigate(['../'])
      })
    })
  }
  protected readonly Math = Math;
}
