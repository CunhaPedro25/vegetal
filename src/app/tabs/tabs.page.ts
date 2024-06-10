import {Component, OnInit} from '@angular/core';
import {Capacitor} from "@capacitor/core";
import {StatusBar, Style} from "@capacitor/status-bar";
import {Storage} from "@ionic/storage-angular";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit{

  constructor(
    private storage: Storage,
  ) {}

  async ngOnInit() {
    await this.storage.create()
    this.storage.get("theme").then(async (isDark) => {
      if(Capacitor.isNativePlatform()) {
        if (isDark) {
          await StatusBar.setStyle({style: Style.Dark});
          await StatusBar.setBackgroundColor({color: "#0e150e"});
        } else {
          await StatusBar.setStyle({style: Style.Light});
          await StatusBar.setBackgroundColor({color: "#f4fcef"});
        }
      }
    })
  }

}
