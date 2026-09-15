/* =====================================================
    web/src/components/home/PrinciplesSection.tsx
    Diseño de la sección inicial
===================================================== */
import PrimaryButton from "@/src/components/ui/PrimaryButton";
import PrincipleCard from "@/src/components/ui/PrincipleCard";

const principles = [
    {
        title: "Profesionalismo",
        description: "Cada personal en nuestra barbería está altamente capacitado para cada corte.",
    },
    {
        title: "Perfección",
        description: "Porque no solo queda bien, sino queda perfecto.",
    },
    {
        title: "Buen precio",
        description: "Porque verte bien no es caro.",
    },
];

export default function PrinciplesSection() {
    return (
        <section className="section-spacing">
        <div className="app-container">
            <h1 className="section-title">
                Nuestros principios
            </h1>

            <p className="section-subtitle">
                Cada corte es hecho por profesionales altamente calificados y
                aptos para darte el cuidado que mereces.
            </p>

            <div className="mt-12 flex justify-center">
                <PrimaryButton
                    href="/reservar"
                    className="min-w-56 text-lg"
                >
                    Reservar cita
                </PrimaryButton>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3 md:gap-10">
                {principles.map((principle) => (
                    <PrincipleCard
                    key={principle.title}
                    title={principle.title}
                    description={principle.description}
                    />
                ))}
            </div>
        </div>
        </section>
    );
}