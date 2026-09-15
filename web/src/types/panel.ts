/* ===========================================
    web/src/types/panel.ts
    Interfaz para Panel de Inicio
=========================================== */
import type { EstadoCita } from "./cita";
import type { Barbero } from "./barbero";

export interface PanelCita {
    id: string;
    hora: string;
    nombreCliente: string;
    nombreServicio: string;
    nombreBarbero: string;
    estado: EstadoCita;
}

export interface PanelDetalle {
    citasHoy: number;
    nuevasCitas: number;
    citasCanceladas: number;
    serviciosActivos: number;

    citasRecientes: PanelCita[];
    barberosDisponibles: Barbero[];
}
