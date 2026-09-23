/* ================================================
    web/src/services/barbero.service.ts
    Servicio de Barbero
================================================ */
import type { Barbero } from "@/types/barbero";
import { apiFetch } from "@/lib/apiFetch";

async function obtenerTodos(): Promise<Barbero[]> {
    return apiFetch<Barbero[]>("/api/barberos");
}

async function obtenerDisponibles(): Promise<Barbero[]> {
    const barberos = await obtenerTodos();

    return barberos.filter(
        (barbero) => barbero.activo && barbero.disponible
    );
}

export const barberoService = {obtenerTodos, obtenerDisponibles};
