
import { Component, Inject } from '@angular/core';
import { PluginListenerHandle } from '@capacitor/core';
import { Motion } from '@capacitor/motion';

import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion/ngx';

@Component({
  selector: 'driveTab',
  templateUrl: 'driveTab.page.html',
  styleUrls: ['driveTab.page.scss']
})
export class driveTabPage{

  x:string;
  y:string;
  z:string;
  timestamp:string;

  //identification id of the listener
  id: any;

constructor(public deviceMotion: DeviceMotion ) {
  this.x = "-";
  this.y = "-";
  this.z = "-";
  this.timestamp = "-";
}

start()
{ 
    try{
      //How often to collect accelerometer Data
      var option: DeviceMotionAccelerometerOptions = 
      {
        //200 ms
        frequency: 200
      };

      //
      this.id = this.deviceMotion.watchAcceleration(option).subscribe((acc: DeviceMotionAccelerationData) =>
      {
        //assinging data from device sensors to local variables
        this.x = ""+ acc.x;
        this.y = ""+ acc.y;
        this.z = ""+ acc.z;
        this.timestamp ="" + acc.timestamp;
      });
    }
    //catch error if any
    catch (error) {
    alert("Error " + error);
  }
}

stop()
{

}


}

  

