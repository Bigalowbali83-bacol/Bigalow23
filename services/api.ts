
import { 
    collection, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    where, 
    writeBatch,
    getDoc,
    setDoc
} from 'firebase/firestore';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut 
} from 'firebase/auth';
import { db, auth } from './firebaseConfig';

// Helper untuk memastikan Firebase siap
const checkConfig = () => {
    if (!db || !auth) {
        throw new Error("Koneksi Database Error: Konfigurasi Firebase belum diatur dengan benar di 'services/firebaseConfig.ts'.");
    }
};

// --- API Functions ---

export const api = {
    
    // --- AUTHENTICATION ---
    
    login: async (email: string, password: string) => {
        checkConfig();
        try {
            // 1. Login ke Firebase Auth
            // @ts-ignore: Auth checked in checkConfig
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // 2. Ambil data role dari Firestore (koleksi 'users')
            // Kita asumsikan dokumen user disimpan dengan ID = UID user
            // @ts-ignore: db checked in checkConfig
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDocSnap = await getDoc(userDocRef);

            let role = 'user';
            if (userDocSnap.exists()) {
                role = userDocSnap.data().role || 'user';
            }

            // 3. Kembalikan objek User sesuai format aplikasi
            return {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                password: '***', // Jangan simpan password asli di state
                role: role
            };
        } catch (error: any) {
            console.error("Login Error:", error);
            throw new Error(getFriendlyErrorMessage(error.code));
        }
    },

    register: async (email: string, password: string) => {
        checkConfig();
        try {
            // 1. Buat user di Firebase Auth
            // @ts-ignore: Auth checked in checkConfig
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;
            const role = email === 'admin@bacol.dev' ? 'admin' : 'user';

            // 2. Simpan detail user ke Firestore
            // @ts-ignore: db checked in checkConfig
            await setDoc(doc(db, 'users', firebaseUser.uid), {
                email: email,
                role: role,
                createdAt: new Date().toISOString()
            });

            return {
                id: firebaseUser.uid,
                email: email,
                password: '***',
                role: role
            };
        } catch (error: any) {
            console.error("Register Error:", error);
            throw new Error(getFriendlyErrorMessage(error.code));
        }
    },

    logout: async () => {
        if (auth) {
            await signOut(auth);
        }
    },

    // --- DATA CRUD (FIRESTORE) ---

    fetchCollection: async (collectionName: string, userId: string) => {
        checkConfig();
        try {
            // Query data hanya milik user yang sedang login
            // @ts-ignore: db checked in checkConfig
            const q = query(collection(db, collectionName), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);
            
            // Map dokumen Firestore ke array object biasa
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error(`Error fetching ${collectionName}:`, error);
            throw new Error(`Gagal mengambil data ${collectionName}`);
        }
    },

    createItem: async (collectionName: string, item: any) => {
        checkConfig();
        try {
            const { id, ...dataToSave } = item;
            
            if (id) {
                // @ts-ignore: db checked in checkConfig
                await setDoc(doc(db, collectionName, id), dataToSave);
                return { id, ...dataToSave };
            } else {
                // @ts-ignore: db checked in checkConfig
                const docRef = await addDoc(collection(db, collectionName), dataToSave);
                await updateDoc(docRef, { id: docRef.id });
                return { id: docRef.id, ...dataToSave };
            }
        } catch (error) {
            console.error(`Error creating item in ${collectionName}:`, error);
            throw error;
        }
    },

    updateItem: async (collectionName: string, item: any) => {
        checkConfig();
        try {
            if (!item.id) throw new Error("ID diperlukan untuk update");
            // @ts-ignore: db checked in checkConfig
            const docRef = doc(db, collectionName, item.id);
            await updateDoc(docRef, item);
            return item;
        } catch (error) {
            console.error(`Error updating item in ${collectionName}:`, error);
            throw error;
        }
    },

    deleteItem: async (collectionName: string, id: string) => {
        checkConfig();
        try {
            // @ts-ignore: db checked in checkConfig
            await deleteDoc(doc(db, collectionName, id));
            return id;
        } catch (error) {
            console.error(`Error deleting item in ${collectionName}:`, error);
            throw error;
        }
    },
    
    hardReset: async (userId: string) => {
        checkConfig();
        try {
            const collections = ["bku", "bkp", "peminjam", "setoran", "manual_payments", "reconciliation"];
            // @ts-ignore: db checked in checkConfig
            const batch = writeBatch(db);
            let operationCount = 0;

            for (const colName of collections) {
                // @ts-ignore: db checked in checkConfig
                const q = query(collection(db, colName), where("userId", "==", userId));
                const snapshot = await getDocs(q);
                
                snapshot.docs.forEach((doc) => {
                    batch.delete(doc.ref);
                    operationCount++;
                });
            }

            if (operationCount > 0) {
                await batch.commit();
            }
        } catch (error) {
             console.error("Error performing hard reset:", error);
             throw error;
        }
    }
};

// Helper untuk pesan error Firebase yang user-friendly
const getFriendlyErrorMessage = (errorCode: string) => {
    if (!db || !auth) return "Konfigurasi Database belum diset.";
    switch (errorCode) {
        case 'auth/invalid-credential':
            return "Email atau kata sandi salah.";
        case 'auth/user-not-found':
            return "Akun tidak ditemukan.";
        case 'auth/wrong-password':
            return "Kata sandi salah.";
        case 'auth/email-already-in-use':
            return "Email sudah terdaftar. Silakan login.";
        case 'auth/weak-password':
            return "Kata sandi terlalu lemah (min. 6 karakter).";
        case 'auth/invalid-email':
            return "Format email tidak valid.";
        default:
            return "Terjadi kesalahan pada sistem (" + errorCode + ")";
    }
};
