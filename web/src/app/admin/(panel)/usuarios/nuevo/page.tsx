// web/src/app/admin/(panel)/usuarios/nuevo/page.tsx
/* ===========================================
    Página Admin - Alta de usuarios
=========================================== */
"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/auth.service";
import { barberoService } from "@/services/barbero.service";
import type { Barbero } from "@/types/barbero";
import type { RolUsuario } from "@/types/auth";

interface FormularioUsuario {
    nombre: string;
    correo: string;
    contra: string;
    rol: RolUsuario;
    idBarbero: string;
}

const formularioInicial: FormularioUsuario = {
    nombre: "",
    correo: "",
    contra: "",
    rol: "barbero",
    idBarbero: "",
};

export default function NuevoUsuarioPage() {
    const { sesion } = useAuth();
    const router = useRouter();

    const [barberos, setBarberos] = useState<Barbero[]>([]);
    const [formulario, setFormulario] = useState<FormularioUsuario>(formularioInicial);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [enviando, setEnviando] = useState(false);

    // La navegación ya oculta este enlace a quien no es administrador; esto
    // es solo para que no quede una pantalla vacía si alguien entra directo
    // a la URL. La autorización real la impone el servidor en /api/auth/registro.
    useEffect(() => {
        if (sesion && sesion.rol !== "administrador") {
            router.replace("/admin/inicio");
        }
    }, [sesion, router]);

    useEffect(() => {
        barberoService.obtenerTodos().then(setBarberos);
    }, []);

    async function guardarUsuario(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setMensaje("");

        if (formulario.contra.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        if (formulario.rol === "barbero" && !formulario.idBarbero) {
            setError("Selecciona a qué barbero corresponde este usuario.");
            return;
        }

        setEnviando(true);

        try {
            await authService.registrarUsuario({
                nombre: formulario.nombre.trim(),
                correo: formulario.correo.trim(),
                contra: formulario.contra,
                rol: formulario.rol,
                idBarbero: formulario.rol === "barbero" ? formulario.idBarbero : undefined,
            });

            setMensaje("Usuario creado correctamente.");
            setFormulario(formularioInicial);
        } catch (errorDesconocido) {
            setError(errorDesconocido instanceof Error ? errorDesconocido.message : "No fue posible crear el usuario.");
        } finally {
            setEnviando(false);
        }
    }

    return (
        <section className="app-container py-10">
            <header className="text-center">
                <h1 className="text-4xl font-extrabold md:text-5xl">Nuevo usuario</h1>
                <p className="mt-3 text-lg font-semibold text-brand-gray">
                    Da de alta administradores o barberos con acceso al panel
                </p>
            </header>

            {error && (
                <div className="mx-auto mt-6 max-w-lg rounded-lg border border-red-600 bg-red-950/40 px-4 py-3 text-center text-red-400">
                    {error}
                </div>
            )}

            {mensaje && (
                <div className="mx-auto mt-6 max-w-lg rounded-lg border border-green-600 bg-green-950/40 px-4 py-3 text-center text-green-400">
                    {mensaje}
                </div>
            )}

            <form onSubmit={guardarUsuario} className="mx-auto mt-8 max-w-lg space-y-5 rounded-2xl border border-brand-gold bg-admin-surface p-6">
                <div>
                    <label htmlFor="nombre" className="mb-2 block font-semibold text-brand-gold">
                        Nombre
                    </label>
                    <input
                        id="nombre"
                        type="text"
                        required
                        value={formulario.nombre}
                        onChange={(event) => setFormulario({ ...formulario, nombre: event.target.value })}
                        className="w-full rounded-lg border border-admin-border bg-admin-surface px-4 py-3 text-white outline-none focus:border-brand-gold"
                    />
                </div>

                <div>
                    <label htmlFor="correo" className="mb-2 block font-semibold text-brand-gold">
                        Correo
                    </label>
                    <input
                        id="correo"
                        type="email"
                        required
                        value={formulario.correo}
                        onChange={(event) => setFormulario({ ...formulario, correo: event.target.value })}
                        className="w-full rounded-lg border border-admin-border bg-admin-surface px-4 py-3 text-white outline-none focus:border-brand-gold"
                    />
                </div>

                <div>
                    <label htmlFor="contra" className="mb-2 block font-semibold text-brand-gold">
                        Contraseña
                    </label>
                    <input
                        id="contra"
                        type="password"
                        required
                        minLength={8}
                        value={formulario.contra}
                        onChange={(event) => setFormulario({ ...formulario, contra: event.target.value })}
                        className="w-full rounded-lg border border-admin-border bg-admin-surface px-4 py-3 text-white outline-none focus:border-brand-gold"
                    />
                </div>

                <div>
                    <label htmlFor="rol" className="mb-2 block font-semibold text-brand-gold">
                        Rol
                    </label>
                    <select
                        id="rol"
                        value={formulario.rol}
                        onChange={(event) =>
                            setFormulario({ ...formulario, rol: event.target.value as RolUsuario, idBarbero: "" })
                        }
                        className="w-full rounded-lg border border-admin-border bg-admin-surface px-4 py-3 text-white outline-none focus:border-brand-gold"
                    >
                        <option value="barbero">Barbero</option>
                        <option value="administrador">Administrador</option>
                    </select>
                </div>

                {formulario.rol === "barbero" && (
                    <div>
                        <label htmlFor="barbero" className="mb-2 block font-semibold text-brand-gold">
                            Barbero
                        </label>
                        <select
                            id="barbero"
                            required
                            value={formulario.idBarbero}
                            onChange={(event) => setFormulario({ ...formulario, idBarbero: event.target.value })}
                            className="w-full rounded-lg border border-admin-border bg-admin-surface px-4 py-3 text-white outline-none focus:border-brand-gold"
                        >
                            <option value="">Selecciona un barbero</option>
                            {barberos.map((barbero) => (
                                <option key={barbero.id} value={barbero.id}>
                                    {barbero.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={enviando}
                    className="w-full rounded-lg border border-brand-gold bg-brand-gold px-5 py-3 font-bold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {enviando ? "Creando..." : "Crear usuario"}
                </button>
            </form>
        </section>
    );
}
