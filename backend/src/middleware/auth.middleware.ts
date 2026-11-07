/* =====================================================
    backend/src/middleware/auth.middleware.ts
    Verifica los tokens de autenticación y aplica restricciones según el rol del usuario.
===================================================== */
import type { NextFunction, Request, Response } from "express";
import { verificarToken, type PayloadSesion } from "../lib/token.js";

export function autenticar(request: Request, response: Response, next: NextFunction) {
    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        response.status(401).json({error: "No autenticado."});
        return;
    }

    const token = authorization.slice(7).trim();
    const sesion = verificarToken(token);

    if (!sesion) {
        response.status(401).json({error: "La sesión es inválida o expiró."});
        return;
    }

    response.locals.sesion = sesion;
    next();
}

export function exigirAdministrador(request: Request, response: Response, next: NextFunction) {
    const sesion = response.locals.sesion as | PayloadSesion | undefined;

    if (!sesion || sesion.rol !== "administrador") {
        response.status(403).json({error: "No autorizado."});
        return;
    }

    next();
}
