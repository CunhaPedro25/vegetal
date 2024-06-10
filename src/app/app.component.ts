import {Component, OnInit} from '@angular/core';
import {Storage} from "@ionic/storage-angular";
import { StatusBar, Style } from '@capacitor/status-bar';
import {Capacitor} from "@capacitor/core";
import {Platform} from "@ionic/angular";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  paletteToggle = false;

  constructor(
    private storage: Storage,
    private platform: Platform,
  ) {}

  async ngOnInit() {
    this.platform.ready().then(async () => {
      await this.storage.create()
      this.paletteToggle = await this.storage.get("theme");
      if( !this.paletteToggle ) { this.paletteToggle = false; }

      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      prefersDark.addEventListener('change', (mediaQuery) => this.initializeDarkPalette(mediaQuery.matches));

      await this.initializeDarkPalette(this.paletteToggle);
      await this.storage.set("theme", this.paletteToggle)

      if(Capacitor.isNativePlatform()) {
      if (this.paletteToggle) {
        await StatusBar.setStyle({style: Style.Dark});
        await StatusBar.setBackgroundColor({color: "#0e150e"});
      } else {
        await StatusBar.setStyle({style: Style.Light});
        await StatusBar.setBackgroundColor({color: "#f4fcef"});
      }
      }
    });
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
