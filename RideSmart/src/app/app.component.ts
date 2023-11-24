import { Component } from '@angular/core';
import { Geolocation, GeolocationPluginPermissions } from '@capacitor/geolocation';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    this.requestPermissions();
  }

  requestPermissions = async (permissions?: GeolocationPluginPermissions) => {
    const status = await Geolocation.requestPermissions(permissions);
    return status;
  };

  printCurrentPosition = async () => {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('Current position:', coordinates);
  };
}
