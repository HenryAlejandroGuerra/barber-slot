/* =====================================================
    backend/src/controllers/cita.controller.ts
    Controlador HTTP encargado de las operaciones relacionadas con las citas de BarberSlot.
===================================================== */
import type { NextFunction, Request, Response } from "express";
import { citaService, ErrorCita } from "../services/cita.service.js";

const ESTADOS_PERMITIDOS = [
    "pendiente",
    "confirmada",
    "cancelada",
] as const;

export async function obtenerCitas(request: Request, response: Response, next: NextFunction) {
    try {
        const citas = await citaService.obtenerTodas();
        response.json(citas);
    } catch (error) {
        next(error);
    }
}

export async function crearCita(request: Request, response: Response, next: NextFunction) {
    try {
        const {
            nombreCliente,
            correoCliente,
            telefonoCliente,
            barberoId,
            servicioId,
            fecha,
            hora
        } = request.body;

        if (!nombreCliente || !correoCliente || !telefonoCliente || !barberoId || !servicioId || !fecha || !hora) {
            response.status(400).json({error: "Todos los datos de la cita son obligatorios."});
            return;
        }

        const cita = await citaService.crear({
            nombreCliente,
            correoCliente,
            telefonoCliente,
            barberoId,
            servicioId,
            fecha,
            hora
        });

        response.status(201).json(cita);
    } catch (error) {
        if (error instanceof ErrorCita) {
            response.status(error.status).json({error: error.message, horarios: []});
            return;
        }
        next(error);
    }
}

export async function actualizarEstadoCita(request: Request, response: Response, next: NextFunction) {
    try {
        const parametroId = request.params.id;
        const id = Array.isArray(parametroId) ? parametroId[0] : parametroId;
        const estado = request.body.estado;

        if (!id) {
            response.status(400).json({ error: "El identificador de la cita es obligatorio."});
            return;
        }

        if (!ESTADOS_PERMITIDOS.includes(estado)) {
            response.status(400).json({error: "El estado de la cita no es válido."});
            return;
        }

        const cita = await citaService.actualizarEstado(id, estado);
        response.json(cita);
    } catch (error) {
        if (error instanceof ErrorCita) {
            response.status(error.status).json({error: error.message});
            return;
        }

        next(error);
    }
}
