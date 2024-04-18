import { Injectable } from '@angular/core';
import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/gyroscope/ngx';
import { DeviceMotion, DeviceMotionAccelerationData , DeviceMotionAccelerometerOptions} from '@ionic-native/device-motion/ngx';

@Injectable({
  providedIn: 'root'
})
export class SensorFusionService {
  //variable for holding the lean angle
  private angle: number = 0;

  constructor(private gyroscope: Gyroscope, private deviceMotion: DeviceMotion) {}

  //kalman filter
  private kalmanFilter(currentEstimate :number, newMeasurement:number, kFactor :number = 0.5) {
    return currentEstimate + kFactor * (newMeasurement - currentEstimate);
  }

  startSensors() {
    const gyroOptions: GyroscopeOptions = {
      //update every 100ms
      frequency: 100
    };

    const accelOptions: DeviceMotionAccelerometerOptions = {
      //update every 100ms
      frequency: 100
    }

    this.gyroscope.watch(gyroOptions).subscribe((orientation: GyroscopeOrientation) => {
      //angular velocity along the x axis in degrees per second
      const gyroAngleChange = orientation.y;
      //seconds corresponding to gyroscope options
      const deltaTime = 0.1; 
      //updating angle with gyroscope readings
      this.angle += gyroAngleChange * deltaTime;

      console.log(`angle from gyroscope: ${this.angle}`);
    });

    this.deviceMotion.watchAcceleration(accelOptions).subscribe((acc: DeviceMotionAccelerationData) => {
      //calculating the angle using acceloremeter readings
      const accelerometerAngle = Math.atan2(acc.x, Math.sqrt(acc.y * acc.y + acc.z * acc.z)) * (180 / Math.PI);
      //Math.atan2(ax, Math.sqrt(ay * ay + az * az));

      //fusing gyroscope and accelerometer angles by applying kalman filter
      this.angle = this.kalmanFilter(this.angle, accelerometerAngle);

      console.log(`angle after fusing: ${this.angle}`);
    });
  }

  //getting the lean angle
  getCurrentAngle() {
    return this.angle;
  }
}
