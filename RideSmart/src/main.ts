import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));


  const firebaseConfig = {
    apiKey: "AIzaSyC1MaVIpVs6ZDoOz3S2MkVLyQXq_ohJjfI",
    authDomain: "ridesmart-c1c47.firebaseapp.com",
    projectId: "ridesmart-c1c47",
    storageBucket: "ridesmart-c1c47.appspot.com",
    messagingSenderId: "846515714466",
    appId: "1:846515714466:web:65810e53af9190a6339afb",
    measurementId: "G-3GQN4LN4ZZ"
  };

  const app = initializeApp(firebaseConfig);
  export const analytics = getAnalytics(app);