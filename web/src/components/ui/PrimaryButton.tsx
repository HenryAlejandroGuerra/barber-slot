/* ================================================
    web/src/components/ui/PrimaryButton.tsx
    Diseño del Botón Primario
================================================ */
import Link from "next/link";

interface PrimaryButtonProps {
    children: React.ReactNode;
    href?: string;
    className?: string;
    variant?: "primary" | "navigation";
}

export default function PrimaryButton({
    children,
    href,
    className = "",
    variant = "primary",
}: PrimaryButtonProps) {
    const baseClass = variant === "navigation" ? "btn-navigation" : "btn-primary";
    const classes = `${baseClass} ${className}`;

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