/* ===========================================
    web/src/app/api/servicios/route.ts
    GET: catálogo (público ve solo activos, admin ve todos)
    POST: crear servicio (solo administrador)
=========================================== */
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { obtenerSesion } from "@/lib/session";
import { exigirAdministrador } from "@/lib/authz";
import { serializarServicio } from "@/lib/serializar";

const datosServicio = z.object({
    nombre: z.string().trim().min(1),
    descripcion: z.string().trim().min(1),
    precio: z.number().positive(),
    duracionMinutos: z.number().int().positive(),
    activo: z.boolean(),
});

export async function GET() {
    const sesion = await obtenerSesion();
    const esAdministrador = sesion?.rol === "administrador";

    const servicios = await prisma.servicio.findMany({
        where: esAdministrador ? undefined : { activo: true },
        orderBy: { nombre: "asc" },
    });

    return NextResponse.json(servicios.map(serializarServicio));
}

export async function POST(request: Request) {
    const resultadoAuth = await exigirAdministrador();
    if ("error" in resultadoAuth) return resultadoAuth.error;

    const cuerpo = await request.json();
    const analisis = datosServicio.safeParse(cuerpo);

    if (!analisis.success) {
        return NextResponse.json({ error: analisis.error.flatten() }, { status: 400 });
    }

    const servicio = await prisma.servicio.create({ data: analisis.data });

    return NextResponse.json(serializarServicio(servicio), { status: 201 });
}
