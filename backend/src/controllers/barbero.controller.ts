/* =====================================================
    backend/src/controllers/barbero.controller.ts
    Controlador HTTP de Barberos
===================================================== */
import type { NextFunction, Request, Response } from "express";
import { barberoService } from "@/services/barbero.service";

export async function obtenerBarberos(request: Request, response: Response, next: NextFunction) {
    try {
        const barberos = await barberoService.obtenerTodos();
        response.json(barberos);
    } catch (error) {
        next(error);
    }
}
