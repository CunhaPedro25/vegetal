import {Component, OnInit} from '@angular/core';
import {Storage} from "@ionic/storage-angular";
import { StatusBar, Style } from '@capacitor/status-bar';
import {Capacitor} from "@capacitor/core";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  paletteToggle = false;

  constructor(
    private storage: Storage
  ) {}

  async ngOnInit() {
    await this.storage.create()
    this.paletteToggle = await this.storage.get("theme");
    if( !this.paletteToggle ) { this.paletteToggle = false; }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    await this.initializeDarkPalette(this.paletteToggle);
    prefersDark.addEventListener('change', (mediaQuery) => this.initializeDarkPalette(mediaQuery.matches));
    await this.storage.set("theme", this.paletteToggle)
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

  async initializeDarkPalette(isDark: boolean) {
    this.paletteToggle = isDark;
    await this.toggleDarkPalette(isDark);
    await this.storage.set("theme", isDark);
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
