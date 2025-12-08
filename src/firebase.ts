import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDcyNly1fUDp5u9-cxayzUbOAN1LFHOT2M",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ayursutra-8eea4.firebaseapp.com",
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://ayursutra-8eea4-default-rtdb.firebaseio.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ayursutra-8eea4",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ayursutra-8eea4.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "350738808548",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:350738808548:web:f5e24afbba024be5ba76f1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
