
import { Component, Inject } from '@angular/core';
import { PluginListenerHandle } from '@capacitor/core';
import { Motion } from '@capacitor/motion';
import { Platform } from '@ionic/angular';

import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion/ngx';
import { Gyroscope, GyroscopeOptions, GyroscopeOrientation } from '@ionic-native/gyroscope/ngx';

@Component({
  selector: 'driveTab',
  templateUrl: 'driveTab.page.html',
  styleUrls: ['driveTab.page.scss']
})
export class driveTabPage {

  x: string;
  y: string;
  z: string;
  timestamp: string;

  gx: string;
  gy: string;
  gz: string;
  gtimestamp: string;

  //identification id of the listener
  id: any;
  gid: any;

  constructor(public deviceMotion: DeviceMotion, public gyroscope: Gyroscope,private platform: Platform ) {
    this.x = "-";
    this.y = "-";
    this.z = "-";
    this.timestamp = "-";

    this.gx = "-";
    this.gy = "-";
    this.gz = "-";
    this.gtimestamp = "-";


  }

  startAccel() {
    try {
      //How often to collect accelerometer Data
      var option: DeviceMotionAccelerometerOptions =
      {
        //200 ms
        frequency: 200
      };

      //
      this.gid= this.deviceMotion.watchAcceleration(option).subscribe((acc: DeviceMotionAccelerationData) => {
        //assinging data from device sensors to local variables
        this.x = "" + acc.x;
        this.y = "" + acc.y;
        this.z = "" + acc.z;
        this.timestamp = "" + acc.timestamp;
      });
    }
    //catch error if any
    catch (error) {
      alert("Error " + error);
    }
  }
  stopAccel() {
    this.id.unsubscribe();
  }

  startGyro() {
    this.platform.ready().then(() => {
      try {
        this.gyroscope.getCurrent().then((orientation: GyroscopeOrientation) => {
          // Assigning data from device sensors to local variables
          this.gx = "" + orientation.x;
          this.gy = "" + orientation.y;
          this.gz = "" + orientation.z;
          this.gtimestamp = "" + orientation.timestamp;
        }).catch((error) => {
          console.error('Error getting gyroscope data:', error);
          alert('Error ' + error);
        });
      } catch (error) {
        console.error('Error starting gyroscope:', error);
        alert('Error ' + error);
      }
    });
  }

  stopGyro(){
    this.gid.unsubscribe();
  }

}



