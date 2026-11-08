/* =====================================================
    mobile/src/services/usuario.service.ts
    Gestiona el perfil del usuario autenticado almacenado en Cloud Firestore.
===================================================== */
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { firestore } from "@/lib/firebase";

export type RolUsuario = | "administrador" | "barbero" | "cliente";

export interface PerfilUsuario {
    uid: string;
    nombre: string;
    correo: string;
    rol: RolUsuario;
}

async function guardarPerfil(usuario: User, nombre: string, rol: RolUsuario): Promise<void> {
    const referencia = doc(firestore, "usuarios", usuario.uid);

    await setDoc(referencia,
        {
            uid: usuario.uid,
            nombre,
            correo: usuario.email ?? "",
            rol,
            fechaCreacion: serverTimestamp()
        },
        {
            merge: true
        }
    );
}

async function obtenerPerfil(uid: string): Promise<PerfilUsuario | null> {
    const referencia = doc(firestore, "usuarios", uid);
    const snapshot = await getDoc(referencia);

    if (!snapshot.exists()) {
        return null;
    }

    return snapshot.data() as PerfilUsuario;
}

export const usuarioService = {
    guardarPerfil,
    obtenerPerfil
};
