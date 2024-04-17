import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HEREService {
 
  private apiKey: string = '7qMxcTBNEwK_4WkK7lfrSF5McQoSwZxXiiTww0AQ2KQ';
  private baseUrl: string = 'https://routematching.hereapi.com/v8/match';

  constructor(private http: HttpClient) {}

  getSpeedLimits(waypoints: { latitude: number; longitude: number }[]): Observable<any> {
    const waypointParams = waypoints.map((wp, index) => `waypoint${index}=geo!${wp.latitude},${wp.longitude}`).join('&');
    const attributes = 'SPEED_LIMITS_FCn(*)';
    const mode = 'fastest;car';

    const url = `${this.baseUrl}/routelinks?apikey=${this.apiKey}&${waypointParams}&mode=${mode}&routeMatch=1&attributes=${attributes}`;
    return this.http.get(url);
  }

  // getSpeedLimit(): Observable<any> {
  //   const url = `https://routematching.hereapi.com/v8/match/routelinks?apikey=7qMxcTBNEwK_4WkK7lfrSF5McQoSwZxXiiTww0AQ2KQ&waypoint0=42.0272,-87.9623&waypoint1=42.0294,-87.9652&mode=fastest;car&routeMatch=1&attributes=SPEED_LIMITS_FCn(*)`;
  //   return this.http.get(url);
  // }
}