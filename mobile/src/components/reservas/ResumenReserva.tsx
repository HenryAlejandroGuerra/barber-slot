import { Text, View } from "react-native";
import { useReserva } from "./ReservaContext";
import { styles } from "./ReservaLayout";

export default function ResumenReserva() {
    const r = useReserva();
    const barbero = r.barberos.find(b => b.id === r.barberoId);
    const servicio = r.servicios.find(s => s.id === r.servicioSeleccionado);
    return <View style={styles.option}>
        <Text accessibilityRole="header" style={styles.heading}>Resumen de tu cita</Text>
        {[
            ["Barbero", barbero?.nombre], ["Servicio", servicio?.nombre],
            ["Duración", servicio ? servicio.duracionMinutos + " min" : ""],
            ["Total", servicio ? "$" + servicio.precio.toFixed(2) : ""],
            ["Fecha", r.fecha], ["Hora", r.horaSeleccionada],
            ["Nombre", r.nombre.trim()], ["Correo electrónico", r.correo.trim()], ["Teléfono", r.telefono.trim()],
        ].map(([label, value]) => <Text key={label} style={styles.text}>{label}: {value || "Por completar"}</Text>)}
    </View>;
}
