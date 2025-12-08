import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDcyNly1fUDp5u9-cxayzUbOAN1LFHOT2M",
    authDomain: "ayursutra-8eea4.firebaseapp.com",
    databaseURL: "https://ayursutra-8eea4-default-rtdb.firebaseio.com",
    projectId: "ayursutra-8eea4",
    storageBucket: "ayursutra-8eea4.firebasestorage.app",
    messagingSenderId: "350738808548",
    appId: "1:350738808548:web:f5e24afbba024be5ba76f1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
