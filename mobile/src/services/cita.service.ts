import { apiFetch } from "@/lib/apiClient";

export interface CitaCreada {
    id: string;
    fechaInicio: string;
    estado: "pendiente" | "confirmada" | "cancelada";
}

interface DatosNuevaCita {
    nombreCliente: string;
    correoCliente: string;
    telefonoCliente: string;
    barberoId: string;
    servicioId: string;
    fecha: string;
    hora: string;
}

function fechaParaApi(fecha: string): string {
    const [dia, mes, anio] = fecha.split("/");
    return `${anio}-${mes}-${dia}`;
}

async function obtenerDisponibilidad(barberoId: string, servicioId: string, fecha: string): Promise<string[]> {
    const parametros = new URLSearchParams({ barberoId, servicioId, fecha: fechaParaApi(fecha) });
    const respuesta = await apiFetch<{ horarios: string[] }>(`/api/disponibilidad?${parametros}`);
    return respuesta.horarios;
}

async function crear(datos: DatosNuevaCita): Promise<CitaCreada> {
    return apiFetch<CitaCreada>("/api/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nombreCliente: datos.nombreCliente,
            correoCliente: datos.correoCliente,
            telefonoCliente: datos.telefonoCliente,
            barberoId: datos.barberoId,
            servicioId: datos.servicioId,
            fecha: fechaParaApi(datos.fecha),
            hora: datos.hora,
        }),
    });
}

export const citaService = { obtenerDisponibilidad, crear };
