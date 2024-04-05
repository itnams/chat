import { Injectable } from "@angular/core";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, query, equalTo, get, child, Database } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { Chat, Messages, User } from "../models";

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
    getListUser(resp: (user: User[]) => void) {
        const db = getDatabase();
        const starCountRef = ref(db, 'users/');
        onValue(starCountRef, (snapshot) => {
            const data: User[] = Object.keys(snapshot.val()).map((key) => {
                return {
                    fullName: snapshot.val()[key].fullName,
                    password: snapshot.val()[key].password,
                    username: snapshot.val()[key].username,
                };
            });
            resp(data)
        });
    }
    register(user: User) {
        const db = getDatabase();
        const dbRef = ref(getDatabase());
        const idChat = this.generateRandomBase64UrlString()
        const chat: Messages = {
            id: idChat,
            body: 'hello',
            sender: user.username,
            time: this.getCurrentTime()
        }
        get(child(dbRef, `users`)).then((snapshot) => {
            if (snapshot.exists()) {
                const data: User = snapshot.child(user?.username ?? '').val();
                if (data) {
                    alert("Username existed")
                } else {
                    set(ref(db, 'users/' + user?.username), user);
                    set(ref(db, `users/${user?.username}/chat/${user?.username}/messages/${idChat}`), chat)
                    set(ref(db, `users/${user?.username}/chat/${user?.username}/fullNamePartner`), user.fullName)
                    set(ref(db, `users/${user?.username}/chat/${user?.username}/partner`), user.username)
                    alert("Register success")
                }
            } else {
                alert("Somthing went wrong")
            }
        }).catch((error) => {
            alert(error)
        });
    }

    login(username: string, password: string, success: (user: User) => void) {
        const dbRef = ref(getDatabase());
        get(child(dbRef, `users`)).then((snapshot) => {
            if (snapshot.exists()) {
                const user: User = snapshot.child(username).val();
                if (user) {
                    if (user.password == password) {
                        success(user)
                    } else {
                        alert("Please Check Passwod")
                    }
                } else {
                    alert('User not found with username:')
                }
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }
    generateRandomBase64UrlString(): string {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
        let randomString = '';
        for (let i = 0; i < 64; i++) {
            randomString += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return btoa(randomString).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    }
    getListChat(username: string, resp: (chat: Chat[]) => void) {
        const db = getDatabase();
        const starCountRef = ref(db, `users/${username}/chat`);
        onValue(starCountRef, (snapshot) => {
            const data: Chat[] = Object.keys(snapshot.val()).map((key) => {
                const messages: Messages[] = Object.keys(snapshot.val()[key].messages).map(i => snapshot.val()[key].messages[i])
                return {
                    fullNamePartner: snapshot.val()[key].fullNamePartner,
                    partner: snapshot.val()[key].partner,
                    messages: messages
                };
            });
            resp(data)
        });
    }
    getCurrentTime() {
        const date = new Date();
        const formattedDate = date.toISOString();
        return formattedDate;
    }

    sendMessages(from: string, to: string, fullNameForm: string, fullNameTo: string, body: string) {
        const db = getDatabase();
        const dbRef = ref(getDatabase());
        const idChat = this.generateRandomBase64UrlString()
        const chat: Messages = {
            id: idChat,
            body: body,
            sender: from,
            time: this.getCurrentTime()
        }
        get(child(dbRef, `users`)).then((snapshot) => {
            if (snapshot.exists()) {
                this.updateMessagesForFrom(db,fullNameTo,from,to,body,idChat)
                this.updateMessagesForTo(db,fullNameForm,from,to,body,idChat)
            } else {
                alert("Somthing went wrong")
            }
        }).catch((error) => {
            alert(error)
        });
    }
    updateMessagesForFrom(db: Database,fullNamePartner: string, from: string, to: string, body: string, idChat: String) {
        const chat: Messages = {
            id: String(idChat) ?? '',
            body: body,
            sender: from,
            time: this.getCurrentTime()
        }
        set(ref(db, `users/${from}/chat/${to}/fullNamePartner`), fullNamePartner)
        set(ref(db, `users/${from}/chat/${to}/partner`), to)
        set(ref(db, `users/${from}/chat/${to}/messages/${idChat}`), chat)
    }
    updateMessagesForTo(db: Database,fullNamePartner: string, from: string, to: string, body: string, idChat: String) {
        const chat: Messages = {
            id: String(idChat) ?? '',
            body: body,
            sender: from,
            time: this.getCurrentTime()
        }
        set(ref(db, `users/${to}/chat/${from}/fullNamePartner`), fullNamePartner)
        set(ref(db, `users/${to}/chat/${from}/partner`), from)
        set(ref(db, `users/${to}/chat/${from}/messages/${idChat}`), chat)
    }
}