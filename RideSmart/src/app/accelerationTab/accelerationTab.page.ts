import { Component, OnInit} from '@angular/core';
import { CrashDetectionService } from '../services/crash-detection.service';
import { Geolocation} from '@capacitor/geolocation';

interface Position {
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-accelerationTab',
  templateUrl: 'accelerationTab.page.html',
  styleUrls: ['accelerationTab.page.scss']
})
export class accelerationTabPage {



  constructor(private crashDetectionService: CrashDetectionService, private geolocation: Geolocation) {}
  
  lastPosition: Position | null = null;
  movementThreshold = 10;
  currentHeading: number  = 0;
  kmh: number = 0;
  watchId: any | null = null;
  targetSpeed: number = 0;
  startTime: number = 0;
  timeTaken: number = 0;


  startTracking() {
    const watchOptions = {
      enableHighAccuracy: true,
      timeout: 500,
      maximumAge: 0
    };

    this.watchId = Geolocation.watchPosition(watchOptions, (position, err) => {
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
        
        if (this.startTime === null && this.kmh > 0) {
          //start timer when move is detected
          this.startTime = Date.now();
        }

        if (this.kmh >= this.targetSpeed) {
          //once the target speed is reached calculate the time taken
          this.timeTaken = (Date.now() - this.startTime) / 1000;
          console.log('time taken');
          Geolocation.clearWatch(this.watchId);
        }

       
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

  startMonitoringCrash() {
    this.crashDetectionService.startMonitoring();
  }
}
