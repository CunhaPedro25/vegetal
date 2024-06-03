import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestaurantReviewsPageRoutingModule } from './restaurant-reviews-routing.module';

import { RestaurantReviewsPage } from './restaurant-reviews.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RestaurantReviewsPageRoutingModule
  ],
  declarations: [RestaurantReviewsPage]
})
export class RestaurantReviewsPageModule {}
