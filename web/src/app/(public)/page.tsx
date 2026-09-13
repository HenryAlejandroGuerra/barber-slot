// web/src/app/(public)/page.tsx
/* ===========================================
    Página principal pública
=========================================== */
import Footer from "@/src/components/layout/PublicFooter";
import Header from "@/src/components/layout/PublicHeader";

import HeroSection from "@/src/components/home/HeroSection";
import PrinciplesSection from "@/src/components/home/PrinciplesSection";

export default function HomePage() {
    return (
        <>
            <Header />
            <main>
                <HeroSection />
                <PrinciplesSection />
            </main>
            <Footer />
        </>
    );
}