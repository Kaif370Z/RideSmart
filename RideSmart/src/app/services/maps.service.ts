import { Injectable, NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  constructor() { }
}
