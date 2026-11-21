/* =====================================================
    backend/src/middleware/auth.middleware.ts
    Verifica tokens HMAC o Firebase y aplica restricciones según el rol del usuario.
===================================================== */
import type { NextFunction, Request, Response } from "express";
import { verificarToken, type PayloadSesion, type RolUsuario } from "../lib/token.js";
import { obtenerFirebaseAuthAdmin, obtenerFirestoreAdmin } from "../lib/firebaseAdmin.js";

interface PerfilFirebase {
    nombre?: unknown;
    correo?: unknown;
    rol?: unknown;
    barberoId?: unknown;
}

function esRolValido(rol: unknown): rol is RolUsuario {
    return (rol === "administrador" || rol === "barbero");
}

export async function autenticar(request: Request, response: Response, next: NextFunction) {
    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        response.status(401).json({ error: "No autenticado." });

        return;
    }

    const token = authorization.slice(7).trim();
    const sesionAnterior = verificarToken(token);

    if (sesionAnterior) {
        response.locals.sesion = sesionAnterior;
        response.locals.origenAuth = "hmac";

        next();
        return;
    }

    /* Si no corresponde al token anterior, intentamos validarlo como Firebase ID Token. */
    try {
        const tokenFirebase = await obtenerFirebaseAuthAdmin().verifyIdToken(token);
        const perfilSnapshot = await obtenerFirestoreAdmin().collection("usuarios").doc(tokenFirebase.uid).get();

        if (!perfilSnapshot.exists) {
            response.status(403).json({ error: "El usuario autenticado no tiene un perfil asociado." });
            return;
        }

        const perfil = perfilSnapshot.data() as PerfilFirebase;

        if (!esRolValido(perfil.rol)) {
            response.status(403).json({ error: "El usuario no tiene acceso administrativo." });
            return;
        }

        const nombre = typeof perfil.nombre === "string" && perfil.nombre.trim() ? perfil.nombre : "Usuario BarberSlot";
        const correo = typeof perfil.correo === "string" && perfil.correo.trim() ? perfil.correo : tokenFirebase.email ?? "";
        const idBarbero = typeof perfil.barberoId === "string" && perfil.barberoId.trim() ? perfil.barberoId : undefined;
        const sesion: PayloadSesion = {
            idUsuario: tokenFirebase.uid,
            nombre,
            correo,
            rol: perfil.rol,
            idBarbero,
            // Firebase entrega exp en segundos.
            exp: tokenFirebase.exp * 1000
        };

        response.locals.sesion = sesion;
        response.locals.origenAuth = "firebase";

        next();
    } catch (error) {
        console.error("Error verificando Firebase ID Token:", error);
        response.status(401).json({ error: "La sesión es inválida o expiró." });
    }
}

export function exigirAdministrador(request: Request, response: Response, next: NextFunction) {
    const sesion = response.locals.sesion as | PayloadSesion | undefined;

    if (!sesion || sesion.rol !== "administrador") {
        response.status(403).json({ error: "No autorizado." });
        return;
    }

    next();
}
