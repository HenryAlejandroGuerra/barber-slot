/* =====================================================
    web/src/lib/apiFetch.ts
    Fetch centralizado para consumir la API REST de BarberSlot y manejar errores y autenticación.
===================================================== */
import { API_URL } from "@/lib/api";
import { obtenerToken } from "@/lib/session";

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
    const headers = new Headers(init?.headers);
    const token = obtenerToken();

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const respuesta = await fetch(`${API_URL}${ruta}`, {...init, headers});

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
