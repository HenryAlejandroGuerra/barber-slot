/* =====================================================
    mobile/src/services/auth.service.ts
    Gestiona el registro, inicio y cierre de sesión mediante Firebase Authentication.
===================================================== */
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";

async function registrar(correo: string, contra: string): Promise<User> {
    const credencial = await createUserWithEmailAndPassword(
        firebaseAuth,
        correo.trim(),
        contra
    );

    return credencial.user;
}

async function iniciarSesion(correo: string, contra: string): Promise<User> {
    const credencial = await signInWithEmailAndPassword(
        firebaseAuth,
        correo.trim(),
        contra
    );

    return credencial.user;
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
    cerrarSesion,
    obtenerUsuarioActual
};
