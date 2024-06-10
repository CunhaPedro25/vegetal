import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ItemCardComponent } from "../../components/item-card/item-card.component";
import { RestaurantPageRoutingModule } from './restaurant-routing.module';

import { RestaurantPage } from './restaurant.page';
import {HomePageModule} from "../tabs/home/home.module";
import {StarRatingComponent} from "../../components/star-rating/star-rating.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RestaurantPageRoutingModule,
        HomePageModule,
        StarRatingComponent
    ],
    exports: [
        ItemCardComponent,
        RestaurantPage
    ],
    declarations: [RestaurantPage, ItemCardComponent]
})
export class RestaurantPageModule {}
