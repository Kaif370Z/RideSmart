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
    enableHighAccuracy: true, // Use high accuracy mode
    timeout: 10000,
    interval: 1000, // Timeout for the watch
    maximumAge: 0, // Accept only the freshest data
  };

  this.watchId = Geolocation.watchPosition(options, (position, err) => {
    if (!err && position) {
      const speedInMetersPerSecond = position.coords.speed ?? 0; // Handle null speed
      const speedInKmPerHour = speedInMetersPerSecond * 3.6;
      const speedInMph = speedInMetersPerSecond * 2.237;
      const lat = position.coords.latitude;
      // Call the callback function with the speed data
      updateCallback(position, err);
    } else {
      // Handle error or no position available
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