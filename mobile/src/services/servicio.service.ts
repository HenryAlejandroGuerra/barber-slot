import { apiFetch } from "@/lib/apiClient";
import type { Servicio } from "@/types/servicio";

async function obtenerActivos(): Promise<Servicio[]> {
    const servicios = await apiFetch<Servicio[]>("/api/servicios");
    return servicios.filter((servicio) => servicio.activo);
}

export const servicioService = { obtenerActivos };
