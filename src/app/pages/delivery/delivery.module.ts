import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeliveryPageRoutingModule } from './delivery-routing.module';

import { DeliveryPage } from './delivery.page';
import {MapComponent} from "../../components/map/map.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DeliveryPageRoutingModule,
        MapComponent
    ],
  declarations: [DeliveryPage]
})
export class DeliveryPageModule {}
