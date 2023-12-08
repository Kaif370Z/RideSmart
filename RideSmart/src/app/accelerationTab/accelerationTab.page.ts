import { Component } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';


@Component({
  selector: 'app-accelerationTab',
  templateUrl: 'accelerationTab.page.html',
  styleUrls: ['accelerationTab.page.scss']
})
export class accelerationTabPage {

  constructor() {}

  async getCurrentLocation() {
   try {
     const permissionStatus = await Geolocation.checkPermissions();
     console.log('permission status: ', permissionStatus.location);
     if(permissionStatus?.location != 'granted') {
       const requestStatus = await Geolocation.requestPermissions();
       if(requestStatus.location != 'granted') {
        // go to location settings
        return ;
       }
     }
     let options: PositionOptions = {
      maximumAge: 3000,
      timeout: 10000,
      enableHighAccuracy: false
     };
     const position = await Geolocation.getCurrentPosition(options);
     console.log(position);
   } catch(e) {
     console.log(e);
     throw(e);
   }
  }
}
