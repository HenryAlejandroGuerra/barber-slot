import { StyleSheet, Text, View } from "react-native";
import PublicScreen from "@/components/layout/PublicScreen";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import PublicInfoActions from "@/components/ui/PublicInfoActions";
import { COLORS, RADIUS, SPACING } from "@/constants/theme";

const servicios = [
    {
        nombre: "Afeitado Clásico", duracion: 10, precio: "$2",
        descripcion: "Un afeitado al ras con acabado suave y preciso para un rostro fresco y cuidado."
    },
    {
        nombre: "Corte y Barba", duracion: 45, precio: "$8",
        descripcion: "Renueva tu estilo con un corte de cabello y una barba perfilada que se complementan."
    },
    {
        nombre: "Solo Barba", duracion: 15, precio: "$3",
        descripcion: "Recorte y definición de tu barba para mantener su forma y un aspecto impecable."
    },
    {
        nombre: "Solo Corte", duracion: 30, precio: "$5",
        descripcion: "Un corte de cabello a tu medida, con atención a los detalles y a tu estilo personal."
    }
];

export default function ServiciosScreen() {
    return (
        <PublicScreen>
            <PublicHeader />
            <View style={styles.section}>
                <Text accessibilityRole="header" style={styles.title}>Nuestros servicios</Text>
                <Text style={styles.subtitle}>
                    El cuidado que mereces, con la precisión y el estilo de BarberSlot.
                </Text>
                <View style={styles.grid}>
                    {servicios.map((servicio) => (
                        <View key={servicio.nombre} style={styles.card}>
                            <Text accessibilityRole="header" style={styles.name}>{servicio.nombre}</Text>
                            <Text style={styles.description}>{servicio.descripcion}</Text>
                            <View style={styles.details}>
                                <Text style={styles.duration}>Duración aproximada: {servicio.duracion} min</Text>
                                <Text accessibilityLabel={`${servicio.precio.slice(1)} dólares`} style={styles.price}>
                                    {servicio.precio}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
                <Text style={styles.note}>Las duraciones son aproximadas. Elige tu servicio al solicitar una reserva.</Text>
                <PublicInfoActions />
            </View>
            <PublicFooter />
        </PublicScreen>
    );
}

const styles = StyleSheet.create({
    section: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.xl },
    title: {
        textAlign: "center", fontFamily: "Montserrat_800ExtraBold",
        fontSize: 28, color: COLORS.gold
    },
    subtitle: {
        marginTop: SPACING.md, textAlign: "center", fontFamily: "Montserrat_600SemiBold",
        fontSize: 15, lineHeight: 22, color: COLORS.black
    },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.md, marginTop: SPACING.xl },
    card: {
        flexBasis: 260, flexGrow: 1, flexShrink: 1,
        padding: SPACING.lg, borderRadius: RADIUS.lg, backgroundColor: COLORS.adminBackground
    },
    name: { fontFamily: "Montserrat_700Bold", fontSize: 20, color: COLORS.gold },
    description: {
        marginTop: SPACING.sm, fontFamily: "Montserrat_400Regular",
        fontSize: 14, lineHeight: 22, color: COLORS.textPrimary
    },
    details: {
        marginTop: SPACING.lg, paddingTop: SPACING.md, borderTopWidth: 1,
        borderTopColor: COLORS.adminBorder, flexDirection: "row", flexWrap: "wrap",
        alignItems: "center", justifyContent: "space-between", gap: SPACING.sm
    },
    duration: {
        flexShrink: 1, fontFamily: "Montserrat_500Medium",
        fontSize: 13, lineHeight: 20, color: COLORS.textPrimary
    },
    price: { fontFamily: "Montserrat_800ExtraBold", fontSize: 28, color: COLORS.gold },
    note: {
        marginTop: SPACING.md, textAlign: "center", fontFamily: "Montserrat_400Regular",
        fontSize: 13, lineHeight: 20, color: COLORS.textDark
    }
});
