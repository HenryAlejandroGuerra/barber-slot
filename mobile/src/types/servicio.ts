/* =====================================================
    mobile/src/types/servicio.ts
    Define la estructura de un servicio recibido desde la API REST de BarberSlot.
===================================================== */
export interface Servicio {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    duracionMinutos: number;
    activo: boolean;
}
