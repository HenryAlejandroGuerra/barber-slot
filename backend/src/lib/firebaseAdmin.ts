/* =====================================================
    backend/src/lib/firebaseAdmin.ts
    Inicializa Firebase Admin para verificar usuarios autenticados y acceder a Firestore desde el backend.
===================================================== */
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function obtenerVariable(nombre: string): string {
    const valor = process.env[nombre];

    if (!valor) {
        throw new Error(`${nombre} no está configurada.`);
    }

    return valor;
}

function obtenerFirebaseAdminApp(): App {
    const appExistente = getApps()[0];

    if (appExistente) {
        return appExistente;
    }

    const projectId = obtenerVariable("FIREBASE_PROJECT_ID");
    const clientEmail = obtenerVariable("FIREBASE_CLIENT_EMAIL");
    const privateKey = obtenerVariable("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n");

    return initializeApp({
        credential: cert({
            projectId,
            clientEmail,
            privateKey
        })
    });
}

export function obtenerFirebaseAuthAdmin() {
    return getAuth(obtenerFirebaseAdminApp());
}

export function obtenerFirestoreAdmin() {
    return getFirestore(obtenerFirebaseAdminApp());
}
