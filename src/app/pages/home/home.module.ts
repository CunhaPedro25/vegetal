import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { IonicModule } from '@ionic/angular';
import {MapComponent} from "../../components/map/map.component";
import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import {RestaurantCardComponent} from "../../components/restaurant-card/restaurant-card.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    MapComponent,
    LeafletModule
  ],
    declarations: [HomePage, RestaurantCardComponent]
})
export class HomePageModule {}