/* ===========================================
    web/src/lib/apiFetch.ts
    fetch con manejo uniforme de errores para los servicios del frontend
=========================================== */
export async function apiFetch<T>(input: string, init?: RequestInit): Promise<T> {
    const respuesta = await fetch(input, init);

    if (!respuesta.ok) {
        const cuerpo = await respuesta.json().catch(() => null);
        const mensaje = typeof cuerpo?.error === "string" ? cuerpo.error : "Ocurrió un error inesperado.";
        throw new Error(mensaje);
    }

    if (respuesta.status === 204) {
        return undefined as T;
    }

    return respuesta.json();
}
