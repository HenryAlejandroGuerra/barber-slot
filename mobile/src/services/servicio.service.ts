/* =====================================================
    mobile/src/services/servicio.service.ts
    Servicio encargado de consultar los servicios disponibles desde la API REST de BarberSlot.
===================================================== */
import { apiFetch } from "@/lib/apiFetch";
import type { Servicio } from "@/types/servicio";

async function obtenerTodos(): Promise<Servicio[]> {
    return apiFetch<Servicio[]>("/api/servicios");
}

async function obtenerActivos(): Promise<Servicio[]> {
    const servicios = await obtenerTodos();
    return servicios.filter((servicio) => servicio.activo);
}

export const servicioService = {
    obtenerTodos,
    obtenerActivos,
};
