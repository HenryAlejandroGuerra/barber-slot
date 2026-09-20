/* ================================================
    web/src/components/admin/DashboardCard.tsx
    Diseño del componente de panel
================================================ */
import Image from "next/image";

interface DashboardCardProps {titulo: string; valor: number; icono: string;}

export default function DashboardCard({titulo, valor, icono}: DashboardCardProps) {
    return (
        <article className="flex items-center gap-6 rounded-xl border border-brand-gold bg-brand-dark px-6 py-5">
            {/* Icono */}
            <div className="shrink-0">
                <Image src={icono} alt="" width={64} height={64} />
            </div>
            {/* Información */}
            <div>
                <p className="text-lg font-bold text-brand-gray">
                    {titulo}
                </p>
                <p className="mt-1 text-5xl font-bold text-white">
                    {valor}
                </p>
            </div>
        </article>
    );
}
