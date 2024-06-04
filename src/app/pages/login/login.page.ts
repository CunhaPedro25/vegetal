import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {AlertController, LoadingController} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  })

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.router.navigate(["/"], {replaceUrl: true});
      }
    })
  }

  get email(){
    return this.credentials.controls.email;
  }

  get password(){
    return this.credentials.controls.password;
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.signIn(this.credentials.getRawValue()).then(async (data) => {
      await loading.dismiss();
      if (data.error) {
        await this.showAlert('Login Failed', data.error.message);
      }
    })
  }

  async showAlert(title: string, message: string) {
      const alert = await this.alertController.create({
        header: title,
        message: message,
        buttons: ['OK']
      })
    await alert.present();
  }

  ngOnInit() {
  }
}
