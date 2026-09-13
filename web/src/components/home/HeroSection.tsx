// web/src/components/home/HeroSection.tsx
import Image from "next/image";

export default function HeroSection() {
    return (
        <section className="app-container pt-8 md:pt-10">
            <div className="relative h-[260px] overflow-hidden rounded-2xl sm:h-[320px] lg:h-[390px]">
                <Image
                src="/images/home/hero-barbershop.svg"
                alt="Herramientas profesionales de barbería"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1400px"
                />
            </div>
        </section>
    );
}