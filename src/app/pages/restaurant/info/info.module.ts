import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfoPageRoutingModule } from './info-routing.module';

import { InfoPage } from './info.page';
import {MapComponent} from "../../../components/map/map.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoPageRoutingModule,
    MapComponent
  ],
  declarations: [InfoPage]
})
export class InfoPageModule {}
