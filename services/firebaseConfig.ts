
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// KONFIGURASI FIREBASE
// Silakan ganti nilai di bawah ini dengan konfigurasi dari Firebase Console Anda.
// Caranya: Buka Console -> Project Settings -> General -> Scroll ke bawah ke "Your apps" -> Config
const firebaseConfig = {
  apiKey: "AIzaSyBPJzAJEqBGm0v5ws0pdpE5RQWH5dcsPV8",
  authDomain: "bigalow23-5f4ca.firebaseapp.com",
  projectId: "bigalow23-5f4ca",
  storageBucket: "bigalow23-5f4ca.firebasestorage.app",
  messagingSenderId: "333077749116",
  appId: "1:333077749116:web:5793fb7689a937016b58f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
