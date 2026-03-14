import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDvMbZ0QcloLqFxbYR6e-19LDD4mVwSF8I",
  authDomain: "invideo-quiz.firebaseapp.com",
  projectId: "invideo-quiz",
  storageBucket: "invideo-quiz.firebasestorage.app",
  messagingSenderId: "1024384835385",
  appId: "1:1024384835385:web:084c2006114c9cc808d2e8"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),  // ✅ Added
    provideFirestore(() => getFirestore()),                    // ✅ Added
  ]
};