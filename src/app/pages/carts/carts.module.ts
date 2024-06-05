import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { CartsPageRoutingModule } from './carts-routing.module';

import { CartsPage } from './carts.page';
import {OrderCardComponent} from "../../components/order-card/order-card.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartsPageRoutingModule
  ],
  declarations: [CartsPage, OrderCardComponent]
})
export class CartsPageModule {}
