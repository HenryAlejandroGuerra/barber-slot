/* =====================================================
    web/src/components/barberos/BarberosCard.tsx
    Diseño de la vista de Barberos
===================================================== */
import Image from "next/image";

import type { Barbero } from "@/types/barbero";

interface BarberosCardProps {
    barbero: Barbero;
}

export default function BarberosCard({ barbero }: BarberosCardProps) {
    return (
        <article className="card-dark overflow-hidden">
            <div className="relative aspect-square w-full">
                <Image
                    src={barbero.imagenUrl ?? "/images/barberos/placeholder.svg"}
                    alt={barbero.nombre}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 320px"
                />
            </div>

            <div className="p-5">
                <h3 className="text-lg font-bold text-brand-gold">
                    {barbero.nombre}
                </h3>

                <span className="mt-2 inline-block rounded-full bg-white px-3 py-1 text-xs font-bold text-brand-black">
                    {barbero.especialidad}
                </span>

                <p className="status-available mt-3">
                    <span className={barbero.disponible ? "status-dot" : "h-6 w-6 rounded-full bg-brand-gray"} />
                    {barbero.disponible ? "Disponible" : "No disponible"}
                </p>
            </div>
        </article>
    );
}
