/* ===========================================
    web/src/app/api/auth/logout/route.ts
    Cierra la sesión actual
=========================================== */
import { NextResponse } from "next/server";
import { cerrarSesion } from "@/lib/session";

export async function POST() {
    await cerrarSesion();
    return NextResponse.json({ ok: true });
}
