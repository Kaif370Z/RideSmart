import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SMS } from '@ionic-native/sms/ngx';
import { CrashDetectionService } from '../services/crash-detection.service';

@Component({
  selector: 'app-crash-modal',
  templateUrl: './crash-modal.page.html',
  styleUrls: ['./crash-modal.page.scss'],
})
export class CrashModalPage implements OnInit {
  //30 second countdown to close the modal page
  countdown: number = 30;
  private countdownInterval: any;

  constructor(private modalController: ModalController, private sms: SMS, private crashDetectionService: CrashDetectionService) {}

  //call startCountdown() when the modal opens
  ngOnInit() {
    this.startCountdown();
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

  //send message to emergency contact
  notifyEmergencyContact() {
    //number to contact
    const emergencyNumber = '0879485889';
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
