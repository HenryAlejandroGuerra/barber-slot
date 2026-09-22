/* ================================================
    web/src/services/cita.service.ts
    Servicio de Cita
================================================ */
import type {Cita} from "@/types/cita";
import {readStorage, STORAGE_KEYS} from "@/lib/storage";

async function obtenerTodas(): Promise<Cita[]> {
    return readStorage<Cita[]>(STORAGE_KEYS.citas, []);
}

async function obtenerPorFecha(fecha: string): Promise<Cita[]> {
    const citas = await obtenerTodas();

    return citas.filter(
        (cita) => cita.fecha === fecha
    );
}

export const citaService = {obtenerTodas, obtenerPorFecha};
