/* =====================================================
    backend/src/services/cita.service.ts
    Contiene la lógica de negocio para consultar, crear y actualizar citas de BarberSlot.
===================================================== */
import { prisma } from "../lib/prisma.js";

interface DatosNuevaCita {
    nombreCliente: string;
    correoCliente: string;
    telefonoCliente: string;
    barberoId: string;
    servicioId: string;
    fecha: string;
    hora: string;
}

type EstadoCitaPermitido = | "pendiente" | "confirmada" | "cancelada";

export class ErrorCita extends Error {
    status: number;

    constructor(mensaje: string, status: number) {
        super(mensaje);
        this.name = "ErrorCita";
        this.status = status;
    }
}

function crearFechaHora(fecha: string, hora: string): Date {
    /* El Salvador utiliza UTC-6 durante todo el año. La fecha recibida desde Web tiene formato: YYYY-MM-DD + HH:mm */
    const resultado = new Date(`${fecha}T${hora}:00-06:00`);

    if (Number.isNaN(resultado.getTime())) {
        throw new ErrorCita("La fecha u hora proporcionada no es válida.", 400);
    }

    return resultado;
}

async function obtenerTodas() {
    return prisma.cita.findMany({
        include: { cliente: { select: { nombre: true } } },
        orderBy: { fechaInicio: "desc" }
    });
}

async function crear(datos: DatosNuevaCita) {
    const barbero = await prisma.barbero.findUnique({
        where: { id: datos.barberoId }
    });

    if (!barbero || !barbero.activo) {
        throw new ErrorCita("El barbero seleccionado no está disponible.", 404);
    }

    const servicio = await prisma.servicio.findUnique({
        where: { id: datos.servicioId }
    });

    if (!servicio || !servicio.activo) {
        throw new ErrorCita("El servicio seleccionado no está disponible.", 404);
    }

    const fechaInicio = crearFechaHora(datos.fecha, datos.hora);
    const fechaFin = new Date(fechaInicio.getTime() + servicio.duracionMinutos * 60 * 1000);

    const conflicto = await prisma.cita.findFirst({
        where: {
            barberoId: datos.barberoId,
            estado: { not: "cancelada" },
            fechaInicio: { lt: fechaFin },
            fechaFin: { gt: fechaInicio }
        },
    });

    if (conflicto) {
        throw new ErrorCita("Ese horario ya no está disponible.", 409);
    }

    return prisma.$transaction(async (tx) => {
        let cliente = await tx.cliente.findFirst({
            where: { correo: datos.correoCliente }
        });

        if (cliente) {
            cliente = await tx.cliente.update({
                where: { id: cliente.id },
                data: {
                    nombre: datos.nombreCliente,
                    telefono: datos.telefonoCliente
                }
            });
        } else {
            cliente = await tx.cliente.create({
                data: {
                    nombre: datos.nombreCliente,
                    correo: datos.correoCliente,
                    telefono: datos.telefonoCliente
                },
            });
        }

        return tx.cita.create({
            data: {
                clienteId: cliente.id,
                barberoId: datos.barberoId,
                servicioId: datos.servicioId,
                fechaInicio,
                fechaFin,
                estado: "pendiente"
            },
            include: {
                cliente: { select: { nombre: true } }
            }
        });
    });
}

async function actualizarEstado(idCita: string, estado: EstadoCitaPermitido) {
    const cita = await prisma.cita.findUnique({
        where: { id: idCita }
    });

    if (!cita) {
        throw new ErrorCita("Cita no encontrada.", 404);
    }

    return prisma.cita.update({
        where: { id: idCita },
        data: { estado },
        include: {
            cliente: { select: { nombre: true } }
        }
    });
}

export const citaService = {
    obtenerTodas,
    crear,
    actualizarEstado
};
