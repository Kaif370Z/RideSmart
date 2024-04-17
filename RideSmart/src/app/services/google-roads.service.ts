import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleRoadsService {
  private apiKey = 'AIzaSyD5S-lEo0NJBfgm2Ikx48GmRkanwaDcBCE';
  private baseUrl = 'https://roads.googleapis.com';

  constructor(private http: HttpClient) {}

  getSpeedLimit(latitude: number, longitude: number): Observable<any> {
    const url = `${this.baseUrl}/v1/speedLimits?key=AIzaSyD5S-lEo0NJBfgm2Ikx48GmRkanwaDcBCE&path=${latitude},${longitude}`;
    return this.http.get(url);
  }
}
