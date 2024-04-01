import { Injectable } from "@angular/core";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyA5V73Ng81RKVnlqT9HgSKxSNP0sC6_xVE",
    authDomain: "chat-4f6e8.firebaseapp.com",
    projectId: "chat-4f6e8",
    storageBucket: "chat-4f6e8.appspot.com",
    messagingSenderId: "146182554805",
    appId: "1:146182554805:web:cc4fd2d8cc0462154e2afc",
    measurementId: "G-6TRWM9RMX2"
  };
  
@Injectable({
    providedIn: 'root'
})
export class FirebaseService {

    constructor() { 
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
    }
    writeUserData() {
        const db = getDatabase();
        set(ref(db, 'users/' + "userId"), {
            username: "name",
            email: "email",
        });
    }
}