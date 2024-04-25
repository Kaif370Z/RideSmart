import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SMS } from '@ionic-native/sms/ngx';
import { CrashDetectionService } from '../services/crash-detection.service';
import { FirestoreService } from '../services/firestore.service';
import { AuthService } from '../services/auth.service';
import { Geolocation } from '@capacitor/geolocation';
import { locationUpdates } from '../services/location.service';


@Component({
  selector: 'app-crash-modal',
  templateUrl: './crash-modal.page.html',
  styleUrls: ['./crash-modal.page.scss'],
})
export class CrashModalPage implements OnInit {
  //30 second countdown to close the modal page
  countdown: number = 30;
  private countdownInterval: any;
  emergencyNumber: string = '';
  latitude : any;
  longitude : any;

  constructor(private modalController: ModalController, private sms: SMS, private crashDetectionService: CrashDetectionService, private authService: AuthService, private firestoreService : FirestoreService) {}

  //call startCountdown() when the modal opens
  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.firestoreService.getUserDetails(user.uid).subscribe(userDetails => {
          if (userDetails && userDetails.emergencyNumber) {
            this.emergencyNumber = userDetails.emergencyNumber;
          }
        });
      }
    });
    this.startCountdown();
    locationUpdates.subscribe({
      next: (location) => {
        this.latitude = location.latitude;
        this.longitude = location.longitude;
        console.log('New Location received in modal:', this.latitude, this.longitude);
      }
    });
  }
  //start thecountdown and call notifyEmergencyContact() if the countdown reaches 0 seconds
  startCountdown() {
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(this.countdownInterval);
        this.notifyEmergencyContact();
      }
      //to seconds
    }, 1000);
  }

  //close the modal and reset countdown
  dismissModal() {
    clearInterval(this.countdownInterval);
    this.modalController.dismiss();
    this.crashDetectionService.resetModalCount();
  }

  // getLocation() {
  //   const watchOptions = {
  //     enableHighAccuracy: true,
  //     timeout: 500,
  //     maximumAge: 0
  //   };
  
  //   Geolocation.getCurrentPosition(watchOptions).then((position) => {
  //     this.latitude = position.coords.latitude;
  //     this.longitude = position.coords.longitude;
  //     console.log("position received:" ,this.latitude, this.longitude);
  //   }).catch((error: any) => {
  //     console.error("cant get crash location", error);
  //   });
  // }

  //send message to emergency contact
  notifyEmergencyContact() {
    //number to contact
    const emergencyNumber = this.emergencyNumber;
    //text message body
    const message = 'I have been in a crash. Please notify the emergency services.';
    //intent: '' sends the message on android without any user interaction
    this.sms.send(emergencyNumber, message, {android: {intent: ''}})
      .then(() => {
        console.log('emergency sms sent');
      })
      .catch((error) => {
        console.error('failed to send emergency SMS', error);
      });
    this.dismissModal();
  }
}
