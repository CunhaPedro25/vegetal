import { Component } from '@angular/core';
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  )
  {
    this.authService.getCurrentUser().subscribe((user) => {
      console.log(user);
      if (!user) {
        this.router.navigate(["/login"], {replaceUrl: true});
      }else{
        this.router.navigate(["/"], {replaceUrl: true});
      }
    })
  }
}
