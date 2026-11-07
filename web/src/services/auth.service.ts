/* =====================================================
    web/src/services/auth.service.ts
    Servicio encargado de autenticación y gestión de sesión contra la API REST de BarberSlot.
===================================================== */
import type { RespuestaLogin, SesionUsuario, Usuario } from "@/types/auth";
import { ApiError, apiFetch } from "@/lib/apiFetch";
import { eliminarToken, guardarToken, obtenerToken } from "@/lib/session";

async function iniciarSesion(correo: string, contra: string): Promise<SesionUsuario> {
    const respuesta = await apiFetch<RespuestaLogin>("/api/auth/login",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({correo, contra})
        }
    );
    guardarToken(respuesta.token);

    return respuesta.sesion;
}

async function obtenerSesionActual(): Promise<SesionUsuario | null> {
    if (!obtenerToken()) {
        return null;
    }

    try {
        return await apiFetch<SesionUsuario>("/api/auth/sesion");
    } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
            eliminarToken();
            return null;
        }

        throw error;
    }
}

async function cerrarSesion(): Promise<void> {
    try {
        if (obtenerToken()) {
            await apiFetch<void>("/api/auth/logout", { method: "POST" });
        }
    } finally {
        eliminarToken();
    }
}

async function registrarUsuario(datos: {
    nombre: string;
    correo: string;
    contra: string;
    rol: Usuario["rol"];
    idBarbero?: string;
}): Promise<void> {
    await apiFetch("/api/auth/registro",
    {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nombre: datos.nombre,
            correo: datos.correo,
            contra: datos.contra,
            rol: datos.rol,
            barberoId: datos.idBarbero
        })
    });
}

export const authService = {
    iniciarSesion,
    obtenerSesionActual,
    cerrarSesion,
    registrarUsuario
};
