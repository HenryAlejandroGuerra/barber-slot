/* ================================================
    web/src/lib/storage.ts
    Utilidad para LocalStorage
================================================ */
export const STORAGE_KEYS = {
    usuarios: "barberslot:usuarios",
    barberos: "barberslot:barberos",
    servicios: "barberslot:servicios",
    citas: "barberslot:citas",

    sesion: "barberslot:sesion",

    version: "barberslot:version",
} as const;

export function readStorage<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") {
        return fallback;
    }

    try {
        const storedValue = localStorage.getItem(key);

        if (!storedValue) {
            return fallback;
        }

        return JSON.parse(storedValue) as T;
    } catch {
        return fallback;
    }
}

export function writeStorage<T>(key: string,value: T): void {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.setItem(key,JSON.stringify(value));
}

export function removeStorage(key: string): void {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.removeItem(key);
}
