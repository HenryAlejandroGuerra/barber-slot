/* ===========================================
    web/src/types/auth.ts
    Interfaces para autenticación
=========================================== */
export type RolUsuario = "administrador" | "barbero";

export interface Usuario {
    id: string;
    nombre: string;
    correo: string;

    /*
    * SOLO PARA DATOS MOCK.
    * Nunca almacenaremos contraseñas de esta forma cuando tengamos autenticación real.
    */
    contra: string;
    
    rol: RolUsuario;
    activo: boolean;
    idBarbero?: string;
}

export interface SesionUsuario {
    idUsuario: string;
    nombre: string;
    correo: string;
    rol: RolUsuario;
    idBarbero?: string;
}
