import { Component, OnInit} from '@angular/core';
import { CrashDetectionService } from '../services/crash-detection.service';
import { Geolocation} from '@capacitor/geolocation';
import { Storage } from '@ionic/storage';
import { FirestoreService } from '../services/firestore.service';
import { User } from 'firebase/auth';
import { AuthService } from '../services/auth.service';

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



  constructor(private crashDetectionService: CrashDetectionService, private geolocation: Geolocation, private firestore: FirestoreService, private authService: AuthService) {}
  
  lastPosition: Position | null = null;
  movementThreshold = 10;
  currentHeading: number  = 0;
  kmh: number = 0;
  watchId: any | null = null;
  targetSpeed: number = 0;

  ms: any = '0' + 0;
  sec: any = '0' + 0;
  min: any = '0' + 0;
  startTimer: any;
  running = false;
  times: any[] = [];
  

  user: User | null = null;


  //when component is initialized, fetch user acceleration data based on user id
  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      if (user !== this.user) {
        this.user = user;
        if (this.user) {
          //load data if logged in
          this.loadUserAccelerationData();
        } else {
          //if no user, empty array
          this.times = []; 
        }
      }
    });
  }
  
  startTracking() {
    const watchOptions = {
      enableHighAccuracy: true,
      timeout: 500,
      maximumAge: 0
    };

    this.watchId = Geolocation.watchPosition(watchOptions, (position, err) => {
      if (position) {
        if (this.lastPosition) {
          //calculate the distance between the last and current position
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
        
        //start when movement is detected
        if (this.kmh > 0) {
          this.start();
        }

        //when the target speed is reached, stop the timer 
        //and clear the watch
        if (this.kmh >= this.targetSpeed) {
          this.stop();
          console.log('acceleration reached');
          Geolocation.clearWatch(this.watchId);
        }

   
       
        console.log(`Speed: ${this.kmh} km/h`, position.coords.latitude, position.coords.longitude);
      } else if (err) {
        console.error('Error watching position:', err);
      }
    }).then(watchId => {
      this.watchId = watchId;
    }).catch(error => {
      console.error('Error starting geolocation ', error);
    });
  }


  //implementation of timer. 10ms interval between increments
  start(){
    if(!this.running){
      this.running  = true;
      this.startTimer = setInterval(() => {
        this.ms++;
        this.ms = this.ms < 10 ? '0' + this.ms: this.ms;
        if(this.ms === 100){
          this.sec++;
          this.sec = this.sec < 10 ? '0' + this.sec : this.sec;
          this.ms= '0' + 0;
        }
        if(this.sec === 60){
          this.min++;
          this.min = this.min < 10 ? '0' + this.min : this.min;
          this.sec = '0' + 0;
        }
      },10);
    }
  }
  //stop the timer
  stop() {
    clearInterval(this.startTimer);
    this.running = false;
    this.saveToFirestore();
  }

  //reset the timer to 0
  reset(){
    clearInterval(this.startTimer);
    this.running = false;
    this.min = this.sec = this.ms = '0' + 0;

  }

  // save the acceleration data to firestore
  async saveToFirestore() {
    if (!this.user) {
      console.error("User is not logged in.");
      return;
    }  
    //creating new acceleration time entry containing speed and elapsed time
    const newTimeEntry = {
      targetSpeed: this.targetSpeed,
      timeElapsed: {
        minutes: this.min,
        seconds: this.sec,
        milliseconds: this.ms
      },
      timestamp: new Date().toISOString()
    };  
    //using firestore service
    await this.firestore.addAccelerationData(this.user.uid, newTimeEntry);
  }

  //loading the acceleration data from firestore database using firestore service
  loadUserAccelerationData() {
    if (!this.user) {
      console.error("no user logged in");
      return;
    }
    
    //load the data based on user id
    this.firestore.getAccelerationData(this.user.uid).subscribe(data => {
      this.times = data;
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
