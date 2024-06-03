import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestaurantReviewsPage } from './restaurant-reviews.page';

const routes: Routes = [
  {
    path: '',
    component: RestaurantReviewsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantReviewsPageRoutingModule {}
