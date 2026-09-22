import ReservasForm from "@/components/reservas/ReservasForm";

/*
 * Esta ruta funciona como contenedor de la experiencia de reserva.
 * El estado interactivo permanece en ReservasForm para que la página pueda
 * conservar la estructura común del sitio público.
 */
export default function ReservarPage() {
    return <ReservasForm />;
}
