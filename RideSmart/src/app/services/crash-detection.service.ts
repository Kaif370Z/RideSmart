import { Injectable } from '@angular/core';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { ModalController } from '@ionic/angular';
import { CrashModalPage } from '../crash-modal/crash-modal.page';
import { SensorFusionService } from './sensor-fusion.service';

@Injectable({
  providedIn: 'root'
})
export class CrashDetectionService {
  private crashThresholdG = 5; 
  private leanAngle : number = 0;
  private presentedModalCount : number = 0;

  constructor(private deviceMotion: DeviceMotion, private modalController: ModalController, private sensorFusionService: SensorFusionService) {}

  startMonitoring() {
    const option = { frequency: 1500 };
    console.log("started crash service");
    this.sensorFusionService.startSensors();
    this.deviceMotion.watchAcceleration(option).subscribe((acc: DeviceMotionAccelerationData) => {
      const accelerationMagnitude = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
      const accelerationG = accelerationMagnitude / 9.81;
      if (accelerationG > this.crashThresholdG || this.getAngle() > 60 && this.presentedModalCount == 0) {
        this.presentCrashModal();
        this.presentedModalCount++;
      }
    });
  }

  resetModalCount(){
    this.presentedModalCount = 0;
  }

  getAngle() {
    const angle = this.sensorFusionService.getCurrentAngle();
    console.log(`lean angle: ${angle}`);
    return angle;
  }

  async presentCrashModal() {
    const modal = await this.modalController.create({
      component: CrashModalPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }
}