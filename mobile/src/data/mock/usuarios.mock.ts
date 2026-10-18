/* =====================================================
    mobile/src/data/mock/usuarios.mock.ts
    Usuarios simulados para probar la autenticación
===================================================== */

export type RolUsuarioMock = | "administrador" | "barbero";

export interface UsuarioMock {
    id: string;
    nombre: string;
    correo: string;
    contra: string;
    rol: RolUsuarioMock;
    activo: boolean;
}

export const USUARIOS_MOCK: UsuarioMock[] = [
    {
        id: "admin-1",
        nombre: "Administrador BarberSlot",
        correo: "admin@barberslot.test",
        contra: "Admin123!",
        rol: "administrador",
        activo: true
    },
    {
        id: "barbero-1",
        nombre: "Henry Martinez",
        correo: "henry@barberslot.test",
        contra: "Barber123!",
        rol: "barbero",
        activo: true
    }
];
