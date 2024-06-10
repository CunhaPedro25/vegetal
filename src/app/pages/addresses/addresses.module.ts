import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddressesPageRoutingModule } from './addresses-routing.module';

import { AddressesPage } from './addresses.page';
import {AddressDetailsPageModule} from "../address-details/address-details.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AddressesPageRoutingModule,
        AddressDetailsPageModule
    ],
  declarations: [AddressesPage]
})
export class AddressesPageModule {}
