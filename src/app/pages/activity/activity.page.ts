import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Order} from "../../models/order.model";
import {DataService} from "../../services/data.service";
import {AuthService} from "../../services/auth.service";
import {LoadingController} from "@ionic/angular";

@Component({
  selector: 'app-activity',
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss'],
})
export class ActivityPage implements OnInit {

  deliveries?: Order[];

  constructor(
    private data: DataService,
    private authService: AuthService,
    private loadingController: LoadingController,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    await this.getInformation()
  }

  async ionViewWillEnter(){
    await this.getInformation()
  }

  async getInformation(){
    const loading = await this.loadingController.create();
    await loading.present();

    const userId = this.authService.getCurrentUserId()
    if(userId) {
      this.deliveries = await this.data.getUserOrders(userId);
      this.deliveries = this.deliveries.filter(x => x.status === "delivered")
    }

    this.cdr.detectChanges();
    await loading.dismiss();
  }

}
