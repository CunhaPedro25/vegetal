import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Order} from "../../../models/order.model";
import {DataService} from "../../../services/data.service";
import {AuthService} from "../../../services/auth.service";
import {Storage} from "@ionic/storage-angular";

@Component({
  selector: 'app-activity',
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss'],
})
export class ActivityPage implements OnInit {

  deliveries?: Order[];
  loaded: boolean = false;

  constructor(
    private data: DataService,
    private authService: AuthService,
    private storage: Storage,
    private cdr: ChangeDetectorRef
  ) { }

  async getInformation(){
    this.loaded = false

    await this.storage.create()
    let userId = this.authService.getCurrentUserId()
    if(!userId) userId = await this.storage.get("user_id")

    if(userId) {
      await this.storage.set("user_id", userId)
      this.deliveries = await this.data.getUserOrders(userId);
      this.deliveries = this.deliveries.filter(x => x.status === "delivered").reverse()
    }

    this.cdr.detectChanges();
    this.loaded = true
  }

  async ngOnInit() {
    await this.getInformation()
  }
}
