import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {LoadingController} from "@ionic/angular";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit{

  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  async ngOnInit() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.getCurrentUser().subscribe(async (user) => {
      await loading.dismiss();

      if (!user) {
        this.router.navigate(["/login"], {replaceUrl: true});
      }else{
        this.router.navigate(["/"], {replaceUrl: true});
      }
    })
  }

}
