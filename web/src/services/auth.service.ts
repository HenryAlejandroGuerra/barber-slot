/* ================================================
    web/src/services/auth.service.ts
    Servicio de autenticación
================================================ */
import type { Usuario, SesionUsuario } from "@/types/auth";
import { apiFetch } from "@/lib/apiFetch";

async function iniciarSesion(correo: string, contra: string): Promise<SesionUsuario> {
    return apiFetch<SesionUsuario>("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contra }),
    });
}

async function obtenerSesionActual(): Promise<SesionUsuario | null> {
    return apiFetch<SesionUsuario | null>("/api/auth/sesion");
}

async function cerrarSesion(): Promise<void> {
    await apiFetch("/api/auth/logout", { method: "POST" });
}

async function registrarUsuario(datos: {
    nombre: string;
    correo: string;
    contra: string;
    rol: Usuario["rol"];
    idBarbero?: string;
}): Promise<void> {
    await apiFetch("/api/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nombre: datos.nombre,
            correo: datos.correo,
            contra: datos.contra,
            rol: datos.rol,
            barberoId: datos.idBarbero,
        }),
    });
}

export const authService = {
    iniciarSesion,
    obtenerSesionActual,
    cerrarSesion,
    registrarUsuario,
};
