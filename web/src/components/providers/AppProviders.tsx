"use client";
/* ================================================
    web/src/components/providers/AppProviders.tsx
================================================ */
import {useEffect, useState} from "react";
import {AuthProvider} from "@/contexts/AuthContext";
import {initializeMockData} from "@/data/mock/seed";

export default function AppProviders({children,}: {children: React.ReactNode;}) {
    const [inicializado, setInicializado,] = useState(false);

    useEffect(() => {initializeMockData(); setInicializado(true);}, []);

    if (!inicializado) {
        return null;
    }

    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}
