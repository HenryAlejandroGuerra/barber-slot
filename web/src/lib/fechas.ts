/* ================================================
    web/src/lib/fechas.ts
    Utilidades para manejo de fechas
================================================ */
export function obtenerFechaLocalISO(fecha: Date = new Date()): string {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");
    return `${anio}-${mes}-${dia}`;
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