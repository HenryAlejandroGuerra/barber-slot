/* =====================================================
    mobile/src/services/auth.service.ts
    Gestiona autenticación por correo y Google mediante Firebase Authentication.
===================================================== */
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { GoogleOneTapSignIn, isCancelledResponse, isNoSavedCredentialFoundResponse, isSuccessResponse } from "react-native-nitro-google-signin";
import { firebaseAuth } from "@/lib/firebase";

let googleConfigurado = false;

function configurarGoogle(): void {
    if (googleConfigurado) {
        return;
    }

    GoogleOneTapSignIn.configure({ webClientId: "autoDetect" });

    googleConfigurado = true;
}

async function registrar(correo: string, contra: string): Promise<User> {
    const credencial = await createUserWithEmailAndPassword(firebaseAuth, correo.trim(), contra);
    return credencial.user;
}

async function iniciarSesion(correo: string, contra: string): Promise<User> {
    const credencial = await signInWithEmailAndPassword(firebaseAuth, correo.trim(), contra);
    return credencial.user;
}

async function iniciarSesionConGoogle(): Promise<User | null> {
    configurarGoogle();

    await GoogleOneTapSignIn.checkPlayServices();

    let respuesta = await GoogleOneTapSignIn.signIn();

    if (isNoSavedCredentialFoundResponse(respuesta)) {
        respuesta = await GoogleOneTapSignIn.createAccount();
    }

    if (isNoSavedCredentialFoundResponse(respuesta)) {
        respuesta = await GoogleOneTapSignIn.presentExplicitSignIn();
    }

    if (isCancelledResponse(respuesta)) {
        return null;
    }

    if (!isSuccessResponse(respuesta)) {
        throw new Error("No fue posible iniciar sesión con Google.");
    }

    const idToken = respuesta.data.idToken;

    if (!idToken) {
        throw new Error("Google no devolvió un token de identidad.");
    }

    const credencialGoogle = GoogleAuthProvider.credential(idToken);
    const credencialFirebase = await signInWithCredential(firebaseAuth, credencialGoogle);

    return credencialFirebase.user;
}

async function cerrarSesion(): Promise<void> {
    await signOut(firebaseAuth);
}

function obtenerUsuarioActual(): User | null {
    return firebaseAuth.currentUser;
}

export const authService = {
    registrar,
    iniciarSesion,
    iniciarSesionConGoogle,
    cerrarSesion,
    obtenerUsuarioActual
};
