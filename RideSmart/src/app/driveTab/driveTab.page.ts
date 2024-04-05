
import { Component, Inject } from '@angular/core';
import { PluginListenerHandle } from '@capacitor/core';
import { Motion } from '@capacitor/motion';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { SpeedService } from '../services/speed.service';

import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion/ngx';
import { Gyroscope, GyroscopeOptions, GyroscopeOrientation } from '@ionic-native/gyroscope/ngx';

@Component({
  selector: 'driveTab',
  templateUrl: 'driveTab.page.html',
  styleUrls: ['driveTab.page.scss']
})




export class driveTabPage {

  //https://www.youtube.com/watch?v=U7lf_E79j7Q&t=112s

  public currentSpeed: number | null = null;

  currentSpeedMph: number = 0;
  lat : number = 0;
  speed : number = 0;

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

  constructor(public deviceMotion: DeviceMotion, public gyroscope: Gyroscope,private platform: Platform ,private speedService : SpeedService) {
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
        //100 ms
        frequency: 100
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

  

  //change colour of angle scale depending on lean angle
  getArrowColor(leanAngle: number): string {
    if (leanAngle >= -20 && leanAngle < 20 ) {
      return 'green';
    } else if (leanAngle >= 20 && leanAngle < 40) {
      return 'orange';
    } else if (leanAngle >= 40) {
      return 'red';
    }else if (leanAngle >= -40 && leanAngle < -20){
      return 'orange';
    }else if(leanAngle < -40){
      return 'red';
    }
    return 'pink'; 
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
      const leanAngleRadians = Math.atan2(ax, Math.sqrt(ay * ay + az * az));
      
      //radians to degrees
      let leanAngleDegrees = leanAngleRadians * (180 / Math.PI);
      
      console.log("Lean Angle Degrees:", leanAngleDegrees);
    
      return  leanAngleDegrees;
  }


  //tracking speed using geolocation api
  async watchSpeed() {
    this.speedService.startSpeedWatch((position, err) => {
      if (position) {
        this.currentSpeedMph = (position.coords.speed ?? 0) * 3.6;
        this.lat = position.coords.latitude;
      } else if (err) {
        // Handle error
        console.error(err);
      }
    });
  }

  getSpeed(){
    return this.speed = this.currentSpeedMph;
  }

  getcurrentSpeedKmH(): number | null {
    return this.currentSpeed !== null ? this.currentSpeed * 3.6 : null;
  }

/*
  UpdateGyroscopeData()
  {
      // Gryo data
      double XGyro = _gyro.X;
      double YGyro = _gyro.Y;
      double ZGyro = _gyro.Z;

      //tblXGyro.Text = "X: " + XGyro.ToString("00.00");
      //tblYGyro.Text = "Y: " + YGyro.ToString("00.00");
      //tblZGyro.Text = "Z: " + ZGyro.ToString("00.00");

      // quaternion data
      tblXGyro.Text = "GX: " + _quat.X.ToString("0.00");
      tblYGyro.Text = "GY: " + _quat.Y.ToString("0.00");
      tblZGyro.Text = "GZ: " + _quat.Z.ToString("0.00");
      //tblQW.Text = "W: " + _quat.W.ToString("0.00");

      //#region Calculate Euler Angles
      double roll, pitch, yaw;
      roll = -1 * Math.Atan2(2.0f * (_quat.W * _quat.X + _quat.Y * _quat.Z),
          1.0f - 2.0f * (_quat.X * _quat.X + _quat.Y * _quat.Y));
      roll = (roll * 180.0) / Math.PI;
     
      pitch = Math.Asin(2.0f * (_quat.W * _quat.Y - _quat.Z * _quat.X));
      pitch = (pitch * 180.0) / Math.PI;

      yaw = Math.Atan2(2.0f * (_quat.W * _quat.Z + _quat.X * _quat.Y),
          1.0f - 2.0f * (_quat.Y * _quat.Y + _quat.Z * _quat.Z));
      yaw = (yaw * 180.0f) / Math.PI;

      tblQX.Text = "Pitch: " + pitch.ToString("0.00");
      tblQY.Text = "Roll: " + roll.ToString("0.00");
      tblQZ.Text = "Yaw: " + yaw.ToString("0.00");

      //#endregion

      pitchLine.X2 = (pitchLine.X1 + pitch);
      yawLine.Y2 = yawLine.Y1 - yaw;
      rollLine.X2 = (rollLine.X1 - roll);
      rollLine.Y2 = (rollLine.Y1 + roll);


      if( pitch > 0)
      {
          bUp = true;
      }
      else
      {
          bUp = false;
      }

      if (roll <= 0 )
      {
          bLeft = false;
      }
      else
      {
          bLeft = true;   // opposite to what you might think
      }
      _prevRoll = roll;
  }*/



}




