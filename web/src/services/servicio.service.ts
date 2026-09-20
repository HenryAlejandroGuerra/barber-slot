/* ================================================
    web/src/services/servicio.service.ts
    Servicio de Servicios de Peluquería
================================================ */
import type {Servicio} from "@/types/servicio";
import {readStorage, STORAGE_KEYS} from "@/lib/storage";

async function obtenerTodos(): Promise<Servicio[]> {
    return readStorage<Servicio[]>(STORAGE_KEYS.servicios, []);
}

async function obtenerActivos(): Promise<Servicio[]> {
    const servicios = await obtenerTodos();

    return servicios.filter(
        (servicio) => servicio.activo
    );
}

export const servicioService = {obtenerTodos, obtenerActivos};
