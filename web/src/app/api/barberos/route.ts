/* ===========================================
    web/src/app/api/barberos/route.ts
    Público: lista de barberos activos
=========================================== */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const barberos = await prisma.barbero.findMany({
        where: { activo: true },
        orderBy: { nombre: "asc" },
    });

    return NextResponse.json(barberos);
}
