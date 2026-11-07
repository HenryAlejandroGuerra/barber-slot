/* =====================================================
    backend/src/lib/token.ts
    Genera y valida los tokens de sesión utilizados para autenticar usuarios de BarberSlot.
===================================================== */
import { createHmac, timingSafeEqual } from "node:crypto";

export type RolUsuario = | "administrador" | "barbero";

export interface PayloadSesion {
    idUsuario: string;
    nombre: string;
    correo: string;
    rol: RolUsuario;
    idBarbero?: string;
    exp: number;
}

const DURACION_SESION_MS = 2 * 60 * 60 * 1000;

function obtenerSecreto(): string {
    const secreto = process.env.SESSION_SECRET;

    if (!secreto) {
        throw new Error("SESSION_SECRET no está configurada.");
    }

    return secreto;
}

function firmar(valor: string): string {
    return createHmac("sha256", obtenerSecreto()).update(valor).digest("base64url");
}

export function crearToken(datos: Omit<PayloadSesion, "exp">): string {
    const payload: PayloadSesion = {...datos, exp: Date.now() + DURACION_SESION_MS};
    const cuerpo = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const firma = firmar(cuerpo);

    return `${cuerpo}.${firma}`;
}

export function verificarToken(token: string): PayloadSesion | null {
    const [cuerpo, firma] = token.split(".");

    if (!cuerpo || !firma) {
        return null;
    }

    const firmaEsperada = firmar(cuerpo);
    const recibido = Buffer.from(firma);
    const esperado = Buffer.from(firmaEsperada);

    if (recibido.length !== esperado.length) {
        return null;
    }

    if (!timingSafeEqual(recibido, esperado)) {
        return null;
    }

    try {
        const payload = JSON.parse(Buffer.from(cuerpo, "base64url").toString("utf8")) as PayloadSesion;

        if (typeof payload.exp !== "number" || payload.exp < Date.now()) {
            return null;
        }

        return payload;
    } catch {
        return null;
    }
}
