import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


//global location subject
export const locationUpdates = new Subject<{ latitude: number, longitude: number }>();


@Injectable({
  providedIn: 'root'
})


export class LocationService {

  constructor() { }

  

}
