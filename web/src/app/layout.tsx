/* ================================================
    web/src/app/layout.tsx
    Layout raíz de BarberSlot
================================================ */
import type { Metadata } from "next";
import { montserrat } from "@/lib/fonts";
import AppProviders from "@/components/providers/AppProviders";
import "./globals.css";

export const metadata: Metadata = {
    title: "BarberSlot",
    description: "Sistema de reserva de citas para Barbería Estilo Clásico"
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
    return (
        <html lang="es">
            <body className={montserrat.variable}>
                <AppProviders>
                    {children}
                </AppProviders>
            </body>
        </html>
    );
}
