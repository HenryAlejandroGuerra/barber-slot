/* ================================================
    backend/src/services/servicio.service.ts
    Acceso a datos y operaciones de Servicios
================================================ */
import { prisma } from "@/lib/prisma";
import { serializarServicio } from "@/lib/serializar";
import type { DatosServicio, ServicioDTO } from "@/types/servicio";

async function obtenerTodos(): Promise<ServicioDTO[]> {
    const servicios =
        await prisma.servicio.findMany({
            orderBy: { nombre: "asc"}
        });

    return servicios.map(serializarServicio);
}

async function obtenerPorId(id: string): Promise<ServicioDTO | null> {
    const servicio =
        await prisma.servicio.findUnique({
            where: {id}
        });

    if (!servicio) {
        return null;
    }

    return serializarServicio(servicio);
}

async function crear(datos: DatosServicio): Promise<ServicioDTO> {
    const servicio =
        await prisma.servicio.create({
            data: {
                nombre: datos.nombre,
                descripcion: datos.descripcion,
                precio: datos.precio,
                duracionMinutos: datos.duracionMinutos,
                activo: datos.activo
            }
        });

    return serializarServicio(servicio);
}

async function actualizar(id: string, datos: DatosServicio): Promise<ServicioDTO | null> {
    const existente =
        await prisma.servicio.findUnique({
            where: {id}
        });

    if (!existente) {
        return null;
    }

    const servicio =
        await prisma.servicio.update({
            where: {id},
            data: {
                nombre: datos.nombre,
                descripcion: datos.descripcion,
                precio: datos.precio,
                duracionMinutos: datos.duracionMinutos,
                activo: datos.activo
            }
        });

    return serializarServicio(servicio);
}

async function desactivar(id: string): Promise<ServicioDTO | null> {
    const existente =
        await prisma.servicio.findUnique({
            where: {id}
        });

    if (!existente) {
        return null;
    }

    /*
     * Baja lógica.
     * No eliminamos físicamente el servicio porque puede estar relacionado con citas.
     */
    const servicio =
        await prisma.servicio.update({
            where: {id},
            data: { activo: false}
        });

    return serializarServicio(servicio);
}

export const servicioService = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    desactivar
};
