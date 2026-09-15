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