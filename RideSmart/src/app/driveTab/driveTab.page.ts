
import { Component, Inject, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation} from '@capacitor/geolocation';
import { SpeedService } from '../services/speed.service';
import { CrashDetectionService } from '../services/crash-detection.service';
import { GoogleRoadsService } from '../services/google-roads.service';

import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion/ngx';
import { Gyroscope, GyroscopeOptions, GyroscopeOrientation } from '@ionic-native/gyroscope/ngx';
import { HEREService } from '../services/here.service';
import { SensorFusionService } from '../services/sensor-fusion.service';

declare var google: {
  maps: {
    MapTypeId: { ROADMAP: any; };
    Map: new (arg0: any, arg1: { zoom: number; mapTypeId: any; mapTypeControl: boolean; streetViewControl: boolean; fullscreenControl: boolean; }) => any;
    LatLng: new (arg0: number, arg1: number) => any;
    Polyline: new (arg0: { path: any[]; geodesic: boolean; strokeColor: string; strokeOpacity: number; strokeWeight: number; }) => any;
    geometry: {
      spherical: {
        computeDistanceBetween: (from: any, to: any) => number;
      }
    };
  };
};

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

  watchId: any | null = null;
  kmh: number = 0;

  currentSpeedMph: number = 0;
  lat: number = 0;
  speed: number = 0;
  currentHeading: number  = 0;

  currentSpeedLimit: string = '';

  public speedLimit: number = 0;

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

  constructor(public deviceMotion: DeviceMotion, public gyroscope: Gyroscope, private platform: Platform, private speedService: SpeedService, private crashDetectionService: CrashDetectionService, private googleRoadsService: GoogleRoadsService, private hereService: HEREService, private sensorFusionService : SensorFusionService) {
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
    // this.watchSpeed(); 
    this.sensorFusionService.startSensors();
  }

  getAngle() {
    const angle = this.sensorFusionService.getCurrentAngle();
    console.log(`Current lean angle: ${angle}`);
    return angle;
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
      this.gid = this.deviceMotion.watchAcceleration(option).subscribe((acc: DeviceMotionAccelerationData) => {
        //assinging data from device accelerometer to local variables
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
    let options: GyroscopeOptions = { frequency: 100 };
    this.gid = this.gyroscope.watch(options).subscribe((orientation: GyroscopeOrientation) => {
      //assigning gyroscope data to variables
      this.gx = "" + orientation.x;
      this.gy = "" + orientation.y;
      this.gz = "" + orientation.z;
      this.gtimestamp = "" + orientation.timestamp;

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

  getLeanAngle(): number {
    return this.leanAngle;
  }



  //change colour of angle scale depending on lean angle
  getArrowColor(leanAngle: number): string {
    if (leanAngle >= -20 && leanAngle < 20) {
      return 'green';
    } else if (leanAngle >= 20 && leanAngle < 40) {
      return 'orange';
    } else if (leanAngle >= 40) {
      return 'red';
    } else if (leanAngle >= -40 && leanAngle < -20) {
      return 'orange';
    } else if (leanAngle < -40) {
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

    return leanAngleDegrees;
  }

  lastPosition: Position | null = null;
  movementThreshold = 10;

  startTracking1() {
    const watchOptions = {
      enableHighAccuracy: true,
      timeout: 500,
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

          //if the distance is between last point is 0.3 consider the speed 0
          if (distance < 0.3) {
            this.kmh = 0;
          } else {
            //update speed normally if the distance moved is 0.5 meters or more
            const speedInMetersPerSecond = position.coords.speed ?? 0;
            this.kmh = speedInMetersPerSecond * 3.6;
          }
        } else {
          //no last position, so just set the current one (first time this runs)
          const speedInMetersPerSecond = position.coords.speed ?? 0;
          this.kmh = speedInMetersPerSecond * 3.6;
        }


        //update lastPosition with the current position for the next comparison
        this.lastPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        // Generate waypoints for the speed limit check
        let waypoints = [];
        if (this.lastPosition) {
          waypoints.push({ latitude: this.lastPosition.latitude, longitude: this.lastPosition.longitude });
        }
        waypoints.push({ latitude: position.coords.latitude, longitude: position.coords.longitude });

        
        this.currentHeading = position.coords.heading ?? 0;
        console.log("Current Heading" , this.currentHeading);
        this.checkSpeedLimitsForRoute(waypoints)
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


  checkSpeedLimitsForRoute(waypoints: { latitude: number, longitude: number }[]) {
    this.hereService.getSpeedLimits(waypoints).subscribe({
      next: (apiResponse) => {
        try {
          const fromRefSpeedLimit = apiResponse.response.route[0].leg[0].link[0].attributes.SPEED_LIMITS_FCN[0].FROM_REF_SPEED_LIMIT;
          this.speedLimit = Number(fromRefSpeedLimit);
          console.log(this.speedLimit);
        } catch (error) {
          console.error('Failed to extract speed limit from response:', error);
          this.speedLimit = 0;
        }
      },
      error: (error) => {
        console.error('Error fetching speed limits:', error);
        this.speedLimit = 0;
      }
    });
  }

  getSpeedLimitSign(): string {
    console.log("getting speed limit sign");
    console.log("Current speed limit: ", this.speedLimit);
    this.getSpeedWarning();
    switch(this.speedLimit) {
      case 0:
        return 'assets/images/none.png';
      case 30:
        return 'assets/images/30.png';
      case 50:
        console.log("applying 50 kmh image");
        return 'assets/images/50.png';
      case 60:
        return 'assets/images/60.png';
      case 80:
        return 'assets/images/80.png';
      case 100:
        return 'assets/images/100.png';
      default:
        console.log("default case, speed limit: ", this.speedLimit);
        return 'assets/images/none.png'; 
    }
  }
  
  getSpeedWarning()  {
    if( this.kmh > this.speedLimit){
      console.log("SPEED LIMIT REACHED");
      console.log("numbers:" , this.kmh, this.speedLimit)
      return {color: 'red', class: 'pulsing'} ;
    }
    else{
      return {color: 'green'};
    }
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

  startMonitoringCrash() {
    this.crashDetectionService.startMonitoring();
  }
}


