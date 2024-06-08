import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddressDetailsPageRoutingModule } from './address-details-routing.module';

import { AddressDetailsPage } from './address-details.page';
import {MapComponent} from "../../components/map/map.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddressDetailsPageRoutingModule,
    MapComponent
  ],
    exports: [
        AddressDetailsPage
    ],
    declarations: [AddressDetailsPage]
})
export class AddressDetailsPageModule {}
