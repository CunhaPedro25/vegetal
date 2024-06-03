import { Component, OnInit } from '@angular/core';
import {AlertController, LoadingController} from "@ionic/angular";
import {AuthService} from "../../services/auth.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  credentials = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) {}

  get name() {
    return this.credentials.controls.name;
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
      console.log('data: ', data);

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

  ngOnInit() {
  }

}
