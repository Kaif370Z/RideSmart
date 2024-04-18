import { Injectable } from '@angular/core';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { ModalController } from '@ionic/angular';
import { CrashModalPage } from '../crash-modal/crash-modal.page';

@Injectable({
  providedIn: 'root'
})
export class CrashDetectionService {
  private crashThresholdG = 15; 

  constructor(private deviceMotion: DeviceMotion, private modalController: ModalController) {}

  startMonitoring() {
    const option = { frequency: 100 };
    console.log("started crash service");
    this.deviceMotion.watchAcceleration(option).subscribe((acc: DeviceMotionAccelerationData) => {
      const accelerationMagnitude = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
      const accelerationG = accelerationMagnitude / 9.81;
      if (accelerationG > this.crashThresholdG) {
        this.presentCrashModal();
      }
    });
  }

  async presentCrashModal() {
    const modal = await this.modalController.create({
      component: CrashModalPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }
}