/* ===========================================
    web/src/app/(public)/layout.tsx
    Diseño de la página principal pública
=========================================== */
import PublicFooter from "@/components/layout/PublicFooter";
import PublicHeader from "@/components/layout/PublicHeader";

export default function PublicLayout({children}: {children: React.ReactNode;}) {
    return (
        <div className="flex min-h-screen flex-col bg-white text-brand-black">
            <PublicHeader />
            <main className="flex-1">
                {children}
            </main>
            <PublicFooter />
        </div>
    );
}
