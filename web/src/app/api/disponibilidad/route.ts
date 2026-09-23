/* ===========================================
    web/src/app/api/disponibilidad/route.ts
    Público: horarios libres de un barbero para una fecha y servicio
=========================================== */
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { calcularDisponibilidad } from "@/lib/disponibilidad";

const parametros = z.object({
    barberoId: z.string().min(1),
    servicioId: z.string().min(1),
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const analisis = parametros.safeParse({
        barberoId: searchParams.get("barberoId"),
        servicioId: searchParams.get("servicioId"),
        fecha: searchParams.get("fecha"),
    });

    if (!analisis.success) {
        return NextResponse.json({ error: analisis.error.flatten() }, { status: 400 });
    }

    const { barberoId, servicioId, fecha } = analisis.data;

    const servicio = await prisma.servicio.findUnique({ where: { id: servicioId } });

    if (!servicio) {
        return NextResponse.json({ error: "Servicio no encontrado." }, { status: 404 });
    }

    const horarios = await calcularDisponibilidad(barberoId, servicio.duracionMinutos, fecha);

    return NextResponse.json({ horarios });
}
