"use client";
/* ================================================
    web/src/components/admin/AdminLoginForm.tsx
    Formulario de login administrativo
================================================ */
import {FormEvent, useState} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/contexts/AuthContext";

export default function AdminLoginForm() {
    const router = useRouter();
    const {iniciarSesion} = useAuth();
    const [correo, setCorreo,] = useState("");
    const [contra, setContra] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setCargando(true);

        try {
            await iniciarSesion(correo, contra);
            router.replace(
                "/admin/inicio"
            );
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("No fue posible iniciar sesión");
            }
        } finally {
            setCargando(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className=" w-full max-w-xl rounded-2xl border border-brand-gold bg-brand-black p-8">
            <div className="space-y-6">
                {/* Correo */}
                <div>
                    <label htmlFor="correo" className=" mb-2 block font-bold text-brand-gold">
                        Correo electrónico
                    </label>
                    <input id="correo" name="correo" type="email" required autoComplete="email" value={correo}
                        onChange={(event) => setCorreo(event.target.value)} className="input-base"
                        placeholder="ejemplo@barberslot.com" />
                </div>
                {/* Contraseña */}
                <div>
                    <label htmlFor="contra" className=" mb-2 block font-bold text-brand-gold">
                        Contraseña
                    </label>
                    <input id="contra" name="contra" type="password" required autoComplete="current-password" value={contra}
                        onChange={(event) =>setContra(event.target.value)} className="input-base"
                        placeholder="Ingresa tu contraseña" />
                </div>
                {/* Error */}
                {error && (
                    <p className=" text-sm font-semibold text-red-400">
                        {error}
                    </p>
                )}
                {/* Botón */}
                <button type="submit" disabled={cargando} className=" btn-primary w-full text-lg text-brand-black">
                    {
                        cargando ? "Ingresando..." : "INGRESAR"
                    }
                </button>
            </div>
        </form>
    );
}
