import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export const locationUpdates = new Subject<{ latitude: number, longitude: number }>();


@Injectable({
  providedIn: 'root'
})


export class LocationService {

  constructor() { }

  

}
