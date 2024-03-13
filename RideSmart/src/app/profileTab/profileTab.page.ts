import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { ModalController } from '@ionic/angular';
import { RegistrationModalPage } from '../registration-modal/registration-modal.page';
import { LoginModalPage } from '../login-modal/login-modal.page';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-profileTab',
  templateUrl: 'profileTab.page.html',
  styleUrls: ['profileTab.page.scss']
})
export class profileTabPage implements OnInit {
  credentials: FormGroup;

  user: User | null = null;

  userData = {
    name: '',
    age: '',
    bikeModel: ''
  };


  constructor(

    private fb : FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
    private modalController: ModalController,
    private firestoreService: FirestoreService
  )  {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  

  ngOnInit() {
    this.authService.currentUser.subscribe((user) => {
      this.user = user;
    });
    console.log(this.user);
  }

  async updateProfile() {
    if(this.user) {
      await this.firestoreService.addUserDetails(this.user.uid, this.userData);
      // success message
    }
  }

  /*
  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.login(this.credentials.value);
    await loading.dismiss();

    if(user){
      this.router.navigateByUrl('tabs/driveTab', {replaceUrl:true});
    }
    else{
      this.showAlert('Login failed', 'Credentials Incorrect. Please try again');
    }
  }*/

  async logout(){

    const user = await this.authService.logout();
    console.log("User:", this.user);
    console.log("logged out");
  }

  async showRegistrationModal() {
    const modal = await this.modalController.create({
      component: RegistrationModalPage
    });
    return await modal.present();
  }

  async showLoginModal() {
    const modal = await this.modalController.create({
      component: LoginModalPage
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

}
