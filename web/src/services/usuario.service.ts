/* =====================================================
    web/src/services/usuario.service.ts
    Consulta los perfiles y roles de los usuarios almacenados en Cloud Firestore.
===================================================== */
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import type { SesionUsuario } from "@/types/auth";

export type RolUsuario = | "administrador" | "barbero" | "cliente";

export interface PerfilUsuario {
    uid: string;
    nombre: string;
    correo: string;
    rol: RolUsuario;
    barberoId?: string;
}

async function obtenerPerfil(uid: string): Promise<PerfilUsuario | null> {
    const referencia = doc(firestore, "usuarios", uid);
    const snapshot = await getDoc(referencia);

    if (!snapshot.exists()) {
        return null;
    }

    return snapshot.data() as PerfilUsuario;
}

function convertirASesion(perfil: PerfilUsuario): SesionUsuario {
    return {
        idUsuario: perfil.uid,
        nombre: perfil.nombre,
        correo: perfil.correo,
        rol: perfil.rol as | "administrador" | "barbero",
        idBarbero: perfil.barberoId
    };
}

export const usuarioService = {
    obtenerPerfil,
    convertirASesion
};
