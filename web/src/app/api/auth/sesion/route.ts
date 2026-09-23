/* ===========================================
    web/src/app/api/auth/sesion/route.ts
    Devuelve la sesión actual (o null) según la cookie httpOnly
=========================================== */
import { NextResponse } from "next/server";
import { obtenerSesion } from "@/lib/session";

export async function GET() {
    const sesion = await obtenerSesion();

    if (!sesion) {
        return NextResponse.json(null);
    }

    const { idUsuario, nombre, correo, rol, idBarbero } = sesion;

    return NextResponse.json({ idUsuario, nombre, correo, rol, idBarbero });
}
