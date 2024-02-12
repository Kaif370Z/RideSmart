import { Component, ElementRef, ViewChild } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation/ngx'; // Added this line
import { Storage } from '@ionic/storage'; // Added this line
import { Geoposition, PositionError } from '@ionic-native/geolocation/ngx'; // Added this line
import { Coordinates } from '@ionic-native/geolocation/ngx'; // Added this line

declare var google: { maps: { MapTypeId: { ROADMAP: any; }; Map: new (arg0: any, arg1: { zoom: number; mapTypeId: any; mapTypeControl: boolean; streetViewControl: boolean; fullscreenControl: boolean; }) => any; LatLng: new (arg0: number, arg1: number) => any; }; };

@Component({
  selector: 'app-maintenanceTab',
  templateUrl: 'maintenanceTab.page.html',
  styleUrls: ['maintenanceTab.page.scss']
})
export class maintenanceTabPage {
  @ViewChild('map') mapElement: ElementRef | undefined;
  map: any;
  currentMapTrack = null;

  isTracking = false;
  trackedRoute: Array<{ lat: number; lng: number; }> = [];
  previousTracks: Array<{ finished: Date; path: Array<{ lat: number; lng: number; }> }> = [];
  route: { finished: Date; path: Array<{ lat: number; lng: number; }> } = { finished: new Date(), path: [] };

  positionSubscription!: Subscription;

  constructor(public navCtrl: NavController, private plt: Platform, private geolocation: Geolocation,
   private storage: Storage, private alertCtrl: AlertController ) {

   }

   getCurrentLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

   ionViewDidLoad() {
     this.plt.ready().then(() => {
       this.loadHistoricRoutes();

       let mapOptions = {
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        };

        if (this.mapElement) {
          this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
          
          this.geolocation.getCurrentPosition().then(pos => {
            let latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            this.map.setCenter(latLng);
            this.map.setZoom(16);
          }).catch((error: any) => {
            console.log('Error getting location', error);
          });
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

  this.positionSubscription = this.geolocation.watchPosition()
  .subscribe((data: Geoposition | PositionError) => {
    setTimeout(() => {
      if ('coords' in data && 'latitude' in data.coords && 'longitude' in data.coords) {
        const coords = data.coords as Coordinates; // Explicitly cast data.coords as Coordinates
        this.trackedRoute.push({ lat: coords.latitude, lng: coords.longitude });
        this.redrawPath(this.trackedRoute);
      }
    }, 0);
  });
}

redrawPath(route: { lat: number; lng: number; }[]) {
  // Implementation of redrawPath method
  }

  stopTracking() {
    this.isTracking = false;
    this.positionSubscription.unsubscribe();
  }
}