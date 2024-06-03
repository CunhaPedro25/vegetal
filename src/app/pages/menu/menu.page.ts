import { Component, OnInit } from '@angular/core';
import { Users } from 'src/app/models/users.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  user: Users | null = null

  constructor(
    private authService: AuthService,
    ) { }

  async ngOnInit() {
    const userId = this.authService.getCurrentUserId()
    if(userId){
      this.user = await this.authService.getUser(userId)
    }
  }

  async logout() {
    await this.authService.signOut()
  }

}
