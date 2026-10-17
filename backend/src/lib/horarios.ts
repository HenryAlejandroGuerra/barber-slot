/* ================================================
    backend/src/lib/horarios.ts
    Reglas generales de horarios de BarberSlot
================================================ */
import { combinarFechaHora } from "@/lib/fechas";

export const HORARIOS_DISPONIBLES_SEED = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
];

export const HORARIO_NEGOCIO = {
    apertura: "09:00",
    cierre: "18:00",
    // Las citas pueden comenzar cada 30 minutos.
    intervaloMinutos: 30,
} as const;

interface BloqueOcupado {fechaInicio: Date; fechaFin: Date;}

interface GenerarHorariosParams {
    fecha: string;
    duracionMinutos: number;
    citasOcupadas: BloqueOcupado[];
    ahora?: Date;
}

export function generarHorariosDisponibles({fecha, duracionMinutos, citasOcupadas, ahora = new Date()}: GenerarHorariosParams): string[] {
    const inicioJornada = combinarFechaHora(fecha, HORARIO_NEGOCIO.apertura);
    const finJornada = combinarFechaHora(fecha, HORARIO_NEGOCIO.cierre);
    const intervaloMs = HORARIO_NEGOCIO.intervaloMinutos * 60_000;
    const duracionMs = duracionMinutos * 60_000;
    const horariosDisponibles: string[] = [];

    for (let inicioMs = inicioJornada.getTime(); inicioMs + duracionMs <= finJornada.getTime(); inicioMs += intervaloMs) {
        const inicioBloque = new Date(inicioMs);
        const finBloque = new Date(inicioMs + duracionMs);

        /* Si estamos consultando el día actual, no ofrecemos horarios que ya pasaron. */
        if (inicioBloque.getTime() <= ahora.getTime()) {
            continue;
        }

        /* Dos intervalos se traslapan cuando: nuevoInicio < existenteFin && nuevoFin > existenteInicio */
        const seTraslapa = citasOcupadas.some((cita) => inicioBloque < cita.fechaFin && finBloque > cita.fechaInicio);

        if (seTraslapa) {
            continue;
        }

        horariosDisponibles.push(formatearHora(inicioBloque));
    }

    return horariosDisponibles;
}


function formatearHora(fecha: Date): string {
    return new Intl.DateTimeFormat("sv-SE", {
        timeZone: "America/El_Salvador",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(fecha);
}
