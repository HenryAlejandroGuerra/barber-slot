/* ================================================
    web/src/components/layout/PublicHeader.tsx
    Diseño del Header Público
================================================ */
import Image from "next/image";
import Link from "next/link";

import PrimaryButton from "@/components/ui/PrimaryButton";

interface HeaderProps {
    /**
     * "full": logo con isotipo + wordmark (portada / inicio).
     * "compact": solo isotipo, usado en las pantallas del flujo de reserva.
     */
    variant?: "full" | "compact";
}

const navigation = [
    { label: "Barberos", href: "/barberos" },
    { label: "Servicios", href: "/servicios" },
    { label: "Horario", href: "/horarios" },
    { label: "Datos", href: "/reservar/detalle" },
    { label: "Confirmación", href: "/reservar/confirmacion" },
];

export default function Header({ variant = "full" }: HeaderProps) {
    return (
        <header className="bg-brand-black">
            <div className="app-container flex min-h-28 items-center justify-between gap-8">
                {/* Logo */}
                <Link href="/" aria-label="Ir al inicio">
                    {variant === "full" ? (
                        <Image src="/images/brand/logo.svg"
                                alt="BarberSlot"
                                width={220}
                                height={62}
                                className="h-12 w-auto md:h-14"
                                priority />
                    ) : (
                        <Image src="/images/brand/logo.png"
                                alt="BarberSlot"
                                width={64}
                                height={64}
                                className="h-12 w-12 md:h-14 md:w-14"
                                priority />
                    )}
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

                {/* Botón para reservar una cita */}
                <PrimaryButton href="/reservar">
                    Reservar cita
                </PrimaryButton>
            </div>
        </header>
    );
}
