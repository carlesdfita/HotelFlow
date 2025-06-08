
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, 
};

if (!firebaseConfig.apiKey) {
  throw new Error(
    'Firebase API Key is missing. Please ensure NEXT_PUBLIC_FIREBASE_API_KEY is set in your environment variables.'
  );
}

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db, { cacheSizeBytes: CACHE_SIZE_UNLIMITED })
    .then(() => {
      console.log("Persistència de Firestore (IndexedDB) activada correctament.");
    })
    .catch((err: any) => {
      if (err.code == 'failed-precondition') {
        console.warn("Error en activar la persistència de Firestore (failed-precondition): Probablement múltiples pestanyes obertes. La persistència només es pot activar en una pestanya.");
      } else if (err.code == 'unimplemented') {
        console.warn("Error en activar la persistència de Firestore (unimplemented): El navegador no suporta les característiques necessàries per a la persistència offline (possiblement mode privat o navegador antic).");
      } else {
        console.error("Error desconegut en activar la persistència de Firestore:", err);
      }
    });
}

export { app, auth, db };

