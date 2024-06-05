import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./guards/auth.guard";

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'address-search',
    loadChildren: () => import('./pages/address-search/address-search.module').then( m => m.AddressSearchPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'restaurant/:id',
    loadChildren: () => import('./pages/restaurant/restaurant.module').then( m => m.RestaurantPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'reviews/:id',
    loadChildren: () => import('./pages/reviews/restaurant-reviews.module').then(m => m.RestaurantReviewsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'cart/:id',
    loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'payment/:id',
    loadChildren: () => import('./pages/payment/payment.module').then( m => m.PaymentPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'delivery/:id',
    loadChildren: () => import('./pages/delivery/delivery.module').then( m => m.DeliveryPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'review',
    loadChildren: () => import('./pages/review/review.module').then( m => m.ReviewPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
