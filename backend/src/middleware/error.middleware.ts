/* ================================================
    backend/src/middleware/error.middleware.ts
================================================ */
import type { NextFunction, Request, Response } from "express";

export function manejarError(error: unknown, request: Request, response: Response, next: NextFunction) {
    console.error("Error no controlado:", error);

    response.status(500).json({
        error: "Ocurrió un error interno en el servidor."
    });
}
