/* =====================================================
    web/src/services/firebaseAuth.service.ts
    Gestiona la autenticación web mediante Firebase con correo, Google y cierre de sesión.
===================================================== */
import { GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, type User } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";

async function iniciarSesionCorreo(correo: string, contra: string): Promise<User> {
    const credencial = await signInWithEmailAndPassword(firebaseAuth, correo.trim(), contra);
    return credencial.user;
}

async function iniciarSesionGoogle(): Promise<User> {
    const proveedor = new GoogleAuthProvider();
    proveedor.setCustomParameters({prompt: "select_account"});
    const credencial = await signInWithPopup(firebaseAuth, proveedor);
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
    iniciarSesionGoogle,
    cerrarSesion,
    observarSesion
};
