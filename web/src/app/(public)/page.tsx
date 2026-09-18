/* ===========================================
    web/src/app/(public)/page.tsx
    Página principal pública
=========================================== */
import HeroSection from "@/components/home/HeroSection";
import PrinciplesSection from "@/components/home/PrinciplesSection";

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <PrinciplesSection />
        </>
    );
}
