import { Injectable } from "@angular/core";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, query, equalTo, get, child } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { User } from "../models";

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
    getItems() {
        const db = getDatabase();
        const starCountRef = ref(db, 'user');
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            console.log(data)
        });
    }
    writeUserData() {
        const db = getDatabase();
        set(ref(db, 'users/' + "userId"), {
            username: "name",
            email: "email",
        });
    }
    register(user: User){
        const db = getDatabase();
        const dbRef = ref(getDatabase());
        get(child(dbRef, `users`)).then((snapshot) => {
            if (snapshot.exists()) {
                const data: User = snapshot.child(user?.username ?? '').val();
                if (data) {
                    alert("Username existed")
                } else {
                    set(ref(db, 'users/' + user?.username), user);
                    alert("Register success")
                }
            } else {
                alert("Somthing went wrong")
            }
        }).catch((error) => {
            alert(error)
        });
    }
    checkUsername(username: string, password: string) {
        const dbRef = ref(getDatabase());
        get(child(dbRef, `users`)).then((snapshot) => {
            if (snapshot.exists()) {
                const user: User = snapshot.child(username).val();
                if (user) {
                    if (user.password == password) {
                        console.log("User found:", user.fullName);
                    } else {
                        console.log("Please Check Passwod");
                    }
                } else {
                    console.log("User not found with username:", username);
                }
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }

}