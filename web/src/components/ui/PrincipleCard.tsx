/* ================================================
    web/src/components/ui/PrincipleCard.tsx
    Diseño del panel de Inicio
================================================ */
interface PrincipleCardProps {
    title: string;
    description: string;
}

export default function PrincipleCard({
    title,
    description,
}: PrincipleCardProps) {
    return (
        <article className="card-dark p-6">
        <h3 className="mb-3 text-xl font-bold text-brand-gold">
            {title}
        </h3>

        <p className="font-semibold leading-relaxed text-white">
            {description}
        </p>
        </article>
    );
}
