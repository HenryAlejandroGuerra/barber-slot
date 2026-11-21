"use client";
/* ================================================
    web/src/contexts/AuthContext.tsx
    Gestiona la sesión administrativa mediante Firebase Authentication y perfiles Firestore.
================================================ */
import { createContext, useContext, useEffect, useState } from "react";
import type { SesionUsuario } from "@/types/auth";
import { firebaseAuthService } from "@/services/firebaseAuth.service";
import { usuarioService } from "@/services/usuario.service";

interface AuthContextType {
    sesion: SesionUsuario | null;
    cargando: boolean;

    iniciarSesion: (correo: string, contra: string) => Promise<SesionUsuario>;
    cerrarSesion: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function obtenerSesionAutorizada(uid: string): Promise<SesionUsuario> {
    const perfil = await usuarioService.obtenerPerfil(uid);

    if (!perfil) {
        throw new Error("No existe un perfil asociado a este usuario.");
    }

    if (perfil.rol !== "administrador" && perfil.rol !== "barbero") {
        throw new Error("Este usuario no tiene acceso al panel administrativo.");
    }

    return usuarioService.convertirASesion(perfil);
}

export function AuthProvider({children}: {children: React.ReactNode;}) {
    const [sesion, setSesion] = useState<SesionUsuario | null>(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cancelarObservador = firebaseAuthService.observarSesion(async (usuario) => {
            if (!usuario) {
                setSesion(null);
                setCargando(false);
                return;
            }

            try {
                const sesionActual = await obtenerSesionAutorizada(usuario.uid);
                setSesion(sesionActual);

            } catch (error) {
                console.error("No se pudo restaurar la sesión:", error);
                await firebaseAuthService.cerrarSesion();
                setSesion(null);
            } finally {
                setCargando(false);
            }
        });

        return cancelarObservador;
    }, []);

    async function iniciarSesion(correo: string, contra: string): Promise<SesionUsuario> {
        const usuario = await firebaseAuthService.iniciarSesionCorreo(correo, contra);

        try {
            const nuevaSesion = await obtenerSesionAutorizada(usuario.uid);
            setSesion(nuevaSesion);
            return nuevaSesion;
        } catch (error) {
            await firebaseAuthService.cerrarSesion();
            throw error;
        }
    }

    async function cerrarSesion() {
        await firebaseAuthService.cerrarSesion();
        setSesion(null);
    }

    return (
        <AuthContext.Provider value={{ sesion, cargando, iniciarSesion, cerrarSesion }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth debe utilizarse dentro de AuthProvider.");
    }

    return context;
}
