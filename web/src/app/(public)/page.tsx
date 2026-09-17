/* ===========================================
    web/src/app/(public)/page.tsx    
    Página principal pública
=========================================== */
import Footer from "@/components/layout/PublicFooter";
import Header from "@/components/layout/PublicHeader";

import HeroSection from "@/components/home/HeroSection";
import PrinciplesSection from "@/components/home/PrinciplesSection";

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