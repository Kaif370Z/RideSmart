
import { Component, Inject } from '@angular/core';
import { PluginListenerHandle } from '@capacitor/core';
import { Motion } from '@capacitor/motion';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';

import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion/ngx';
import { Gyroscope, GyroscopeOptions, GyroscopeOrientation } from '@ionic-native/gyroscope/ngx';

@Component({
  selector: 'driveTab',
  templateUrl: 'driveTab.page.html',
  styleUrls: ['driveTab.page.scss']
})
export class driveTabPage {

  public currentSpeed: number | null = null;

  x: string;
  y: string;
  z: string;
  timestamp: string;

  gx: string;
  gy: string;
  gz: string;
  gtimestamp: string;

  //identification id of the listeners
  id: any;
  gid: any;

  //angular velocity around y axis
  gyroscopeRateY: number = 0;
  
  //lean angle estimation
  leanAngle: number = 0;
 
  //time tracking for gyroscope
  lastUpdate: number = 0;

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
    //How often to collect accelerometer Data
    let options: GyroscopeOptions = { frequency: 1000 }; 
    this.gid = this.gyroscope.watch(options).subscribe((orientation: GyroscopeOrientation) => {
      /*this.gx = "" + orientation.x;
      this.gy = "" + orientation.y;
      this.gz = "" + orientation.z;
      this.gtimestamp = "" + orientation.timestamp;*/

      //current time
      const now = Date.now();
      if (this.lastUpdate !== 0) {
        //converting to seconds
        const deltaTime = (now - this.lastUpdate) / 1000;
        //assigning sensor data to variable 
        this.gyroscopeRateY = orientation.y;
        
        this.leanAngle += this.gyroscopeRateY * deltaTime;
      }
      this.lastUpdate = now;
      console.log('Current Lean Angle:', this.leanAngle);
    });  
  }

  getLeanAngle() : number {
    return this.leanAngle;
  }

  stopGyro() {
    this.gid.unsubscribe();
  }

  calculateLeanAngle(): number {
      //convert string accelerometer values to numbers
      const ax = parseFloat(this.x);
      const ay = parseFloat(this.y);
      const az = parseFloat(this.z);

      //convert to radians
      const leanAngleRadians = Math.atan2(ay, Math.sqrt(ax * ax + az * az));
      
      //radians to degrees
      let leanAngleDegrees = leanAngleRadians * (180 / Math.PI);
      
      console.log("Lean Angle Degrees:", leanAngleDegrees);
    
      return 90 - leanAngleDegrees;
  }


  //tracking speed using geolocation api
  async startTrackingSpeed() {
    const watchOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    Geolocation.watchPosition(watchOptions, (position, err) => {
      if (position) {
        this.currentSpeed = position.coords.speed;
      } else if (err) {
        console.error("speed tracker error:", err);
      }
    });
  }

  get currentSpeedKmH(): number | null {
    return this.currentSpeed !== null ? this.currentSpeed * 3.6 : null;
  }

}





