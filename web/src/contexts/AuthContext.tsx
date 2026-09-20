"use client";
/* ================================================
    web/src/contexts/AuthContext.tsx
================================================ */
import {createContext, useContext, useEffect, useState} from "react";
import type {SesionUsuario} from "@/types/auth";
import {authService} from "@/services/auth.service";

interface AuthContextType {
    sesion: SesionUsuario | null;
    cargando: boolean;

    iniciarSesion: (correo: string, contra: string) => Promise<SesionUsuario>;
    cerrarSesion: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: React.ReactNode;}) {
    const [sesion, setSesion] = useState<SesionUsuario | null>(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        async function cargarSesion() {
            const sesionActual = await authService.obtenerSesionActual();
            setSesion(sesionActual);
            setCargando(false);
        }

        cargarSesion();
    }, []);

    async function iniciarSesion(correo: string, contra: string) {
        const nuevaSesion = await authService.iniciarSesion(correo, contra);
        setSesion(nuevaSesion);
        return nuevaSesion;
    }

    async function cerrarSesion() {
        await authService.cerrarSesion();
        setSesion(null);
    }

    return (
        <AuthContext.Provider value={{sesion, cargando, iniciarSesion, cerrarSesion}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth debe utilizarse dentro de AuthProvider."
        );
    }

    return context;
}
