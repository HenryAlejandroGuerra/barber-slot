"use client";
/* ================================================
    web/src/components/admin/AdminLoginForm.tsx
    Formulario de acceso administrativo mediante correo o cuenta de Google.
================================================ */
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLoginForm() {
    const router = useRouter();
    const {iniciarSesion, iniciarSesionGoogle} = useAuth();
    const [correo, setCorreo] = useState("");
    const [contra, setContra] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);
    const [cargandoGoogle, setCargandoGoogle] = useState(false);
    const bloqueado = cargando || cargandoGoogle;

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setCargando(true);

        try {
            await iniciarSesion(correo, contra);
            router.replace("/admin/inicio");
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("No fue posible iniciar sesión.");
            }
        } finally {
            setCargando(false);
        }
    }

    async function handleGoogle() {
        setError("");
        setCargandoGoogle(true);

        try {
            await iniciarSesionGoogle();
            router.replace("/admin/inicio");
        } catch (error) {
            console.error("Error al iniciar sesión con Google:", error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("No fue posible iniciar sesión con Google.");
            }
        } finally {
            setCargandoGoogle(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-xl rounded-2xl border border-brand-gold bg-brand-black p-8">
            <div className="space-y-6">
                <div>
                    <label htmlFor="correo" className="mb-2 block font-bold text-brand-gold">
                        Correo electrónico
                    </label>

                    <input
                        id="correo"
                        name="correo"
                        type="email"
                        required
                        autoComplete="email"
                        value={correo}
                        disabled={bloqueado}
                        onChange={(event) => setCorreo(event.target.value)}
                        className="input-base"
                        placeholder="ejemplo@barberslot.com"
                    />
                </div>

                <div>
                    <label htmlFor="contra" className="mb-2 block font-bold text-brand-gold">
                        Contraseña
                    </label>

                    <input
                        id="contra"
                        name="contra"
                        type="password"
                        required
                        autoComplete="current-password"
                        value={contra}
                        disabled={bloqueado}
                        onChange={(event) => setContra(event.target.value)}
                        className="input-base"
                        placeholder="Ingresa tu contraseña"
                    />
                </div>

                {error && (
                    <p className="text-sm font-semibold text-red-400">
                        {error}
                    </p>
                )}

                <button type="submit" disabled={bloqueado} className="btn-primary w-full text-lg text-brand-black">
                    {cargando ? "INGRESANDO..." : "INGRESAR"}
                </button>

                <div className="flex items-center gap-4">
                    <span className="h-px flex-1 bg-gray-700" />
                    <span className="text-sm font-semibold text-brand-gray">
                        O
                    </span>
                    <span className="h-px flex-1 bg-gray-700" />
                </div>

                <button type="button" disabled={bloqueado} onClick={handleGoogle}
                    className="w-full rounded-xl border border-gray-400 bg-white px-5 py-4 font-bold text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {cargandoGoogle ? "CONECTANDO..." : "CONTINUAR CON GOOGLE"}
                </button>
            </div>
        </form>
    );
}
