/* =====================================================
    web/src/lib/fechas.ts
    Utilidades para convertir y formatear fechas utilizando la zona horaria de El Salvador.
===================================================== */
const ZONA_HORARIA = "America/El_Salvador";

function obtenerPartesFecha(fecha: Date) {
    const partes = new Intl.DateTimeFormat("en-CA", {
        timeZone: ZONA_HORARIA,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
    }).formatToParts(fecha);

    function obtener(tipo: Intl.DateTimeFormatPartTypes): string {
        return (
            partes.find((parte) => parte.type === tipo)?.value ?? ""
        );
    }

    return {
        anio: obtener("year"),
        mes: obtener("month"),
        dia: obtener("day"),
        hora: obtener("hour"),
        minuto: obtener("minute")
    };
}

export function obtenerFechaLocalISO(fecha: Date = new Date()): string {
    const partes = obtenerPartesFecha(fecha);

    return `${partes.anio}-${partes.mes}-${partes.dia}`;
}

export function separarFechaHora(fecha: Date): {fecha: string; hora: string;} {
    const partes = obtenerPartesFecha(fecha);

    return {
        fecha: `${partes.anio}-${partes.mes}-${partes.dia}`,
        hora: `${partes.hora}:${partes.minuto}`,
    };
}
