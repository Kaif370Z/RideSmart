import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { ModalController } from '@ionic/angular';
import { RegistrationModalPage } from '../registration-modal/registration-modal.page';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.page.html',
  styleUrls: ['./login-modal.page.scss'],
})
export class LoginModalPage implements OnInit {
  credentials: FormGroup;

  user: User | null = null;

  constructor(
    private fb : FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
    private modalController: ModalController
  ) { 
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.login(this.credentials.value);
    await loading.dismiss();

    if(user){
     // this.router.navigateByUrl('tabs/driveTab', {replaceUrl:true});
      this.modalController.dismiss();
      this.showAlert('Log In Successful', 'Ride Safe!');
      console.log("Logged in")
    }
    else{
      this.showAlert('Login failed', 'Credentials Incorrect. Please try again');
    }
  }

  async showRegistrationModal() {
    const modal = await this.modalController.create({
      component: RegistrationModalPage
    });
    return await modal.present();
  }

  async showAlert(header: string , message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  dismissModal() {
    this.modalController.dismiss();
  }

}
