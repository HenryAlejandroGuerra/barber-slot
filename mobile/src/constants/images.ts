/* ================================================
    mobile/src/constants/images.ts
    Constantes visuales de BarberSlot
================================================ */
export const IMAGES = {
    brand: {
        logoFull: require("../../assets/images/brand/logo-full.png"),
        logo: require("../../assets/images/brand/logo.png")
    },
    admin: {
        citasHoy: require("../../assets/images/admin/icons/citas-hoy.png"),
        nuevasCitas: require("../../assets/images/admin/icons/nuevas-citas.png"),
        canceladas: require("../../assets/images/admin/icons/canceladas.png"),
        serviciosActivos: require("../../assets/images/admin/icons/servicios-activos.png"),
        barberosDisponibles: require("../../assets/images/admin/icons/barberos-disponibles.png")
    },
    home: {
        hero: require("../../assets/images/home/hero-barbershop.png")
    },
    social: {
        facebook: require("../../assets/images/social/facebook.png"),
        whatsapp: require("../../assets/images/social/whatsapp.png"),
        instagram: require("../../assets/images/social/instagram.png")
    },
    barberos: {
        "pablo-neruda.jpg": require("../../assets/images/barberos/pablo-neruda.jpg"),
        "nelson-portillo.jpg": require("../../assets/images/barberos/nelson-portillo.jpg"),
        "juan-melendez.jpg": require("../../assets/images/barberos/juan-melendez.jpg"),
        "primero-disponible.jpg": require("../../assets/images/barberos/primero-disponible.jpg")
    }
} as const;

/** Resuelve el archivo local que corresponde a la ruta `imagenUrl` que devuelve la API web (ej. "/images/barberos/pablo-neruda.jpg"). */
export function resolverImagenBarbero(imagenUrl?: string | null) {
    if (!imagenUrl) return undefined;

    const archivo = imagenUrl.split("/").pop() ?? "";

    return (IMAGES.barberos as Record<string, unknown>)[archivo];
}
