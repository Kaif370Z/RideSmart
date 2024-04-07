import { Component } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { CrashDetectionService } from '../services/crash-detection.service';

@Component({
  selector: 'app-accelerationTab',
  templateUrl: 'accelerationTab.page.html',
  styleUrls: ['accelerationTab.page.scss']
})
export class accelerationTabPage {

  constructor(private crashDetectionService: CrashDetectionService) {}

  

  startMonitoringCrash() {
    this.crashDetectionService.startMonitoring();
  }
}
