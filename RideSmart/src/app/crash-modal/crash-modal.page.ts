import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-crash-modal',
  templateUrl: './crash-modal.page.html',
  styleUrls: ['./crash-modal.page.scss'],
})
export class CrashModalPage implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  dismissModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
