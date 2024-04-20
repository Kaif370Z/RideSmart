import { Component, ElementRef, ViewChild } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';
import { Storage } from '@ionic/storage-angular';
import { doc, setDoc } from 'firebase/firestore';
import { FirestoreService } from '../services/firestore.service';
import { AuthService } from '../services/auth.service';
import { User } from 'firebase/auth';
import { TrackingService } from '../services/tracking.service';

declare var google: {
  maps: {
    MapTypeId: { ROADMAP: any; };
    Map: new (arg0: any, arg1: { zoom: number; mapTypeId: any; mapTypeControl: boolean; streetViewControl: boolean; fullscreenControl: boolean; }) => any;
    LatLng: new (arg0: number, arg1: number) => any;
    Polyline: new (arg0: { path: any[]; geodesic: boolean; strokeColor: string; strokeOpacity: number; strokeWeight: number; }) => any;
  };
};


//declare var google: { maps: { MapTypeId: { ROADMAP: any; }; Map: new (arg0: any, arg1: { zoom: number; mapTypeId: any; mapTypeControl: boolean; streetViewControl: boolean; fullscreenControl: boolean; }) => any; LatLng: new (arg0: number, arg1: number) => any; }; Polyline: new (arg0: { path: any[]; geodesic: boolean; strokeColor: string; strokeOpacity: number; strokeWeight: number; }) => any; };

@Component({
  selector: 'app-maintenanceTab',
  templateUrl: 'maintenanceTab.page.html',
  styleUrls: ['maintenanceTab.page.scss']
})

export class maintenanceTabPage {

  user: User | null = null;
  routes: any[] = [];

  @ViewChild('mapElement') mapElement!: ElementRef;
  map: any;
  currentMapTrack: any = null;
  watchId: string | null = null;
  kmh: number = 0;

  isTracking = false;
  trackedRoute: Array<{ lat: number; lng: number; }> = [];
  previousTracks: Array<{ finished: Date; path: Array<{ lat: number; lng: number; }> }> = [];
  route: { finished: Date; path: Array<{ lat: number; lng: number; }> } = { finished: new Date(), path: [] };

  positionSubscription!: Subscription;

  constructor(public navCtrl: NavController, 

    private plt: Platform, 
    private geolocation: Geolocation,
    private storage: Storage,
    private firestoreService: FirestoreService,
    private authService: AuthService, 
    private alertCtrl: AlertController,
    private trackingService: TrackingService ) {
      this.storage.create();
    }

    ngOnInit() {
      this.authService.currentUser.subscribe(user => {
        this.user = user;
        if (this.user) {
          this.loadUserRoutes();
        }
      });
    }
   

  async ngAfterViewInit() {
    this.plt.ready().then(async () => {
     this.loadHistoricRoutes();
      let mapOptions = {
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      try {
        const pos = await Geolocation.getCurrentPosition();
        let latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        this.map.setCenter(latLng);
        this.map.setZoom(16);
      } catch (error) {
        console.log('Error getting location', error);
      }
    });
    
  }
  

loadHistoricRoutes() {
  this.storage.get('routes').then(data => {
    if(data) {
      this.previousTracks = data;
    }
  });
}

showHistoryRoute(path: Array<{ lat: number; lng: number; }>) {
  this.redrawPath(path);
}

startTracking() {
  this.isTracking = true;
  this.trackedRoute = [];

  const watchOptions = {
    enableHighAccuracy: true,
    timeout: 0,
    maximumAge: 0
  };

  //https://github.com/ionic-team/capacitor-plugins/issues/538

  // Correctly handle the promise to extract the watch ID string
  Geolocation.watchPosition(watchOptions, (position, err) => {
    if (position) {
      const speedInMetersPerSecond = position.coords.speed ?? 0;
      this.kmh = speedInMetersPerSecond * 3.6;
      this.trackedRoute.push({ lat: position.coords.latitude, lng: position.coords.longitude });
      this.saveRoute();
      //this.trackedRoute.push({ lat: position.coords.latitude, lng: position.coords.longitude });
      this.redrawPath(this.trackedRoute);
    console.log(position.coords.latitude, position.coords.longitude);
    } else if (err) {
      console.error('Error watching position:', err);
    }

  }).then(watchId => {
    this.watchId = watchId;
  }).catch(error => {
    console.error('Error starting geolocation watch:', error);
  });
}

async saveRoute() {
  await this.storage.set('trackedRoute', this.trackedRoute);
  
}

async getSavedRoute() {
  return await this.storage.get('trackedRoute');
}

redrawPath(path: { lat: number; lng: number; }[]) {
  // Implementation of redrawPath method
  if (this.currentMapTrack) {
    this.currentMapTrack.setMap(null);
  }

  if (path.length > 1) {
    this.currentMapTrack = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#ff00ff',
      strokeOpacity: 1.0,
      strokeWeight: 3
    });
    this.currentMapTrack.setMap(this.map);
  }

  }

  stopTracking() {

    if (this.watchId !== null) {
      Geolocation.clearWatch({ id: this.watchId });
      this.isTracking = false;
      this.watchId = null;
      console.log("Stopped tracking");
    }
    
    let newRoute = { finished: new Date(), path: this.trackedRoute };
    this.previousTracks.push(newRoute);
    this.storage.set('routes', this.previousTracks);

    if (this.user) {
      this.firestoreService.addRouteData(this.user.uid, newRoute)
        .then(() => console.log("Route saved to Firestore"))
        .catch(error => console.error("Error saving route to Firestore:", error));
    }

    this.isTracking = false;
    this.positionSubscription.unsubscribe();
    this.currentMapTrack.setMap(null);
    this.loadUserRoutes();
}

loadUserRoutes() {
  if (!this.user) return;
  this.firestoreService.getRoutes(this.user.uid).subscribe(
    routes => {
      this.routes = routes;
      console.log(this.routes);
    },
    error => {
      console.error("Error loading routes:", error);
      // You could also display an alert or a toast to inform the user of the error.
    }
  );
}

staertTracking() {
  this.trackingService.startTracking();
}


  

}