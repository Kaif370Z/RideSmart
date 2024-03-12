import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registration-modal',
  templateUrl: './registration-modal.page.html',
  styleUrls: ['./registration-modal.page.scss'],
})
export class RegistrationModalPage implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
