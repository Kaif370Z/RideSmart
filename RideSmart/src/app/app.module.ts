import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, provideFirebaseApp(() => initializeApp({"projectId":"ridesmart-c1c47","appId":"1:846515714466:web:65810e53af9190a6339afb","storageBucket":"ridesmart-c1c47.appspot.com","apiKey":"AIzaSyC1MaVIpVs6ZDoOz3S2MkVLyQXq_ohJjfI","authDomain":"ridesmart-c1c47.firebaseapp.com","messagingSenderId":"846515714466","measurementId":"G-3GQN4LN4ZZ"})), provideFirestore(() => getFirestore())],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
