/* ================================================
    web/src/app/admin/page.tsx
    Página de inicio de sesión administrativo
================================================ */
import Image from "next/image";
import Link from "next/link";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
    return (
        <div className=" flex min-h-screen flex-col bg-brand-dark text-white">
            {/* Encabezado */}
            <header className=" bg-brand-black px-6 py-5">
                <div className=" app-container flex items-center justify-between">
                    <h1 className=" text-4xl font-extrabold md:text-5xl">
                        Barber
                        <span className="text-brand-gold">
                            Slot
                        </span>
                    </h1>
                    <Image src="/images/brand/logo.svg" alt="Logo de BarberSlot" width={72} height={72} priority/>
                </div>
            </header>
            {/* Contenido */}
            <main className=" flex flex-1 flex-col items-center px-6 py-14">
                <h2 className=" text-center text-4xl font-extrabold md:text-5xl">
                    Iniciar Sesión
                </h2>
                <p className=" mt-4 text-center text-lg text-brand-gray md:text-xl">
                    Acceso para Administrador/Barbero
                </p>
                <div className=" mt-12 flex w-full justify-center">
                    <AdminLoginForm />
                </div>
                <Link href="/" className=" mt-8 font-bold text-brand-gold transition hover:underline">
                    Regresar
                </Link>
            </main>
            {/* Footer temporal del login */}
            <footer className=" bg-brand-black py-5 text-center text-brand-gray">
                Todos los derechos reservados ®
            </footer>
        </div>
    );
}
