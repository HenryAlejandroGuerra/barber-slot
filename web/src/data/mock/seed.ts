/* ================================================
    web/src/data/mock/seed.ts
    Datos temporales para desarrollo
================================================ */
import type { Usuario } from "@/types/auth";
import type { Barbero } from "@/types/barbero";
import type { Servicio } from "@/types/servicio";
import type { Cita } from "@/types/cita";
import {readStorage, writeStorage, removeStorage, STORAGE_KEYS} from "@/lib/storage";
import {obtenerFechaLocalISO} from "@/lib/fechas";

const VERSION_MOCK = "1";

export function initializeMockData(): void {
    const versionActual = readStorage<string | null>(STORAGE_KEYS.version,null);

    /*
     * Si la versión ya fue inicializada, no volvemos a sobrescribir los datos.
     */
    if (versionActual === VERSION_MOCK) {
        return;
    }

    /* ========================================
        Usuarios
    ======================================== */
    const usuarios: Usuario[] = [
        {
            id: "usuario-admin-1",
            nombre: "Administrador BarberSlot",
            correo: "admin@barberslot.test",
            contra: "Admin123!",
            rol: "administrador",
            activo: true
        },
        {
            id: "usuario-barbero-1",
            nombre: "Henry Martinez",
            correo: "henry@barberslot.test",
            contra: "Barber123!",
            rol: "barbero",
            activo: true,
            idBarbero: "barbero-1"
        }
    ];

    /* ========================================
        Barberos
    ======================================== */
    const barberos: Barbero[] = [
        {
            id: "barbero-1",
            nombre: "Henry Martinez",
            especialidad: "Corte y barba",
            activo: true,
            disponible: true
        },
        {
            id: "barbero-2",
            nombre: "Francisco Duran",
            especialidad: "Corte",
            activo: true,
            disponible: true,
        },
        {
            id: "barbero-3",
            nombre: "Christopher Alvarenga",
            especialidad: "Barba",
            activo: true,
            disponible: true,
        },
        {
            id: "barbero-4",
            nombre: "Carlos Villacorta",
            especialidad: "Corte clásico",
            activo: true,
            disponible: true,
        }
    ];

    /* ========================================
        Servicios
    ======================================== */
    const servicios: Servicio[] = [
        {
            id: "servicio-1",
            nombre: "Solo Corte",
            descripcion: "Servicio de corte de cabello.",
            precio: 5,
            duracionMinutos: 30,
            activo: true
        },
        {
            id: "servicio-2",
            nombre: "Corte y Barba",
            descripcion: "Servicio combinado de corte y barba.",
            precio: 8,
            duracionMinutos: 45,
            activo: true
        },
        {
            id: "servicio-3",
            nombre: "Solo Barba",
            descripcion: "Perfilado y arreglo de barba.",
            precio: 3,
            duracionMinutos: 15,
            activo: true
        },
        {
            id: "servicio-4",
            nombre: "Afeitado Clásico",
            descripcion: "Servicio de afeitado clásico.",
            precio: 2,
            duracionMinutos: 10,
            activo: true
        }
    ];

    /* ========================================
        Citas
    ======================================== */
    const hoy = obtenerFechaLocalISO();
    const ahora = new Date();
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);

    const citas: Cita[] = [
        {
            id: "cita-1",
            nombreCliente: "Carlos Mendoza",
            idBarbero: "barbero-2",
            idServicio: "servicio-1",
            fecha: hoy,
            hora: "09:00",
            estado: "confirmado",
            fechaCreacion: ahora.toISOString()
        },
        {
            id: "cita-2",
            nombreCliente: "Victor Flores",
            idBarbero: "barbero-3",
            idServicio: "servicio-2",
            fecha: hoy,
            hora: "10:30",
            estado: "pendiente",
            fechaCreacion: ahora.toISOString()
        },
        {
            id: "cita-3",
            nombreCliente: "Elias Quinteros",
            idBarbero: "barbero-4",
            idServicio: "servicio-3",
            fecha: hoy,
            hora: "12:00",
            estado: "confirmado",
            fechaCreacion: ahora.toISOString()
        },
        {
            id: "cita-4",
            nombreCliente: "Samuel Anaya",
            idBarbero: "barbero-1",
            idServicio: "servicio-2",
            fecha: hoy,
            hora: "14:00",
            estado: "pendiente",
            fechaCreacion: ahora.toISOString()
        },
        {
            id: "cita-5",
            nombreCliente: "Kevin Hernandez",
            idBarbero: "barbero-4",
            idServicio: "servicio-1",
            fecha: hoy,
            hora: "16:30",
            estado: "cancelado",
            fechaCreacion: ayer.toISOString()
        }
    ];

    /* ========================================
        Guardar datos
    ======================================== */
    writeStorage(STORAGE_KEYS.usuarios, usuarios);
    writeStorage(STORAGE_KEYS.barberos, barberos);
    writeStorage(STORAGE_KEYS.servicios, servicios);
    writeStorage(STORAGE_KEYS.citas, citas);

    /*
     * Eliminamos una sesión antigua para evitar inconsistencias cuando cambiemos el mock.
     */
    removeStorage(STORAGE_KEYS.sesion);
    writeStorage(STORAGE_KEYS.version, VERSION_MOCK);
}
