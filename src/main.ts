import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

// Firebase imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDvMbZ0QcloLqFxbYR6e-19LDD4mVwSF8I",
  authDomain: "invideo-quiz.firebaseapp.com",
  projectId: "invideo-quiz",
  storageBucket: "invideo-quiz.firebasestorage.app",
  messagingSenderId: "1024384835385",
  appId: "1:1024384835385:web:084c2006114c9cc808d2e8"
};



// Bootstrapping the application
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore())
  ]
});
