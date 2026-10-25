/* =====================================================
    mobile/src/data/mock/barberos.mock.ts
    Barberos simulados para probar la vista pública sin backend
===================================================== */
import type { Barbero } from "@/types/barbero";

export const BARBEROS_MOCK: Barbero[] = [
    {
        id: "barbero-1",
        nombre: "Henry Martinez",
        especialidad: "Corte y barba",
        activo: true,
        disponible: true,
        imagenUrl: "/images/barberos/pablo-neruda.jpg"
    },
    {
        id: "barbero-2",
        nombre: "Francisco Duran",
        especialidad: "Corte",
        activo: true,
        disponible: true,
        imagenUrl: "/images/barberos/nelson-portillo.jpg"
    },
    {
        id: "barbero-3",
        nombre: "Christopher Alvarenga",
        especialidad: "Barba",
        activo: true,
        disponible: true,
        imagenUrl: "/images/barberos/juan-melendez.jpg"
    },
    {
        id: "barbero-4",
        nombre: "Carlos Villacorta",
        especialidad: "Corte clásico",
        activo: true,
        disponible: true,
        imagenUrl: "/images/barberos/primero-disponible.jpg"
    }
];
