/* ===========================================
    backend/src/lib/serializar.ts
    Prisma devuelve los campos Decimal como objetos Decimal;
    hay que pasarlos a number antes de responder en JSON.
=========================================== */
import type { ServicioDTO } from "@/types/servicio";

interface ServicioConDecimal {
    id: string;
    nombre: string;
    descripcion: string;
    precio: {
        toString(): string;
    };
    duracionMinutos: number;
    activo: boolean;
}

export function serializarServicio(servicio: ServicioConDecimal): ServicioDTO {
    return {
        id: servicio.id,
        nombre: servicio.nombre,
        descripcion: servicio.descripcion,
        precio: Number(servicio.precio.toString()),
        duracionMinutos: servicio.duracionMinutos,
        activo: servicio.activo
    };
}
