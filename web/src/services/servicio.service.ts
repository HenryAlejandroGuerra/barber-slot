/* ================================================
    web/src/services/servicio.service.ts
    Servicio de Servicios de Peluquería
================================================ */
import type {Servicio} from "@/types/servicio";
import {readStorage, writeStorage, STORAGE_KEYS} from "@/lib/storage";

async function obtenerTodos(): Promise<Servicio[]> {
    return readStorage<Servicio[]>(STORAGE_KEYS.servicios, []);
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

    const servicios = await obtenerTodos();

    const nuevoServicio: Servicio = {
        id: crypto.randomUUID(),
        nombre: datos.nombre.trim(),
        descripcion: datos.descripcion.trim(),
        precio: datos.precio,
        duracionMinutos: datos.duracionMinutos,
        activo: datos.activo
    };

    servicios.push(nuevoServicio);

    writeStorage(
        STORAGE_KEYS.servicios,
        servicios
    );

    return nuevoServicio;
}


async function actualizar(
    idServicio: string,
    datos: Omit<Servicio, "id">
): Promise<Servicio> {

    const servicios = await obtenerTodos();

    const indice = servicios.findIndex(
        (servicio) =>
            servicio.id === idServicio
    );

    if (indice === -1) {
        throw new Error(
            "Servicio no encontrado."
        );
    }

    const servicioActualizado: Servicio = {
        id: idServicio,
        nombre: datos.nombre.trim(),
        descripcion: datos.descripcion.trim(),
        precio: datos.precio,
        duracionMinutos: datos.duracionMinutos,
        activo: datos.activo
    };

    servicios[indice] =
        servicioActualizado;

    writeStorage(
        STORAGE_KEYS.servicios,
        servicios
    );

    return servicioActualizado;
}


async function cambiarEstado(
    idServicio: string,
    activo: boolean
): Promise<Servicio> {

    const servicios = await obtenerTodos();

    const indice = servicios.findIndex(
        (servicio) =>
            servicio.id === idServicio
    );

    if (indice === -1) {
        throw new Error(
            "Servicio no encontrado."
        );
    }

    const servicioActualizado: Servicio = {
        ...servicios[indice],
        activo
    };

    servicios[indice] =
        servicioActualizado;

    writeStorage(
        STORAGE_KEYS.servicios,
        servicios
    );

    return servicioActualizado;
}

export const servicioService = {obtenerTodos, obtenerActivos, crear, actualizar, cambiarEstado};
