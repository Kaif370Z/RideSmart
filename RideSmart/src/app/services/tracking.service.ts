import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { FirestoreService } from './firestore.service';
import { AuthService } from './auth.service';
import { User } from 'firebase/auth';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private isTrackingSubject = new BehaviorSubject<boolean>(false);
  public isTracking$: Observable<boolean> = this.isTrackingSubject.asObservable();

  private trackedRoute: Array<{ lat: number; lng: number; }> = [];
  private watchId: string | null = null;
  user: User | null = null;

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService
  ) {
    // Subscribe to user changes
    this.authService.currentUser.subscribe(user => {
      this.user = user;
    });
  }

  startTracking(): void {
    const watchOptions = {
      enableHighAccuracy: true,
      timeout: 0,
      maximumAge: 0
    };
  
    // The watchPosition function returns a promise that resolves with a string (the watch ID)
    Geolocation.watchPosition(watchOptions, (position, err) => {
      if (position) {
        this.trackedRoute.push({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        // If the user is set, save the route periodically or based on certain conditions
        if (this.user) {
          this.saveRoute();
        }
      } else if (err) {
        console.error('Tracking error: ', err);
      }
    }).then(watchId => {
      // Now we set the watchId from the resolved promise
      this.watchId = watchId;
    }).catch(error => {
      console.error('Error starting geolocation watch:', error);
    });
  
    this.isTrackingSubject.next(true);
  }
  

  stopTracking(): void {
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
    }
    this.isTrackingSubject.next(false);
    // Here you would also handle the logic for persisting the route to Firestore
    if (this.user) {
      const newRoute = { finished: new Date(), path: this.trackedRoute };
      this.firestoreService.addRouteData(this.user.uid, newRoute)
        .then(() => console.log('Route data added to Firestore'))
        .catch(err => console.error('Error adding route data to Firestore', err));
    }
    // Reset the tracked route
    this.trackedRoute = [];
  }

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

  saveRoute(): Promise<void> {
    if (!this.user) return Promise.resolve();
    const newRoute = { finished: new Date(), path: this.trackedRoute };
    return this.firestoreService.addRouteData(this.user.uid, newRoute);
  }

  getSavedRoute(): Promise<any> {
    if (!this.user) return Promise.resolve();
    return this.firestoreService.getRoutes(this.user.uid).toPromise();
  }
}