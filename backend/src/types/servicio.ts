/* ================================================
    backend/src/types/servicio.ts
    Tipos del módulo de Servicios
================================================ */
export interface ServicioDTO {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    duracionMinutos: number;
    activo: boolean;
}

export interface DatosServicio {
    nombre: string;
    descripcion: string;

    /*
     * Internamente se normalizará a Decimal
     * antes de almacenarse mediante Prisma.
     */
    precio: string;

    duracionMinutos: number;
    activo: boolean;
}
