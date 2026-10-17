/* =====================================================
    backend/src/services/disponibilidad.service.ts
    Servicio de disponibilidad
===================================================== */
import { prisma } from "@/lib/prisma";
import { combinarFechaHora, obtenerFechaLocalISO } from "@/lib/fechas";
import { generarHorariosDisponibles } from "@/lib/horarios";

export class ErrorDisponibilidad extends Error {
    statusCode: number;

    constructor(mensaje: string, statusCode = 400) {
        super(mensaje);
        this.name = "ErrorDisponibilidad";
        this.statusCode = statusCode;
    }
}

async function obtenerDisponibilidad(barberoId: string, servicioId: string, fecha: string): Promise<string[]> {
    const hoy = obtenerFechaLocalISO();

    if (fecha < hoy) {
        throw new ErrorDisponibilidad("No se puede consultar disponibilidad para una fecha pasada.", 400);
    }

    const [barbero, servicio] = await Promise.all([
        prisma.barbero.findUnique({where: {id: barberoId},
            select: {
                id: true,
                activo: true,
                disponible: true,
            },
        }),

        prisma.servicio.findUnique({where: {id: servicioId},
            select: {
                id: true,
                duracionMinutos: true,
                activo: true,
            },
        }),

    ]);

    if (!barbero) {
        throw new ErrorDisponibilidad("El barbero seleccionado no existe.", 404);
    }

    if (!barbero.activo || !barbero.disponible) {
        throw new ErrorDisponibilidad("El barbero seleccionado no está disponible.", 409);
    }

    if (!servicio) {
        throw new ErrorDisponibilidad("El servicio seleccionado no existe.", 404);
    }

    if (!servicio.activo) {
        throw new ErrorDisponibilidad("El servicio seleccionado no está disponible.", 409);
    }

    const inicioDia = combinarFechaHora(fecha, "00:00");
    const finDia = new Date(inicioDia.getTime() + 24 * 60 * 60 * 1000);

    const citasOcupadas = await prisma.cita.findMany({
        where: {
            barberoId,
            /* Una cita cancelada ya no bloquea disponibilidad. */
            estado: {not: "cancelada"},
            /* Buscamos cualquier cita que toque este día. */
            fechaInicio: {lt: finDia},
            fechaFin: {gt: inicioDia},
        },
        select: {
            fechaInicio: true,
            fechaFin: true,
        },
        orderBy: {
            fechaInicio: "asc",
        },
    });

    return generarHorariosDisponibles({fecha, duracionMinutos: servicio.duracionMinutos, citasOcupadas});
}

export const disponibilidadService = { obtenerDisponibilidad };
