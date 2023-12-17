import { Component, ElementRef, ViewChild } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation/ngx'; // Added this line
import { Storage } from '@ionic/storage'; // Added this line

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
  trackedRoute = [];
  previousRoutes = [];

  positionSubscription!: Subscription;

  constructor(public navCtrl: NavController, private plt: Platform, private geolocation: Geolocation,
   private storage: Storage, private alertCtrl: AlertController ) {

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
      this.previousRoutes = data;
    }
  });
}
}