/* =====================================================
    mobile/src/lib/apiFetch.ts
    Centraliza las peticiones HTTP realizadas desde BarberSlot Mobile hacia la API REST.
===================================================== */
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://barberslot-api.vercel.app";

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

export async function apiFetch<T>(ruta: string, init?: RequestInit): Promise<T> {
    const rutaNormalizada = ruta.startsWith("/") ? ruta : `/${ruta}`;
    let respuesta: Response;

    try {
        respuesta = await fetch(`${API_BASE_URL}${rutaNormalizada}`, init);
    } catch (error) {
        const mensaje = error instanceof Error ? error.message : "";

        if (error instanceof TypeError || /failed to fetch|network request failed/i.test(mensaje)) {
            throw new Error(`No se pudo conectar con BarberSlot API (${API_BASE_URL}).`);
        }

        throw error;
    }

    if (respuesta.status === 204) {
        return undefined as T;
    }

    const cuerpo = await respuesta.json().catch(() => null);

    if (!respuesta.ok) {
        const mensaje = typeof cuerpo?.error === "string" ? cuerpo.error : "Ocurrió un error inesperado.";

        throw new ApiError(mensaje, respuesta.status, cuerpo);
    }

    return cuerpo as T;
}

export { API_BASE_URL };
