import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ItemCardComponent } from "../../components/item-card/item-card.component";
import { RestaurantPageRoutingModule } from './restaurant-routing.module';

import { RestaurantPage } from './restaurant.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RestaurantPageRoutingModule
    ],
    exports: [
        ItemCardComponent
    ],
    declarations: [RestaurantPage, ItemCardComponent]
})
export class RestaurantPageModule {}
