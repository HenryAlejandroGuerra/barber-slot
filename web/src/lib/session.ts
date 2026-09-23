/* ===========================================
    web/src/lib/session.ts
    Emisión y verificación de la cookie de sesión
=========================================== */
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { RolUsuario } from "@/generated/prisma/client";

const NOMBRE_COOKIE = "sesion";
const DURACION_SEGUNDOS = 60 * 60 * 2; // 2 horas

export interface PayloadSesion {
    idUsuario: string;
    nombre: string;
    correo: string;
    rol: RolUsuario;
    idBarbero?: string;
    exp: number;
}

function obtenerSecreto(): string {
    const secreto = process.env.SESSION_SECRET;

    if (!secreto) {
        throw new Error("Falta configurar SESSION_SECRET en las variables de entorno.");
    }

    return secreto;
}

function firmar(valor: string): string {
    return createHmac("sha256", obtenerSecreto()).update(valor).digest("base64url");
}

// Token con forma "payload.firma": nada de librerías de JWT, es HMAC simple
// sobre JSON codificado en base64url.
function crearToken(payload: PayloadSesion): string {
    const cuerpo = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const firma = firmar(cuerpo);

    return `${cuerpo}.${firma}`;
}

function verificarToken(token: string): PayloadSesion | null {
    const [cuerpo, firma] = token.split(".");

    if (!cuerpo || !firma) {
        return null;
    }

    const firmaEsperada = firmar(cuerpo);
    const bufferRecibido = Buffer.from(firma);
    const bufferEsperado = Buffer.from(firmaEsperada);

    if (
        bufferRecibido.length !== bufferEsperado.length ||
        !timingSafeEqual(bufferRecibido, bufferEsperado)
    ) {
        return null;
    }

    try {
        const payload = JSON.parse(Buffer.from(cuerpo, "base64url").toString()) as PayloadSesion;

        if (payload.exp < Date.now()) {
            return null;
        }

        return payload;
    } catch {
        return null;
    }
}

export async function crearSesion(datos: Omit<PayloadSesion, "exp">): Promise<void> {
    const payload: PayloadSesion = {
        ...datos,
        exp: Date.now() + DURACION_SEGUNDOS * 1000,
    };

    const almacen = await cookies();

    almacen.set(NOMBRE_COOKIE, crearToken(payload), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: DURACION_SEGUNDOS,
        path: "/",
    });
}

export async function obtenerSesion(): Promise<PayloadSesion | null> {
    const almacen = await cookies();
    const token = almacen.get(NOMBRE_COOKIE)?.value;

    if (!token) {
        return null;
    }

    return verificarToken(token);
}

export async function cerrarSesion(): Promise<void> {
    const almacen = await cookies();
    almacen.delete(NOMBRE_COOKIE);
}
