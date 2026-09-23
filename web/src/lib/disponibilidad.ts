/* ===========================================
    web/src/lib/disponibilidad.ts
    Cálculo de horarios libres para un barbero/servicio/fecha
=========================================== */
import { prisma } from "@/lib/prisma";
import { combinarFechaHora } from "@/lib/fechas";
import { HORARIOS_DISPONIBLES } from "@/lib/horarios";

export async function calcularDisponibilidad(
    barberoId: string,
    duracionMinutos: number,
    fecha: string
): Promise<string[]> {
    const inicioDelDia = combinarFechaHora(fecha, "00:00");
    const finDelDia = combinarFechaHora(fecha, "23:59");

    const citasDelDia = await prisma.cita.findMany({
        where: {
            barberoId,
            estado: { not: "cancelada" },
            fechaInicio: { lt: finDelDia },
            fechaFin: { gt: inicioDelDia },
        },
        select: { fechaInicio: true, fechaFin: true },
    });

    const ahora = new Date();

    return HORARIOS_DISPONIBLES.filter((hora) => {
        const inicioBloque = combinarFechaHora(fecha, hora);
        const finBloque = new Date(inicioBloque.getTime() + duracionMinutos * 60_000);

        if (inicioBloque < ahora) {
            return false;
        }

        const seTraslapa = citasDelDia.some(
            (cita) => inicioBloque < cita.fechaFin && finBloque > cita.fechaInicio
        );

        return !seTraslapa;
    });
}
