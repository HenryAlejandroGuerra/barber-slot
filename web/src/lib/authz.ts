/* ===========================================
    web/src/lib/authz.ts
    Verificación de sesión y rol para rutas de API
=========================================== */
import { NextResponse } from "next/server";
import { obtenerSesion, type PayloadSesion } from "@/lib/session";

type ResultadoAuth = { sesion: PayloadSesion } | { error: NextResponse };

export async function exigirSesion(): Promise<ResultadoAuth> {
    const sesion = await obtenerSesion();

    if (!sesion) {
        return { error: NextResponse.json({ error: "No autenticado." }, { status: 401 }) };
    }

    return { sesion };
}

export async function exigirAdministrador(): Promise<ResultadoAuth> {
    const resultado = await exigirSesion();

    if ("error" in resultado) {
        return resultado;
    }

    if (resultado.sesion.rol !== "administrador") {
        return { error: NextResponse.json({ error: "No autorizado." }, { status: 403 }) };
    }

    return resultado;
}
