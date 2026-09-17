"use client";

/* ================================================
    web/src/app/(public)/barberos/page.tsx
    Página para visualizar barberos disponibles
================================================ */
import { useEffect, useState } from "react";

import Footer from "@/components/layout/PublicFooter";
import Header from "@/components/layout/PublicHeader";
import BarberosCard from "@/components/barberos/BarberosCard";
import PrimaryButton from "@/components/ui/PrimaryButton";

import { initializeMockData } from "@/data/mock/seed";
import { readStorage, STORAGE_KEYS } from "@/lib/storage";
import type { Barbero } from "@/types/barbero";

export default function BarberosPage() {
    const [barberos, setBarberos] = useState<Barbero[]>([]);

    useEffect(() => {
        initializeMockData();
        setBarberos(readStorage<Barbero[]>(STORAGE_KEYS.barberos, []));
    }, []);

    return (
        <>
            <Header variant="compact" />
            <main>
                <section className="section-spacing">
                    <div className="app-container">
                        <h1 className="section-title">
                            Nuestro equipo
                        </h1>

                        <p className="section-subtitle">
                            Cada uno tiene una historia que contarte, un regalo, una convicción
                            que darte.
                        </p>

                        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {barberos.map((barbero) => (
                                <BarberosCard key={barbero.id} barbero={barbero} />
                            ))}
                        </div>

                        <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:justify-between">
                            <PrimaryButton href="/" variant="navigation">
                                Regresar
                            </PrimaryButton>

                            <PrimaryButton href="/servicios" variant="navigation">
                                Seguir
                            </PrimaryButton>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
