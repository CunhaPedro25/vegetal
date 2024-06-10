 import { Component } from '@angular/core';
import {AlertController, LoadingController} from "@ionic/angular";
import {AuthService} from "../../services/auth.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage  {
  credentials = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.minLength(9)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) {}

  get firstName() {
    return this.credentials.controls.firstName;
  }

  get lastName() {
    return this.credentials.controls.lastName;
  }

  get email() {
    return this.credentials.controls.email;
  }

  get password() {
    return this.credentials.controls.password;
  }



  async createAccount() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.signUp(this.credentials.getRawValue()).then(async (data) => {
      await loading.dismiss();

      if (data.error) {
        await this.showAlert('Registration failed', data.error.message);
      } else {
        await this.showAlert('Signup success', 'Please confirm your email now!');
        this.router.navigateByUrl('/tabs', {replaceUrl: true});
      }
    });
  }

  async showAlert(title: string, msg: string) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }

}
