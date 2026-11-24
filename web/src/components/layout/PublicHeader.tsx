"use client";
/* ================================================
    web/src/components/layout/PublicHeader.tsx
    Diseño del Header Público
================================================ */
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PrimaryButton from "@/components/ui/PrimaryButton";

const navigation = [
    { label: "Inicio", href: "/" },
    { label: "Barberos", href: "/barberos" }
];

// Permite controlar si el menú móvil está abierto o cerrado.
export default function Header() {
    // Indica si el menú móvil está abierto. Inicialmente está cerrado.
    const [menuAbierto, setMenuAbierto] = useState(false);

    // Cierra el menú después de seleccionar una opción.
    function cerrarMenu() {
        setMenuAbierto(false);
    }

    return (
        <header className="bg-brand-black">
            <div className="app-container flex min-h-28 items-center justify-between gap-4">
                {/* Logo */}
                <Link href="/" aria-label="Ir al inicio">
                    <Image src="/images/brand/logo.svg" alt="BarberSlot" width={82} height={86} className="w-[72px] h-auto" priority />
                </Link>

                {/* Navegación principal */}
                <nav className="hidden items-center gap-12 lg:flex">
                    {navigation.map((item) => (
                        <Link key={item.href}
                                href={item.href}
                                className="nav-link" >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Contenedor de botones del encabezado. */}
                <div className="flex items-center gap-3">
                    {/* Conservamos el botón de reservación existente. */}
                    <PrimaryButton href="/reservar">
                        Reservar cita
                    </PrimaryButton>

                    {/* Botón para abrir y cerrar el menú móvil. lg:hidden: Oculta este botón en pantallas grandes. */}
                    <button type="button" aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"} aria-expanded={menuAbierto} aria-controls="menu-movil" 
                        onClick={() => setMenuAbierto(!menuAbierto)} className="flex h-11 w-11 items-center justify-center rounded-lg border border-brand-gold text-white lg:hidden">
                        <span aria-hidden="true" className="text-2xl leading-none">
                            {menuAbierto ? "×" : "☰"}
                        </span>
                    </button>

                </div>
            </div>
            {/* Navegación desplegable para celulares. Solo se muestra cuando menuAbierto es true. También se oculta en pantallas grandes. */}
            {menuAbierto && (
                <nav id="menu-movil" aria-label="Navegación móvil" className="border-t border-white/20 lg:hidden">
                    <div className="app-container flex flex-col gap-2 py-4">
                        {/* Reutilizamos las mismas opciones del menú de escritorio. */}
                        {navigation.map((item) => (
                            <Link key={item.href} href={item.href} onClick={cerrarMenu}
                                className="rounded-lg px-4 py-3 font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-brand-gold">
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </nav>
            )}
        </header>
    );
}
