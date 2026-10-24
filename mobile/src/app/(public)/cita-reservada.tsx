import { Redirect, router } from "expo-router";
import { Text } from "react-native";
import ReservaLayout, { ReservaButton, styles } from "@/components/reservas/ReservaLayout";
import { useReserva } from "@/components/reservas/ReservaContext";
import ResumenReserva from "@/components/reservas/ResumenReserva";

export default function CitaReservadaScreen() {
    const r = useReserva();
    if (!r.confirmada) return <Redirect href="/reservar" />;
    return <ReservaLayout paso={4} title="¡Cita reservada!">
        <Text style={[styles.heading, { textAlign: "center", color: "#15803D" }]}>Tu cita quedó registrada</Text>
        {r.citaCreada && <Text style={styles.text}>Número de cita: {r.citaCreada.id}</Text>}
        <Text style={styles.text}>La cita se registró correctamente. Estos son los detalles:</Text>
        <ResumenReserva />
        <ReservaButton title="Volver al inicio" onPress={() => { r.reiniciar(); router.replace("/"); }} />
        <ReservaButton title="Nueva reserva" secondary onPress={() => { r.reiniciar(); router.replace("/reservar"); }} />
    </ReservaLayout>;
}
