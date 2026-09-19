/* ================================================
    web/src/services/cita.service.ts
    Servicio de Cita
================================================ */
import type {Cita, EstadoCita} from "@/types/cita";
import {readStorage, writeStorage, STORAGE_KEYS} from "@/lib/storage";

async function obtenerTodas(): Promise<Cita[]> {
    return readStorage<Cita[]>(STORAGE_KEYS.citas, []);
}

async function obtenerPorFecha(fecha: string): Promise<Cita[]> {
    const citas = await obtenerTodas();

    return citas.filter(
        (cita) => cita.fecha === fecha
    );
}

async function actualizarEstado(
    idCita: string,
    nuevoEstado: EstadoCita
): Promise<Cita> {
    const citas = await obtenerTodas();

    const indice = citas.findIndex(
        (cita) => cita.id === idCita
    );

    if (indice === -1) {
        throw new Error("Cita no encontrada");
    }

    const citaActualizada: Cita = {
        ...citas[indice],
        estado: nuevoEstado
    };

    citas[indice] = citaActualizada;

    writeStorage(STORAGE_KEYS.citas, citas);

    return citaActualizada;
}

export const citaService = {
    obtenerTodas,
    obtenerPorFecha,
    actualizarEstado
};
