import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReviewsPageRoutingModule } from './reviews-routing.module';

import { ReviewsPage } from './reviews.page';
import {HomePageModule} from "../../tabs/home/home.module";
import {StarRatingComponent} from "../../../components/star-rating/star-rating.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReviewsPageRoutingModule,
    HomePageModule,
    StarRatingComponent
  ],
  declarations: [ReviewsPage]
})
export class ReviewsPageModule {}
