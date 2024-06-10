import { Component, OnInit } from '@angular/core';
import {Storage} from "@ionic/storage-angular";
import {AlertController} from "@ionic/angular";
import { Capacitor } from '@capacitor/core';
import {StatusBar, Style} from "@capacitor/status-bar";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  paletteToggle: boolean = false;

  constructor(
    private alertController: AlertController,
    private storage: Storage
  ) { }

  async ngOnInit() {
    await this.storage.create()
    this.paletteToggle = await this.storage.get("theme");
  }

  async clearCache() {
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

        },
      },
    ];

    const alert = await this.alertController.create({
      header: 'Clear cache',
      message: 'Are you sure you want to clear this apps cache?',
      buttons: alertButtons,
    });
    await alert.present()
  }

  async handleChange(e: { detail: { value: string; }; }) {
    await this.toggleDarkPalette((e.detail.value === "dark"))
    await this.storage.set("theme", (e.detail.value === "dark"));
  }

  async toggleDarkPalette(shouldAdd: boolean | undefined) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
    document.documentElement.classList.toggle('dark', shouldAdd);
    if(Capacitor.isNativePlatform()) {
      if (shouldAdd) {
        await StatusBar.setStyle({style: Style.Dark});
        await StatusBar.setBackgroundColor({color: "#0e150e"});
      } else {
        await StatusBar.setStyle({style: Style.Light});
        await StatusBar.setBackgroundColor({color: "#f4fcef"});
      }
    }
  }
}
