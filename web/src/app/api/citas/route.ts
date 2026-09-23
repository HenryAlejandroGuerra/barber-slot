/* ===========================================
    web/src/app/api/citas/route.ts
    GET: citas propias (barbero) o todas (administrador)
    POST: público, crea una cita con límite de solicitudes por IP
=========================================== */
import { NextResponse, after } from "next/server";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { exigirSesion } from "@/lib/authz";
import { obtenerIp, limiteExcedido } from "@/lib/rateLimit";
import { combinarFechaHora } from "@/lib/fechas";
import { calcularDisponibilidad } from "@/lib/disponibilidad";
import { enviarCorreoConfirmacion } from "@/lib/email";

const datosNuevaCita = z.object({
    nombreCliente: z.string().trim().min(1),
    correoCliente: z.string().trim().email(),
    telefonoCliente: z.string().trim().min(1),
    barberoId: z.string().min(1),
    servicioId: z.string().min(1),
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    hora: z.string().regex(/^\d{2}:\d{2}$/),
});

const CONSTRAINT_TRASLAPE = "cita_sin_traslape";

function esErrorDeTraslape(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError
        ? JSON.stringify(error.meta ?? {}).includes(CONSTRAINT_TRASLAPE)
        : false;
}

export async function GET(request: Request) {
    const resultadoAuth = await exigirSesion();
    if ("error" in resultadoAuth) return resultadoAuth.error;

    const { sesion } = resultadoAuth;

    // Un usuario con rol "barbero" pero sin idBarbero vinculado no debe ver
    // ninguna cita: dejar el filtro en undefined equivaldría a mostrarlas todas.
    if (sesion.rol === "barbero" && !sesion.idBarbero) {
        return NextResponse.json([]);
    }

    const { searchParams } = new URL(request.url);
    const fecha = searchParams.get("fecha");

    const citas = await prisma.cita.findMany({
        where: {
            barberoId: sesion.rol === "barbero" ? sesion.idBarbero : undefined,
            ...(fecha
                ? {
                      fechaInicio: { lt: combinarFechaHora(fecha, "23:59") },
                      fechaFin: { gt: combinarFechaHora(fecha, "00:00") },
                  }
                : {}),
        },
        include: { cliente: true },
        orderBy: { fechaInicio: "asc" },
    });

    return NextResponse.json(citas);
}

export async function POST(request: Request) {
    if (limiteExcedido(`citas:${obtenerIp(request)}`, { limite: 10, ventanaMs: 60_000 })) {
        return NextResponse.json({ error: "Demasiadas solicitudes, intenta de nuevo en un momento." }, { status: 429 });
    }

    const cuerpo = await request.json();
    const analisis = datosNuevaCita.safeParse(cuerpo);

    if (!analisis.success) {
        return NextResponse.json({ error: analisis.error.flatten() }, { status: 400 });
    }

    const { nombreCliente, correoCliente, telefonoCliente, barberoId, servicioId, fecha, hora } = analisis.data;

    const servicio = await prisma.servicio.findUnique({ where: { id: servicioId } });

    if (!servicio || !servicio.activo) {
        return NextResponse.json({ error: "Servicio no disponible." }, { status: 404 });
    }

    const fechaInicio = combinarFechaHora(fecha, hora);
    const fechaFin = new Date(fechaInicio.getTime() + servicio.duracionMinutos * 60_000);

    try {
        const cita = await prisma.cita.create({
            data: {
                fechaInicio,
                fechaFin,
                barbero: { connect: { id: barberoId } },
                servicio: { connect: { id: servicioId } },
                cliente: {
                    create: { nombre: nombreCliente, correo: correoCliente, telefono: telefonoCliente },
                },
            },
            include: { cliente: true, barbero: true, servicio: true },
        });

        after(() =>
            enviarCorreoConfirmacion({
                correoCliente: cita.cliente.correo,
                nombreCliente: cita.cliente.nombre,
                nombreBarbero: cita.barbero.nombre,
                nombreServicio: cita.servicio.nombre,
                fechaHoraTexto: `${fecha} ${hora}`,
            })
        );

        return NextResponse.json(cita, { status: 201 });
    } catch (error) {
        if (esErrorDeTraslape(error)) {
            const horarios = await calcularDisponibilidad(barberoId, servicio.duracionMinutos, fecha);
            return NextResponse.json(
                { error: "Ese horario ya no está disponible.", horarios },
                { status: 409 }
            );
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
            return NextResponse.json({ error: "Barbero no encontrado." }, { status: 404 });
        }

        throw error;
    }
}
