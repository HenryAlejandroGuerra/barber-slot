/* ===========================================
    web/src/app/(public)/layout.tsx
    Diseño de la página principal pública
=========================================== */
import type { Metadata } from "next";
import { montserrat } from "@/src/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
    title: "BarberSlot",
    description: "Sistema de reserva de citas para Barbería Estilo Clásico",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className={montserrat.variable}>
                {children}
            </body>
        </html>
    );
}
