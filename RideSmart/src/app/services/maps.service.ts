<<<<<<< HEAD
import { Injectable, NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
=======
import { Injectable } from '@angular/core';
>>>>>>> e6eaaacf0c33e70e90187ec9974b8d57fbacfae9

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  constructor() { }
}
