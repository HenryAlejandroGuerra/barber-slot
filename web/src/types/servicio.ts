/* ===========================================
    web/src/types/servicio.ts
    Interfaz para Servicio
=========================================== */
export interface Servicio {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    duracionMinutos: number;
    activo: boolean;
}
