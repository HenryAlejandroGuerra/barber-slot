"use client";
/* ================================================
    web/src/components/admin/AdminHeader.tsx
    Diseño del Header del panel administrativo
================================================ */
import Image from "next/image";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useAuth} from "@/contexts/AuthContext";

const navigation = [
    {
        label: "Inicio",
        href: "/admin/inicio"
    },
    {
        label: "Agenda Diaria",
        href: "/admin/agenda"
    },
    {
        label: "Servicios",
        href: "/admin/servicios"
    },
    {
        label: "Usuarios",
        href: "/admin/usuarios/nuevo"
    }
];

export default function AdminHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const {sesion, cerrarSesion} = useAuth();

    async function handleCerrarSesion() {
        await cerrarSesion();
        router.replace("/admin");
    }

    /*
     * Administrador ve todas las opciones. Barbero no debe administrar servicios.
     */
    const navigationFiltrada = navigation.filter((item) => {
        const soloAdministrador = item.href === "/admin/servicios" || item.href === "/admin/usuarios/nuevo";

        if (soloAdministrador && sesion?.rol !== "administrador") {
            return false;
        }
        return true;
    });

    return (
        <header className=" bg-brand-black text-white">
            <div className=" app-container flex min-h-24 flex-col items-center justify-between gap-5 py-4 lg:flex-row lg:py-0">
                {/* Marca */}
                <Link href="/admin/inicio" className=" flex items-center gap-6">
                    <div className=" text-3xl font-extrabold md:text-4xl">
                        BARBER{" "}
                        <span className="text-brand-gold">
                            SLOT
                        </span>
                    </div>
                    <Image src="/images/brand/logo.svg" alt="Logo BarberSlot" width={64} height={64} priority />
                </Link>
                {/* Navegación */}
                <nav className=" flex flex-wrap items-center justify-center gap-6 lg:gap-10" aria-label="Navegación administrativa">
                    {
                        navigationFiltrada.map((item) => {
                            const activo = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href}
                                    className={`border-b-2 pb-2 font-semibold transition ${ activo ? "border-brand-gold text-brand-gold" : "border-transparent text-white hover:text-brand-gold" }`}>
                                        {item.label}
                                    </Link>
                            );
                        })
                    }
                    <button type="button" onClick={handleCerrarSesion} className=" border-b-2 border-transparent pb-2 font-semibold text-white transition hover:text-brand-gold">
                        Cerrar Sesión
                    </button>
                </nav>
            </div>
        </header>
    );
}
