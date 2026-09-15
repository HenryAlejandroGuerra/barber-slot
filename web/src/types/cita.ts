/* ===========================================
    web/src/types/cita.ts
    Interfaz para Cita
=========================================== */
export type EstadoCita = "confirmado" | "pendiente" | "cancelado";

export interface Cita {
    id: string;
    nombreCliente: string;

    idBarbero: string;
    idServicio: string;

    fecha: string;
    hora: string;

    estado: EstadoCita;

    fechaCreacion: string;
}
