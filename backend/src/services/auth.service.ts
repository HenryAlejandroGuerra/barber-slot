/* =====================================================
    backend/src/services/auth.service.ts
    Contiene la lógica para iniciar sesión, consultar usuarios autenticados y registrar usuarios.
===================================================== */
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import { crearToken, type PayloadSesion, type RolUsuario } from "../lib/token.js";

export class ErrorAuth extends Error {
    status: number;

    constructor(mensaje: string, status: number) {
        super(mensaje);
        this.name = "ErrorAuth";
        this.status = status;
    }
}

interface DatosRegistro {
    nombre: string;
    correo: string;
    contra: string;
    rol: RolUsuario;
    barberoId?: string;
}

function convertirUsuarioASesion(
    usuario: {
        id: string;
        nombre: string;
        correo: string;
        rol: RolUsuario;
        barberoId: string | null;
    }
): Omit<PayloadSesion, "exp"> {
    return {
        idUsuario: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        idBarbero: usuario.barberoId ?? undefined
    };
}

async function iniciarSesion(correo: string, contra: string) {
    const correoNormalizado = correo.trim().toLowerCase();

    const usuario = await prisma.usuario.findUnique({
        where: { correo: correoNormalizado }
    });

    if (!usuario || !usuario.activo) {
        throw new ErrorAuth("Correo o contraseña incorrectos.", 401);
    }

    const contraseñaValida = await bcrypt.compare(contra, usuario.contraHash);

    if (!contraseñaValida) {
        throw new ErrorAuth("Correo o contraseña incorrectos.", 401);
    }

    const sesion = convertirUsuarioASesion(usuario);

    return {token: crearToken(sesion), sesion};
}

async function obtenerSesionActual(idUsuario: string) {
    const usuario = await prisma.usuario.findUnique({
        where: { id: idUsuario }
    });

    if (!usuario || !usuario.activo) {
        throw new ErrorAuth("La sesión ya no es válida.", 401);
    }

    return convertirUsuarioASesion(usuario);
}

async function registrarUsuario(datos: DatosRegistro) {
    const correo = datos.correo.trim().toLowerCase();
    const existente = await prisma.usuario.findUnique({
        where: { correo }
    });

    if (existente) {
        throw new ErrorAuth("Ya existe un usuario con ese correo.", 409);
    }

    if (datos.rol === "barbero" && !datos.barberoId) {
        throw new ErrorAuth("Un usuario barbero debe estar asociado a un barbero.", 400);
    }

    if (datos.barberoId) {
        const barbero = await prisma.barbero.findUnique({
            where: { id: datos.barberoId }
        });

        if (!barbero) {
            throw new ErrorAuth("El barbero seleccionado no existe.", 404);
        }
    }

    const contraHash = await bcrypt.hash(datos.contra, 10);
    const usuario = await prisma.usuario.create({
        data: {
            nombre: datos.nombre.trim(),
            correo,
            contraHash,
            rol: datos.rol,
            activo: true,
            barberoId: datos.rol === "barbero" ? datos.barberoId: null
        }
    });

    return {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        activo: usuario.activo,
        idBarbero: usuario.barberoId ?? undefined
    };
}

export const authService = {
    iniciarSesion,
    obtenerSesionActual,
    registrarUsuario
};
