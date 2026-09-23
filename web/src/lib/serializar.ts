/* ===========================================
    web/src/lib/serializar.ts
    Prisma devuelve los campos Decimal como objetos Decimal;
    hay que pasarlos a number antes de responder en JSON.
=========================================== */
import type { Servicio } from "@/generated/prisma/client";

export function serializarServicio(servicio: Servicio) {
    return { ...servicio, precio: Number(servicio.precio) };
}
