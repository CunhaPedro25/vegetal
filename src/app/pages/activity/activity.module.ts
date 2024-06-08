import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivityPageRoutingModule } from './activity-routing.module';

import { ActivityPage } from './activity.page';
import {OrderCardComponent} from "../../components/order-card/order-card.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivityPageRoutingModule,
    OrderCardComponent
  ],
  declarations: [ActivityPage]
})
export class ActivityPageModule {}
