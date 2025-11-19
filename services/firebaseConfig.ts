
import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// KONFIGURASI FIREBASE
// Silakan ganti nilai di bawah ini dengan konfigurasi dari Firebase Console Anda.
// Caranya: Buka Console -> Project Settings -> General -> Scroll ke bawah ke "Your apps" -> Config
const firebaseConfig = {
  apiKey: "MASUKKAN_API_KEY_ANDA_DISINI",
  authDomain: "project-id-anda.firebaseapp.com",
  projectId: "project-id-anda",
  storageBucket: "project-id-anda.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
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
