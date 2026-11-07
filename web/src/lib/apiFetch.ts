/* ===========================================
    web/src/lib/apiFetch.ts
    Fetch con manejo uniforme de errores para los servicios del frontend.
=========================================== */
import { API_URL } from "@/lib/api";

interface ApiErrorBody {
    error?: string;
    horarios?: string[];
    [key: string]: unknown;
}

export class ApiError extends Error {
    status: number;
    body: ApiErrorBody | null;

    constructor(mensaje: string, status: number, body: ApiErrorBody | null) {
        super(mensaje);
        this.name = "ApiError";
        this.status = status;
        this.body = body;
    }
}

export async function apiFetch<T>(input: string, init?: RequestInit): Promise<T> {
    const ruta = input.startsWith("/") ? input : `/${input}`;
    const respuesta = await fetch(`${API_URL}${ruta}`, init);
    const cuerpo = await respuesta.json().catch(() => null);

    if (!respuesta.ok) {
        const mensaje = typeof cuerpo?.error === "string" ? cuerpo.error : "Ocurrió un error inesperado.";

        throw new ApiError(mensaje, respuesta.status, cuerpo);
    }

    if (respuesta.status === 204) {
        return undefined as T;
    }

    return cuerpo as T;
}
