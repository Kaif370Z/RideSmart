
import { Component, Inject, OnInit } from '@angular/core';
import { PluginListenerHandle } from '@capacitor/core';
import { Motion } from '@capacitor/motion';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { SpeedService } from '../services/speed.service';
import { CrashDetectionService } from '../services/crash-detection.service';

import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion/ngx';
import { Gyroscope, GyroscopeOptions, GyroscopeOrientation } from '@ionic-native/gyroscope/ngx';

interface Position {
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'driveTab',
  templateUrl: 'driveTab.page.html',
  styleUrls: ['driveTab.page.scss']
})






export class driveTabPage {


  //https://www.youtube.com/watch?v=U7lf_E79j7Q&t=112s

  public currentSpeed: number | null = null;
  public currentSpeedKmH: number = 0;

  watchId: string | null = null;
  kmh: number = 0;

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

  constructor(public deviceMotion: DeviceMotion, public gyroscope: Gyroscope,private platform: Platform ,private speedService : SpeedService,private crashDetectionService: CrashDetectionService) {
    this.x = "-";
    this.y = "-";
    this.z = "-";
    this.timestamp = "-";

    this.gx = "-";
    this.gy = "-";
    this.gz = "-";
    this.gtimestamp = "-";


  }

  ngOnInit() {
   // this.watchSpeed(); // Start tracking when the component loads
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
    return 'green'; 
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

  


 //lastPoint: Position | null = null;

 lastPosition: Position | null = null;
 movementThreshold = 10; 


startTracking() {
  const watchOptions = {
    enableHighAccuracy: true,
    timeout: 0, // Adjusted to 5000 for better accuracy over time
    maximumAge: 0
  };

  // Threshold for treating the speed as 0 (in meters per second)
  const speedThreshold = 0.5; // Adjust this value based on testing and requirements

  Geolocation.watchPosition(watchOptions, (position, err) => {
    if (position) {
      let speedInMetersPerSecond = position.coords.speed ?? 0;

      // Apply threshold to treat low speeds as 0
      if (speedInMetersPerSecond < speedThreshold) {
        speedInMetersPerSecond = 0;
      }

      this.kmh = speedInMetersPerSecond * 3.6;
      console.log(this.kmh, position.coords.latitude, position.coords.longitude);
    } else if (err) {
      console.error('Error watching position:', err);
    }
  }).then(watchId => {
    this.watchId = watchId;
  }).catch(error => {
    console.error('Error starting geolocation watch:', error);
  });
}

startTracking1() {
  const watchOptions = {
    enableHighAccuracy: true,
    timeout: 0, // Adjusted for better accuracy over time
    maximumAge: 0
  };

  Geolocation.watchPosition(watchOptions, (position, err) => {
    if (position) {
      if (this.lastPosition) {
        // Calculate the distance between the last and current position
        const distance = this.calculateDistance(
          this.lastPosition.latitude,
          this.lastPosition.longitude,
          position.coords.latitude,
          position.coords.longitude
        );

        // If the distance is less than 3 meters, consider the device stationary
        if (distance < 0.5) {
          this.kmh = 0;
        } else {
          // Update speed normally if the distance moved is 3 meters or more
          const speedInMetersPerSecond = position.coords.speed ?? 0;
          this.kmh = speedInMetersPerSecond * 3.6;
        }
      } else {
        // No last position, so just set the current one (first time this runs)
        const speedInMetersPerSecond = position.coords.speed ?? 0;
        this.kmh = speedInMetersPerSecond * 3.6;
      }

      // Update lastPosition with the current position for the next comparison
      this.lastPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      console.log(`Speed: ${this.kmh} km/h`, position.coords.latitude, position.coords.longitude);
    } else if (err) {
      console.error('Error watching position:', err);
    }
  }).then(watchId => {
    this.watchId = watchId;
  }).catch(error => {
    console.error('Error starting geolocation watch:', error);
  });
}


//Applying Haverstine Formula
calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const earthRadiusKm = 6371;

  const dLat = this.degreesToRadians(lat2 - lat1);
  const dLon = this.degreesToRadians(lon2 - lon1);

  lat1 = this.degreesToRadians(lat1);
  lat2 = this.degreesToRadians(lat2);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  const distance = earthRadiusKm * c;

  return distance * 1000;
}

degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}


}


