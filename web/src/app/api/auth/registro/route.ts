/* ===========================================
    web/src/app/api/auth/registro/route.ts
    Solo administrador: da de alta un nuevo usuario
=========================================== */
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { exigirAdministrador } from "@/lib/authz";

const datosRegistro = z
    .object({
        nombre: z.string().trim().min(1),
        correo: z.string().trim().email(),
        contra: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
        rol: z.enum(["administrador", "barbero"]),
        barberoId: z.string().min(1).optional(),
    })
    .refine((datos) => datos.rol !== "barbero" || Boolean(datos.barberoId), {
        message: "Selecciona a qué barbero corresponde este usuario.",
        path: ["barberoId"],
    });

export async function POST(request: Request) {
    const resultadoAuth = await exigirAdministrador();
    if ("error" in resultadoAuth) return resultadoAuth.error;

    const cuerpo = await request.json();
    const analisis = datosRegistro.safeParse(cuerpo);

    if (!analisis.success) {
        return NextResponse.json({ error: analisis.error.flatten() }, { status: 400 });
    }

    const { nombre, correo, contra, rol, barberoId } = analisis.data;
    const contraHash = await bcrypt.hash(contra, 10);

    try {
        const usuario = await prisma.usuario.create({
            data: {
                nombre,
                correo: correo.toLowerCase(),
                contraHash,
                rol,
                barberoId: rol === "barbero" ? barberoId : undefined,
            },
            select: { id: true, nombre: true, correo: true, rol: true, barberoId: true, activo: true },
        });

        return NextResponse.json(usuario, { status: 201 });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return NextResponse.json({ error: "Ese correo ya está registrado." }, { status: 409 });
        }
        throw error;
    }
}
