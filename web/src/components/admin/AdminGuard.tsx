"use client";
/* =====================================================
    web/src/components/admin/AdminGuard.tsx
    Protección temporal de rutas administrativas
===================================================== */
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/contexts/AuthContext";

export default function AdminGuard({children,}: {children: React.ReactNode;}) {
    const router = useRouter();
    const {sesion, cargando} = useAuth();

    useEffect(() => {
        if (!cargando && !sesion) {
            router.replace("/admin");
        }
    }, [cargando, sesion, router]);

    if (cargando) {
        return (
            <div className=" flex min-h-screen items-center justify-center bg-brand-dark text-white">
                Cargando...
            </div>
        );
    }

    if (!sesion) {
        return null;
    }

    return children;
}
