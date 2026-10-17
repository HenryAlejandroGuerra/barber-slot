/* ================================================
    backend/src/lib/fechas.ts
    Utilidades para manejo de fechas
================================================ */
export function obtenerFechaLocalISO(fecha: Date = new Date()): string {
    const partes = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/El_Salvador",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(fecha);

    const obtener = (tipo: Intl.DateTimeFormatPartTypes) =>
        partes.find((parte) =>
            parte.type === tipo
        )?.value ?? "";

    return `${obtener("year")}-${obtener("month")}-${obtener("day")}`;
}

// El Salvador no tiene horario de verano: el desfase respecto a UTC es
// siempre -06:00. Se fija explícito para que las citas queden guardadas de
// forma consistente sin importar en qué zona horaria corra el servidor.
const DESFASE_EL_SALVADOR = "-06:00";

export function combinarFechaHora(fecha: string, hora: string): Date {
    return new Date(`${fecha}T${hora}:00${DESFASE_EL_SALVADOR}`);
}

export function separarFechaHora(fechaHora: Date): { fecha: string; hora: string } {
    const texto = fechaHora.toLocaleString("sv-SE", { timeZone: "America/El_Salvador" });
    const [fecha, horaCompleta] = texto.split(" ");
    return { fecha, hora: horaCompleta.slice(0, 5) };
}
