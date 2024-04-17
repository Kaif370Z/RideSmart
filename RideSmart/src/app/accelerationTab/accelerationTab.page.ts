import { Component, OnInit} from '@angular/core';
import { CrashDetectionService } from '../services/crash-detection.service';


@Component({
  selector: 'app-accelerationTab',
  templateUrl: 'accelerationTab.page.html',
  styleUrls: ['accelerationTab.page.scss']
})
export class accelerationTabPage {



  constructor(private crashDetectionService: CrashDetectionService) {}
  



  startMonitoringCrash() {
    this.crashDetectionService.presentCrashModal();
  }
}
