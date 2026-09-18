/* ================================================
    web/src/services/panel.service.ts
    Lógica de datos del Panel de Inicio
================================================ */
import type {PanelDetalle} from "@/types/panel";
import {obtenerFechaLocalISO} from "@/lib/fechas";
import {citaService} from "@/services/cita.service";
import {barberoService} from "@/services/barbero.service";
import {servicioService} from "@/services/servicio.service";

async function obtenerDetalle(): Promise<PanelDetalle> {
    const [citas, barberos, servicios] = await Promise.all([
        citaService.obtenerTodas(),
        barberoService.obtenerTodos(),
        servicioService.obtenerTodos(),
    ]);

    const hoy = obtenerFechaLocalISO();
    const citasDelDia = citas.filter((cita) => cita.fecha === hoy);
    const citasActivasHoy = citasDelDia.filter((cita) => cita.estado !== "cancelado");
    const citasNuevas =
        citas.filter((cita) => {const fechaCreacion = obtenerFechaLocalISO(new Date(cita.fechaCreacion));
            return (fechaCreacion === hoy && cita.estado !== "cancelado");
        });
    const citasRecientes = 
        citasActivasHoy.sort((a, b) => a.hora.localeCompare(b.hora))
            .slice(0, 4)
            .map((cita) => {
                const servicio = servicios.find((item) => item.id === cita.idServicio);
                const barbero = barberos.find((item) => item.id === cita.idBarbero);

                return {
                    id: cita.id,
                    hora: cita.hora,
                    nombreCliente: cita.nombreCliente,
                    nombreServicio: servicio?.nombre ?? "Sin servicio",
                    nombreBarbero: barbero?.nombre ?? "Sin barbero",
                    estado: cita.estado
                };
            });

    return {
        citasHoy: citasActivasHoy.length,
        nuevasCitas: citasNuevas.length,
        citasCanceladas: citasDelDia.filter((cita) => cita.estado === "cancelado").length,
        serviciosActivos: servicios.filter((servicio) => servicio.activo).length,
        citasRecientes,
        barberosDisponibles: barberos.filter((barbero) => barbero.activo && barbero.disponible)
    };
}

export const panelService = {obtenerDetalle};
