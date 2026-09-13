// web/src/components/layout/PublicHeader.tsx
import Image from "next/image";
import Link from "next/link";

import PrimaryButton from "@/src/components/ui/PrimaryButton";

const navigation = [
    { label: "Barberos", href: "/barberos"},
    { label: "Servicios", href: "/servicios"},
    { label: "Horario", href: "/horario"},
    { label: "Datos", href: "/datos"},
    { label: "Confirmación", href: "/confirmacion"}
];

export default function Header() {
    return (
        <header className="bg-brand-black">
        <div className="app-container flex min-h-28 items-center justify-between gap-8">
            <Link href="/" aria-label="Ir al inicio">
            <Image
                src="/images/brand/logo.svg"
                alt="BarberSlot"
                width={72}
                height={72}
                priority
            />
            </Link>

            <nav className="hidden items-center gap-12 lg:flex">
            {navigation.map((item) => (
                <Link
                key={item.href}
                href={item.href}
                className="nav-link"
                >
                {item.label}
                </Link>
            ))}
            </nav>

            <PrimaryButton href="/reservar">
            Reservar cita
            </PrimaryButton>
        </div>
        </header>
    );
}