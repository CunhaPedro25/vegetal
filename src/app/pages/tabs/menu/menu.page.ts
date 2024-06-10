import { Component, OnInit } from '@angular/core';
import { Users } from 'src/app/models/users.model';
import { AuthService } from 'src/app/services/auth.service';
import {Storage} from "@ionic/storage-angular";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  user: Users | null = null

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private storage: Storage
  ) { }

  async ngOnInit() {
    const userId = this.authService.getCurrentUserId()
    if(userId){
      this.user = await this.authService.getUser(userId)
    }
  }

  async logout() {
    await this.storage.create()
    let alertButtons = [
      {
        text: 'Cancel',
        role: 'cancel',
      },
      {
        text: 'Yes',
        role: 'confirm',
        handler: async () => {
          await this.storage.clear();
          await this.authService.signOut()
        },
      },
    ];

    const alert = await this.alertController.create({
      header: 'Logging Out',
      message: 'Are you sure you want to logout?',
      buttons: alertButtons,
    });
    await alert.present()
  }

}
