/* ================================================
    web/src/services/barbero.service.ts
    Servicio de Barbero
================================================ */
import type {Barbero} from "@/types/barbero";
import {readStorage, STORAGE_KEYS} from "@/lib/storage";

async function obtenerTodos(): Promise<Barbero[]> {
    return readStorage<Barbero[]>(STORAGE_KEYS.barberos, []);
}

async function obtenerDisponibles(): Promise<Barbero[]> {
    const barberos = await obtenerTodos();

    return barberos.filter(
        (barbero) => barbero.activo && barbero.disponible
    );
}

export const barberoService = {obtenerTodos, obtenerDisponibles};
