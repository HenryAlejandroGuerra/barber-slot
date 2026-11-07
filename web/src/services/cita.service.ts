/* ================================================
    web/src/services/cita.service.ts
    Servicio encargado de consultar y administrar las citas desde BarberSlot Web.
================================================ */
import type { Cita, EstadoCita } from "@/types/cita";
import { ApiError, apiFetch } from "@/lib/apiFetch";
import { separarFechaHora } from "@/lib/fechas";

interface CitaApi {
    id: string;
    barberoId: string;
    servicioId: string;
    fechaInicio: string;
    fechaFin: string;
    estado: | "pendiente" | "confirmada" | "cancelada";
    fechaCreacion: string;
    cliente: {nombre: string;};
}

const ESTADO_DB_A_FRONTEND: Record<CitaApi["estado"], EstadoCita> = {
    pendiente: "pendiente",
    confirmada: "confirmado",
    cancelada: "cancelado"
};

const ESTADO_FRONTEND_A_DB: Record<EstadoCita, CitaApi["estado"]> = {
    pendiente: "pendiente",
    confirmado: "confirmada",
    cancelado: "cancelada"
};

function mapearCita(cita: CitaApi): Cita {
    const {fecha, hora} = separarFechaHora(new Date(cita.fechaInicio));

    return {
        id: cita.id,
        nombreCliente: cita.cliente.nombre,
        idBarbero: cita.barberoId,
        idServicio: cita.servicioId,
        fecha,
        hora,
        estado: ESTADO_DB_A_FRONTEND[cita.estado],
        fechaCreacion: cita.fechaCreacion
    };
}

async function obtenerTodas(): Promise<Cita[]> {
    const citas = await apiFetch<CitaApi[]>("/api/citas");
    return citas.map(mapearCita);
}

async function obtenerPorFecha(fecha: string): Promise<Cita[]> {
    const citas = await obtenerTodas();
    return citas.filter((cita) => cita.fecha === fecha);
}

async function actualizarEstado(idCita: string, nuevoEstado: EstadoCita): Promise<Cita> {
    const citaActualizada = await apiFetch<CitaApi>(`/api/citas/${idCita}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({estado: ESTADO_FRONTEND_A_DB[nuevoEstado]})
    });

    return mapearCita(citaActualizada);
}

export class ErrorHorarioNoDisponible extends Error {
    horarios: string[];
    constructor(mensaje: string, horarios: string[]) {
        super(mensaje);
        this.name = "ErrorHorarioNoDisponible";
        this.horarios = horarios;
    }
}

interface DatosNuevaCita {
    nombreCliente: string;
    correoCliente: string;
    telefonoCliente: string;
    idBarbero: string;
    idServicio: string;
    fecha: string;
    hora: string;
}

async function crear(datos: DatosNuevaCita): Promise<Cita> {
    try {
        const cita = await apiFetch<CitaApi>("/api/citas", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                nombreCliente: datos.nombreCliente,
                correoCliente: datos.correoCliente,
                telefonoCliente: datos.telefonoCliente,
                barberoId: datos.idBarbero,
                servicioId: datos.idServicio,
                fecha: datos.fecha,
                hora: datos.hora
            })
        });

        return mapearCita(cita);
    } catch (error) {
        if (error instanceof ApiError && error.status === 409) {
            let horarios = Array.isArray(error.body?.horarios) ? error.body.horarios : [];

            if (horarios.length === 0) {
                try {
                    horarios = await obtenerDisponibilidad(
                        datos.idBarbero,
                        datos.idServicio,
                        datos.fecha
                    );
                } catch {
                    horarios = [];
                }
            }

            throw new ErrorHorarioNoDisponible(error.message, horarios);
        }
        
        throw error;
    }
}

async function obtenerDisponibilidad(idBarbero: string, idServicio: string, fecha: string): Promise<string[]> {
    const parametros = new URLSearchParams({
        barberoId: idBarbero,
        servicioId: idServicio,
        fecha
    });
    const {horarios} = await apiFetch<{horarios: string[];}>(`/api/disponibilidad?${parametros}`);
    return horarios;
}

export const citaService = {
    obtenerTodas,
    obtenerPorFecha,
    actualizarEstado,
    crear,
    obtenerDisponibilidad
};
