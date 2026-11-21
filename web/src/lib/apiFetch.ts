/* =====================================================
    web/src/lib/apiFetch.ts
    Fetch centralizado para consumir la API REST de BarberSlot y enviar autenticación Firebase o HMAC.
===================================================== */
import { API_URL } from "@/lib/api";
import { firebaseAuth } from "@/lib/firebase";
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
    /* Firebase tiene prioridad. Si existe una sesión Firebase activa, enviamos su ID Token al backend. */
    const usuarioFirebase = firebaseAuth.currentUser;

    if (usuarioFirebase) {
        const tokenFirebase = await usuarioFirebase.getIdToken();
        headers.set("Authorization", `Bearer ${tokenFirebase}`);
    } else {
        /* Compatibilidad temporal con el token HMAC utilizado antes de la migración a Firebase. */
        const tokenAnterior = obtenerToken();

        if (tokenAnterior) {
            headers.set("Authorization", `Bearer ${tokenAnterior}`);
        }
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
