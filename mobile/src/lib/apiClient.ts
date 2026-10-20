/* ===========================================
    mobile/src/lib/apiClient.ts
    fetch con manejo uniforme de errores hacia la API web de BarberSlot
=========================================== */
import Constants from "expo-constants";

/**
 * El backend es la API de Next.js en `web/` (ver AGENTS.md: no hay backend
 * separado). En Expo Go, `localhost` apunta al teléfono, no a la laptop, así
 * que se deriva la IP de la laptop a partir del host de Metro
 * (`Constants.expoConfig.hostUri`, ej. "192.168.0.102:8081").
 * Para forzarla manualmente: variable de entorno EXPO_PUBLIC_API_URL.
 */
function resolverApiBaseUrl(): string {
    const override = process.env.EXPO_PUBLIC_API_URL;
    if (override) return override;

    const host = Constants.expoConfig?.hostUri?.split(":")[0];
    return host ? `http://${host}:3000` : "http://localhost:3000";
}

export const API_BASE_URL = resolverApiBaseUrl();

export async function apiFetch<T>(ruta: string, init?: RequestInit): Promise<T> {
    const respuesta = await fetch(`${API_BASE_URL}${ruta}`, init);

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
