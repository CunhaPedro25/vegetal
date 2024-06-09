import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReviewPageRoutingModule } from './review-routing.module';

import { ReviewPage } from './review.page';
import {HomePageModule} from "../../home/home.module";
import {StarRatingComponent} from "../../../components/star-rating/star-rating.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReviewPageRoutingModule,
    HomePageModule,
    StarRatingComponent
  ],
  declarations: [ReviewPage]
})
export class ReviewPageModule {}
