/* =====================================================
    backend/src/controllers/auth.controller.ts
    Controlador HTTP encargado del inicio de sesión, consulta de sesión y registro de usuarios.
===================================================== */
import type { NextFunction, Request, Response } from "express";
import { authService, ErrorAuth } from "../services/auth.service.js";
import type { PayloadSesion, RolUsuario } from "../lib/token.js";

function manejarErrorAuth(error: unknown, response: Response, next: NextFunction): void {
    if (error instanceof ErrorAuth) {
        response.status(error.status).json({
            error: error.message
        });

        return;
    }

    next(error);
}

export async function iniciarSesion(request: Request, response: Response, next: NextFunction) {
    try {
        const { correo, contra } = request.body;

        if (typeof correo !== "string" || typeof contra !== "string" || !correo.trim() || !contra) {
            response.status(400).json({error: "Correo y contraseña son obligatorios."});
            return;
        }

        const resultado = await authService.iniciarSesion(correo, contra);
        response.json(resultado);
    } catch (error) {
        manejarErrorAuth(error, response, next);
    }
}

export async function obtenerSesionActual(request: Request, response: Response, next: NextFunction) {
    try {
        const sesion = response.locals.sesion as PayloadSesion;
        const usuario = await authService.obtenerSesionActual(sesion.idUsuario);
        response.json(usuario);
    } catch (error) {
        manejarErrorAuth(error, response, next);
    }
}

export function cerrarSesion(request: Request, response: Response) {
    /* El token se almacena del lado del cliente. El logout elimina ese token en Web o Mobile. */
    response.status(204).send();
}

export async function registrarUsuario(request: Request, response: Response, next: NextFunction) {
    try {
        const {
            nombre,
            correo,
            contra,
            rol,
            barberoId
        } = request.body;

        if (typeof nombre !== "string" || typeof correo !== "string" || typeof contra !== "string" || !nombre.trim() || !correo.trim() || !contra) {
            response.status(400).json({error: "Nombre, correo y contraseña son obligatorios."});
            return;
        }

        if (rol !== "administrador" && rol !== "barbero") {
            response.status(400).json({error: "El rol proporcionado no es válido."});
            return;
        }

        if (contra.length < 8) {
            response.status(400).json({error: "La contraseña debe tener al menos 8 caracteres."});
            return;
        }

        const usuario = await authService.registrarUsuario({
            nombre,
            correo,
            contra,
            rol: rol as RolUsuario,
            barberoId
        });

        response.status(201).json(usuario);
    } catch (error) {
        manejarErrorAuth(error, response, next);
    }
}
