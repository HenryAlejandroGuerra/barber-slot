/* ================================================
    web/src/services/servicio.service.ts
    Servicio de Servicios de Peluquería
================================================ */
import type {Servicio} from "@/types/servicio";
import { apiFetch } from "@/lib/apiFetch";

async function obtenerTodos(): Promise<Servicio[]> {
    return apiFetch<Servicio[]>("/api/servicios");
}

async function obtenerActivos(): Promise<Servicio[]> {
    const servicios = await obtenerTodos();

    return servicios.filter(
        (servicio) => servicio.activo
    );
}

async function crear(
    datos: Omit<Servicio, "id">
): Promise<Servicio> {
    return apiFetch<Servicio>("/api/servicios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
    });
}

async function actualizar(
    idServicio: string,
    datos: Omit<Servicio, "id">
): Promise<Servicio> {
    return apiFetch<Servicio>(`/api/servicios/${idServicio}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
    });
}

async function cambiarEstado(
    idServicio: string,
    activo: boolean
): Promise<Servicio> {
    // Desactivar usa el DELETE del backend (baja lógica). Reactivar reusa PUT,
    // porque el backend solo expone POST/PUT/DELETE para /api/servicios.
    if (!activo) {
        return apiFetch<Servicio>(`/api/servicios/${idServicio}`, { method: "DELETE" });
    }

    const servicios = await obtenerTodos();
    const actual = servicios.find((servicio) => servicio.id === idServicio);

    if (!actual) {
        throw new Error("Servicio no encontrado.");
    }

    return actualizar(idServicio, {
        nombre: actual.nombre,
        descripcion: actual.descripcion,
        precio: actual.precio,
        duracionMinutos: actual.duracionMinutos,
        activo: true,
    });
}

export const servicioService = {obtenerTodos, obtenerActivos, crear, actualizar, cambiarEstado};
