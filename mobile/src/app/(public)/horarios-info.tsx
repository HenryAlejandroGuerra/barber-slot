import { Image, StyleSheet, Text, View } from "react-native";
import PublicScreen from "@/components/layout/PublicScreen";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import PublicInfoActions from "@/components/ui/PublicInfoActions";
import { IMAGES } from "@/constants/images";
import { COLORS, RADIUS, SPACING } from "@/constants/theme";

export default function HorariosScreen() {
    return (
        <PublicScreen>
            <PublicHeader />
            <View style={styles.section}>
                <Text accessibilityRole="header" style={styles.title}>Nuestros horarios</Text>
                <Text style={styles.subtitle}>Tu próximo estilo te espera en Santa Tecla.</Text>
                <Image
                    source={IMAGES.horarios.barberia}
                    style={styles.image}
                    resizeMode="cover"
                    accessibilityLabel="Interior de la barbería BarberSlot"
                />
                <View style={styles.card}>
                    <Text accessibilityRole="header" style={styles.cardTitle}>Horario de atención</Text>
                    <View style={styles.schedule}>
                        <Text style={styles.days}>Lunes a sábado</Text>
                        <Text style={styles.time}>9:00 a. m. – 5:00 p. m.</Text>
                    </View>
                    <Text style={styles.note}>
                        Planifica tu visita dentro de nuestro horario de atención y solicita tu reserva.
                    </Text>
                </View>
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
    image: { width: "100%", height: 150, borderRadius: RADIUS.lg, marginTop: SPACING.lg },
    card: {
        marginTop: SPACING.lg, padding: SPACING.lg,
        borderRadius: RADIUS.lg, backgroundColor: COLORS.adminBackground
    },
    cardTitle: { fontFamily: "Montserrat_700Bold", fontSize: 20, color: COLORS.gold },
    schedule: {
        marginTop: SPACING.lg, paddingVertical: SPACING.md,
        borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.adminBorder, gap: SPACING.sm
    },
    days: { fontFamily: "Montserrat_600SemiBold", fontSize: 16, color: COLORS.textPrimary },
    time: { fontFamily: "Montserrat_700Bold", fontSize: 22, color: COLORS.gold },
    note: {
        marginTop: SPACING.md, fontFamily: "Montserrat_400Regular",
        fontSize: 14, lineHeight: 22, color: COLORS.textPrimary
    }
});
