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
    }
} as const;
