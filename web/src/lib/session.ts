/* =====================================================
    web/src/lib/session.ts
    Administra localmente el token de autenticación utilizado por BarberSlot Web.
===================================================== */
const CLAVE_TOKEN = "barberslot_token";

export function guardarToken(token: string): void {
    if (typeof window === "undefined") {
        return;
    }

    sessionStorage.setItem(CLAVE_TOKEN, token);
}

export function obtenerToken(): string | null {
    if (typeof window === "undefined") {
        return null;
    }

    return sessionStorage.getItem(CLAVE_TOKEN);
}

export function eliminarToken(): void {
    if (typeof window === "undefined") {
        return;
    }

    sessionStorage.removeItem(CLAVE_TOKEN);
}
