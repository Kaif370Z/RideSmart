import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { ModalController } from '@ionic/angular';
import { FirestoreService } from '../services/firestore.service';
import { PhotoService } from '../services/photo.service'

@Component({
  selector: 'app-user-profile-update-modal',
  templateUrl: './user-profile-update-modal.page.html',
  styleUrls: ['./user-profile-update-modal.page.scss'],
})
export class UserProfileUpdateModalPage implements OnInit {
  credentials: FormGroup;

  user: User | null = null;
  
  userData = {
    make: '',
    model: '',
    year: '',
    part: '',
    serviceDoneDate: '',
    profileImageUrl: ''
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
  ) { 
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.authService.currentUser.subscribe((user) => {
      this.user = user;
    });
    console.log(this.user);
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

  dismissModal() {
    this.modalController.dismiss();
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
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
