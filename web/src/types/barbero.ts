/* ===========================================
    web/src/types/barbero.ts
    Interfaz para Barbero
=========================================== */
export interface Barbero {
    id: string;
    nombre: string;
    especialidad: string;
    activo: boolean;
    disponible: boolean;
    imagenUrl?: string;
}
