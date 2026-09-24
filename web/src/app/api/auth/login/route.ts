/* ===========================================
    web/src/app/api/auth/login/route.ts
    Público: inicio de sesión con límite de solicitudes por IP
=========================================== */
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { crearSesion } from "@/lib/session";
import { obtenerIp, limiteExcedido } from "@/lib/rateLimit";

const datosLogin = z.object({
    correo: z.string().trim().email(),
    contra: z.string().min(1),
});

export async function POST(request: Request) {
    if (limiteExcedido(`login:${obtenerIp(request)}`, { limite: 5, ventanaMs: 60_000 })) {
        return NextResponse.json({ error: "Demasiados intentos, intenta de nuevo en un momento." }, { status: 429 });
    }

    const cuerpo = await request.json();
    const analisis = datosLogin.safeParse(cuerpo);

    if (!analisis.success) {
        return NextResponse.json({ error: analisis.error.flatten() }, { status: 400 });
    }

    const { correo, contra } = analisis.data;
    const correoNormalizado = correo.toLowerCase();

    const usuario = await prisma.usuario.findUnique({ where: { correo: correoNormalizado } });

    // Se compara siempre contra un hash (real o de relleno) para que responder
    // "usuario inexistente" tome el mismo tiempo que "contraseña incorrecta"
    // y no se pueda usar el tiempo de respuesta para adivinar correos válidos.
    const hashContraDummy = "$2b$10$CwTycUXWue0Thq9StjUM0uJ8Zb1jY8DdVN.mHu77dkuFyYT8n7v6a";
    const coincide = await bcrypt.compare(contra, usuario?.contraHash ?? hashContraDummy);

    if (!usuario || !usuario.activo || !coincide) {
        return NextResponse.json({ error: "Correo o contraseña incorrectos." }, { status: 401 });
    }

    const sesion = {
        idUsuario: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        idBarbero: usuario.barberoId ?? undefined,
    };

    try {
        await crearSesion(sesion);
    } catch (error) {
        // Si falta SESSION_SECRET en el entorno, crearSesion lanza en vez de
        // dejar la cookie a medias. Se responde con un error claro en vez de
        // que el servidor termine en un 500 en blanco.
        console.error("No se pudo crear la sesión:", error);
        return NextResponse.json({ error: "El servidor no está configurado correctamente." }, { status: 500 });
    }

    return NextResponse.json(sesion);
}
