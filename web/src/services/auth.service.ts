/* ================================================
    web/src/services/auth.service.ts
    Servicio de autenticación
================================================ */
import type {Usuario, SesionUsuario} from "@/types/auth";
import {readStorage, writeStorage, removeStorage, STORAGE_KEYS} from "@/lib/storage";

async function iniciarSesion(correo: string, contra: string): Promise<SesionUsuario> {
    const usuarios = readStorage<Usuario[]>(STORAGE_KEYS.usuarios,[]);
    const correoNormalizado = correo.trim().toLowerCase();
    const usuario = usuarios.find(
            (item) =>
                item.correo.toLowerCase() === correoNormalizado && item.contra === contra && item.activo
        );

    if (!usuario) {
        throw new Error(
            "Correo o contraseña incorrectos"
        );
    }

    const sesion: SesionUsuario = {
        idUsuario: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        idBarbero: usuario.idBarbero,
    };

    writeStorage(STORAGE_KEYS.sesion, sesion);

    return sesion;
}


async function obtenerSesionActual(): Promise<SesionUsuario | null> {
    return readStorage<SesionUsuario | null>(STORAGE_KEYS.sesion, null);
}

async function cerrarSesion(): Promise<void> {
    removeStorage(STORAGE_KEYS.sesion);
}

export const authService = {iniciarSesion, obtenerSesionActual, cerrarSesion};
