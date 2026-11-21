/* =====================================================
    web/src/services/firebaseAuth.service.ts
    Gestiona la autenticación web mediante Firebase Authentication.
===================================================== */
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";

async function iniciarSesionCorreo(correo: string, contra: string): Promise<User> {
    const credencial = await signInWithEmailAndPassword(firebaseAuth, correo.trim(), contra);
    return credencial.user;
}

async function cerrarSesion(): Promise<void> {
    await signOut(firebaseAuth);
}

function observarSesion(callback: (usuario: User | null) => void) {
    return onAuthStateChanged(firebaseAuth, callback);
}

export const firebaseAuthService = {
    iniciarSesionCorreo,
    cerrarSesion,
    observarSesion
};
