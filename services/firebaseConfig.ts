
import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

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

let app;
let auth: Auth | undefined;
let db: Firestore | undefined;

// Mencegah crash jika config masih default
const isPlaceholderConfig = firebaseConfig.apiKey === "MASUKKAN_API_KEY_ANDA_DISINI";

if (!isPlaceholderConfig) {
  try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    // Initialize Services
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("Gagal menginisialisasi Firebase. Cek konfigurasi Anda.", error);
  }
} else {
  console.warn("Aplikasi berjalan tanpa koneksi Firebase karena konfigurasi masih default.");
}

export { auth, db };
