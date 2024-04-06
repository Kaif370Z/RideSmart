import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { ModalController } from '@ionic/angular';
import { RegistrationModalPage } from '../registration-modal/registration-modal.page';
import { UserProfileUpdateModalPage } from '../user-profile-update-modal/user-profile-update-modal.page';
import { LoginModalPage } from '../login-modal/login-modal.page';
import { FirestoreService } from '../services/firestore.service';
import { PhotoService } from '../services/photo.service'

@Component({
  selector: 'app-profileTab',
  templateUrl: 'profileTab.page.html',
  styleUrls: ['profileTab.page.scss']
})
export class profileTabPage implements OnInit {
  credentials: FormGroup;

  user: User | null = null;

  userData = {
    make: '',
    model: '',
    year: '',
    part: '',
    serviceDoneDate: ''
  };

  constructor(
    public photoService: PhotoService,
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
      if (this.user) {
        // Subscribe to user details
        this.firestoreService.getUserDetails(this.user.uid).subscribe(
          (userDetails) => {
            // If userDetails exists, assign it to local userData
            if (userDetails) {
              this.userData = userDetails;
            }
          },
          (error) => {
            // Handle any errors here
            console.error('Error fetching user details:', error);
          }
        );
      }
    });
  }
  
  async fetchUserDetails() {
    if (this.user) {
      try {
        const userDetails = await this.firestoreService.getUserDetails(this.user.uid).toPromise(); // Make sure getUserDetails returns an Observable
        if (userDetails) {
          this.userData = userDetails;
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }
  }

  async updateProfile() {
    const loading = await this.loadingController.create({ message: 'Updating profile...' });
    await loading.present();
  
    try {
      if(this.user) {
        await this.firestoreService.addUserDetails(this.user.uid, this.userData);
        this.showAlert('Success', 'Profile updated successfully');
      } else {
        this.showAlert('Error', 'No authenticated user found');
      }
    } catch (error) {
      console.error(error);
      this.showAlert('Error', 'Failed to update profile');
    } finally {
      await loading.dismiss();
    }
  }

  async showUpdateProfileModal() {
    const modal = await this.modalController.create({
      component: UserProfileUpdateModalPage,
      componentProps: {
        // Pass any data you need to initialize the modal with
        'userData': this.userData
      }
    });
    /*modal.onDidDismiss()
      .then((data) => {
        // You can do something with data returned from modal here
      });*/
    return await modal.present();
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
