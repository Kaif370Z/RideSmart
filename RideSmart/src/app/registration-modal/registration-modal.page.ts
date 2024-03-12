import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-registration-modal',
  templateUrl: './registration-modal.page.html',
  styleUrls: ['./registration-modal.page.scss'],
})
export class RegistrationModalPage implements OnInit {
  credentials: FormGroup;

  constructor(

    private fb : FormBuilder,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router
    ) {

    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
   }

  ngOnInit() {
  }

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.register(this.credentials.value);
    await loading.dismiss();

    if(user){
      //this.router.navigateByUrl('/tabs/driveTab', {replaceUrl:true});
      this.modalController.dismiss();
      this.showAlert('Registration Successful', 'Log in!');
    }
    else{
      this.showAlert('Registration failed', 'Please try again');
    }
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
