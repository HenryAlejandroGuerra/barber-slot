/* ==========================================================
    backend/src/controllers/disponibilidad.controller.ts
    Controlador para consulta de horarios disponibles
========================================================== */
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { disponibilidadService, ErrorDisponibilidad } from "@/services/disponibilidad.service";

const consultaDisponibilidadSchema = z.object({
    barberoId: z.string().trim().min(1),
    servicioId: z.string().trim().min(1),
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe utilizar el formato YYYY-MM-DD."),
    });

export async function obtenerDisponibilidad(request: Request, response: Response, next: NextFunction) {
    try {
        const analisis = consultaDisponibilidadSchema.safeParse(request.query);

        if (!analisis.success) {
            response.status(400).json({error: analisis.error.flatten()});
            return;
        }

        const { barberoId, servicioId, fecha } = analisis.data;

        const horarios = await disponibilidadService.obtenerDisponibilidad(
            barberoId,
            servicioId,
            fecha
        );

        response.json({horarios});
    } catch (error) {
        if (error instanceof ErrorDisponibilidad) {
            response.status(error.statusCode).json({error: error.message});
            return;
        }

        next(error);
    }
}
