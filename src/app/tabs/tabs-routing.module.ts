import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../pages/tabs/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'carts',
        loadChildren: () => import('../pages/tabs/carts/carts.module').then(m => m.CartsPageModule)
      },
      {
        path: 'activity',
        loadChildren: () => import('../pages/tabs/activity/activity.module').then(m => m.ActivityPageModule)
      },
      {
        path: 'menu',
        loadChildren: () => import('../pages/tabs/menu/menu.module').then(m => m.MenuPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]  // Ensure the RouterModule is exported
})
export class TabsPageRoutingModule {}
