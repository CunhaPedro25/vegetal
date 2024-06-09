import {Component, Input, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
  imports: [
    IonicModule,
    NgIf,
    NgForOf
  ],
  standalone: true
})
export class StarRatingComponent  implements OnInit {
  @Input() rating?: number;
  @Input() showRating?:boolean = true;
  filledStars?: number;
  semiFilledStars?: number;
  emptyStars?: number;
  constructor() { }

  ngOnInit() {
    if(this.rating !== undefined) {
      this.filledStars = Math.floor(this.rating);
      this.semiFilledStars = this.rating % 1 >= 0.5 ? 1 : 0;
      this.emptyStars = 5 - this.filledStars - this.semiFilledStars;
    }
  }

}
