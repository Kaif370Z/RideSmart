import { Injectable } from '@angular/core';
import { Geolocation, WatchPositionCallback, Position } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class SpeedService {

  watchId: any;

  constructor() { }

 startSpeedWatch(updateCallback: WatchPositionCallback) {
  const options = {
    enableHighAccuracy: true, 
    timeout: 10000, 
    maximumAge: 0, 
  };

  this.watchId = Geolocation.watchPosition(options, (position, err) => {
    if (!err && position) {
      const speedInMetersPerSecond = position.coords.speed ?? 0; 
      const speedInKmPerHour = speedInMetersPerSecond * 3.6;
      const speedInMph = speedInMetersPerSecond * 2.237;
      const lat = position.coords.latitude;
      updateCallback(position, err);
    } else {
      updateCallback(null, err);
    }
  });
}

  stopSpeedWatch() {
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
    }
  }
}