import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestaurantPage } from './restaurant.page';
import {AuthGuard} from "../../guards/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: RestaurantPage
  },
  {
    path: 'review',
    loadChildren: () => import('./review/review.module').then( m => m.ReviewPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'reviews',
    loadChildren: () => import('./reviews/reviews.module').then( m => m.ReviewsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'info',
    loadChildren: () => import('./info/info.module').then( m => m.InfoPageModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantPageRoutingModule {}
