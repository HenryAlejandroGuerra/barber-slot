import Footer from "@/components/layout/PublicFooter";
import Header from "@/components/layout/PublicHeader";
import ReservasForm from "@/components/reservas/ReservasForm";

/*
 * Esta ruta funciona como contenedor de la experiencia de reserva.
 * El estado interactivo permanece en ReservasForm para que la página pueda
 * conservar la estructura común del sitio público.
 */
export default function ReservarPage() {
    return (
        <>
            {/* El encabezado permite volver a las secciones principales del sitio. */}
            <Header />
            <main>
                {/* El formulario administra las cuatro etapas y la confirmación de la cita. */}
                <ReservasForm />
            </main>
            {/* El pie de página mantiene la misma presentación que el resto de páginas públicas. */}
            <Footer />
        </>
    );
}
