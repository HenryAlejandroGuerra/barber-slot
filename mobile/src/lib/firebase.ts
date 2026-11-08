/* =====================================================
    mobile/src/lib/firebase.ts
    Inicializa Firebase Authentication con persistencia local y Firestore para BarberSlot Mobile.
===================================================== */
import { getApp, getApps, initializeApp } from "firebase/app";
import * as FirebaseAuth from "firebase/auth";
import type { Auth, Persistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

/* La función existe en el bundle React Native de Firebase, aunque TypeScript puede resolver los tipos del bundle web y no mostrarla como exportación. */
const getReactNativePersistence = (FirebaseAuth as typeof FirebaseAuth & {
    getReactNativePersistence: (storage: typeof AsyncStorage) => Persistence;
}).getReactNativePersistence;

let auth: Auth;

try {
    auth = FirebaseAuth.initializeAuth(firebaseApp,
        {
            persistence: getReactNativePersistence(AsyncStorage)
        }
    );
} catch {
    auth = FirebaseAuth.getAuth(firebaseApp);
}

export const firebaseAuth = auth;
export const firestore = getFirestore(firebaseApp);
