/* ================================================
    backend/src/services/barbero.service.ts
    Lógica de acceso a datos de Barberos
================================================ */
import { prisma } from "@/lib/prisma";

async function obtenerTodos() {
    return prisma.barbero.findMany({
        select: {
            id: true,
            nombre: true,
            especialidad: true,
            activo: true,
            disponible: true,
            imagenUrl: true
        },
        orderBy: {
            nombre: "asc"
        }
    });
}

export const barberoService = { obtenerTodos };
