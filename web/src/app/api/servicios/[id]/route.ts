/* ===========================================
    web/src/app/api/servicios/[id]/route.ts
    PUT: actualizar servicio (solo administrador)
    DELETE: desactivar servicio (solo administrador)
=========================================== */
import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { exigirAdministrador } from "@/lib/authz";
import { serializarServicio } from "@/lib/serializar";

const datosServicio = z.object({
    nombre: z.string().trim().min(1),
    descripcion: z.string().trim().min(1),
    precio: z.number().positive(),
    duracionMinutos: z.number().int().positive(),
    activo: z.boolean(),
});

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const resultadoAuth = await exigirAdministrador();
    if ("error" in resultadoAuth) return resultadoAuth.error;

    const { id } = await params;
    const cuerpo = await request.json();
    const analisis = datosServicio.safeParse(cuerpo);

    if (!analisis.success) {
        return NextResponse.json({ error: analisis.error.flatten() }, { status: 400 });
    }

    try {
        const servicio = await prisma.servicio.update({ where: { id }, data: analisis.data });
        return NextResponse.json(serializarServicio(servicio));
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
            return NextResponse.json({ error: "Servicio no encontrado." }, { status: 404 });
        }
        throw error;
    }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const resultadoAuth = await exigirAdministrador();
    if ("error" in resultadoAuth) return resultadoAuth.error;

    const { id } = await params;

    try {
        const servicio = await prisma.servicio.update({ where: { id }, data: { activo: false } });
        return NextResponse.json(serializarServicio(servicio));
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
            return NextResponse.json({ error: "Servicio no encontrado." }, { status: 404 });
        }
        throw error;
    }
}
