/* ================================================
    web/src/components/ui/PrimaryButton.tsx
    Diseño del Botón Primario
================================================ */
import Link from "next/link";

interface PrimaryButtonProps {children: React.ReactNode; href?: string; className?: string;}

export default function PrimaryButton({children, href, className = ""}: PrimaryButtonProps) {
    const classes = `btn-primary ${className}`;

    if (href) {
        return (
            <Link href={href} className={classes}>
                {children}
            </Link>
        );
    }

    return (
        <button type="button" className={classes}>
            {children}
        </button>
    );
}
