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
    path: 'addresses',
    loadChildren: () => import('./pages/addresses/addresses.module').then(m => m.AddressesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'address-details',
    loadChildren: () => import('./pages/address-details/address-details.module').then( m => m.AddressDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'restaurant/:id',
    loadChildren: () => import('./pages/restaurant/restaurant.module').then( m => m.RestaurantPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'cart/:id',
    loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'checkout/:id',
    loadChildren: () => import('./pages/checkout/checkout.module').then(m => m.CheckoutPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'delivery/:id',
    loadChildren: () => import('./pages/delivery/delivery.module').then( m => m.DeliveryPageModule),
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
