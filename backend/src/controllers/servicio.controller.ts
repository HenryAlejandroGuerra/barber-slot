/* ================================================
    backend/src/controllers/servicio.controller.ts
================================================ */
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { servicioService } from "@/services/servicio.service";
import type { ParametrosId } from "@/types/http";

const datosServicioSchema =
    z.object({
        nombre: z.string().trim().min(2, "El nombre es obligatorio.").max(100),
        descripcion: z.string().trim().min(1, "La descripción es obligatoria.").max(500),
        precio: z.union([z.string(), z.number()]).transform(
            (valor) => String(valor)
        ).refine(
            (valor) => /^\d{1,8}(\.\d{1,2})?$/.test(valor),
            {message: "El precio debe tener como máximo dos decimales."}
        ),
        duracionMinutos: z.coerce.number().int().positive().max(480),
        activo: z.boolean()
    });

export async function obtenerServicios(request: Request, response: Response, next: NextFunction) {
    try {
        const servicios = await servicioService.obtenerTodos();
        response.json(servicios);
    } catch (error) {
        next(error);
    }
}

export async function crearServicio(request: Request, response: Response, next: NextFunction) {
    try {
        const analisis = datosServicioSchema.safeParse(request.body);

        if (!analisis.success) {
            response.status(400).json({
                error: analisis.error.flatten()
            });

            return;
        }

        const servicio = await servicioService.crear(analisis.data);

        response.status(201).json(servicio);
    } catch (error) {
        next(error);
    }
}

export async function actualizarServicio(request: Request<ParametrosId>, response: Response, next: NextFunction) {
    try {
        const analisis = datosServicioSchema.safeParse(request.body);

        if (!analisis.success) {
            response.status(400).json({
                error: analisis.error.flatten()
            });

            return;
        }

        const servicio = await servicioService.actualizar(request.params.id, analisis.data);

        if (!servicio) {
            response.status(404).json({
                error: "Servicio no encontrado."
            });

            return;
        }

        response.json(servicio);
    } catch (error) {
        next(error);
    }
}

export async function desactivarServicio(request: Request<ParametrosId>, response: Response, next: NextFunction) {
    try {
        const servicio = await servicioService.desactivar(request.params.id);

        if (!servicio) {
            response.status(404).json({
                error: "Servicio no encontrado."
            });

            return;
        }

        response.json(servicio);
    } catch (error) {
        next(error);
    }
}
