/* ===========================================
    web/src/app/api/citas/[id]/route.ts
    PATCH: actualizar estado de una cita
    (barbero: solo las propias; administrador: todas)
=========================================== */
import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { exigirSesion } from "@/lib/authz";

const datosActualizacion = z.object({
    estado: z.enum(["pendiente", "confirmada", "cancelada"]),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const resultadoAuth = await exigirSesion();
    if ("error" in resultadoAuth) return resultadoAuth.error;

    const { sesion } = resultadoAuth;
    const { id } = await params;

    const cuerpo = await request.json();
    const analisis = datosActualizacion.safeParse(cuerpo);

    if (!analisis.success) {
        return NextResponse.json({ error: analisis.error.flatten() }, { status: 400 });
    }

    const cita = await prisma.cita.findUnique({ where: { id } });

    if (!cita) {
        return NextResponse.json({ error: "Cita no encontrada." }, { status: 404 });
    }

    const puedeModificar =
        sesion.rol === "administrador" ||
        (sesion.rol === "barbero" && sesion.idBarbero === cita.barberoId);

    if (!puedeModificar) {
        return NextResponse.json({ error: "No autorizado." }, { status: 403 });
    }

    try {
        const citaActualizada = await prisma.cita.update({
            where: { id },
            data: { estado: analisis.data.estado },
            include: { cliente: true },
        });

        return NextResponse.json(citaActualizada);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
            return NextResponse.json({ error: "Cita no encontrada." }, { status: 404 });
        }
        throw error;
    }
}
