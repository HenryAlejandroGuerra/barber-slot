/* ================================================
    mobile/src/services/barbero.service.ts
    Servicio de Barbero
================================================ */
import type { Barbero } from "@/types/barbero";
import { BARBEROS_MOCK } from "@/data/mock/barberos.mock";

// ponytail: mock en vez del fetch real a /api/barberos, swap cuando el backend
// esté accesible de forma confiable desde el celular.
async function obtenerTodos(): Promise<Barbero[]> {
    return BARBEROS_MOCK;
}

async function obtenerDisponibles(): Promise<Barbero[]> {
    const barberos = await obtenerTodos();

    return barberos.filter(
        (barbero) => barbero.activo && barbero.disponible
    );
}

export const barberoService = {obtenerTodos, obtenerDisponibles};
