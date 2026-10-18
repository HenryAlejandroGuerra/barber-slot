/* =====================================================
    mobile/src/components/admin/DashboardCard.tsx
    Tarjeta reutilizable para mostrar métricas del dashboard administrativo.
===================================================== */
import { Image, ImageSourcePropType, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS } from "@/constants/theme";

interface DashboardCardProps {
    titulo: string;
    valor: number;
    icono: ImageSourcePropType;
}

export default function DashboardCard({titulo, valor, icono}: DashboardCardProps) {
    return (
        <View style={styles.card}>
            <Image source={icono} style={styles.icon} resizeMode="contain" />
            <Text style={styles.title}>
                {titulo}
            </Text>
            <Text style={styles.value}>
                {valor}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "48%",
        minHeight: 150,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.adminBorder,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.adminSurface
    },
    icon: {
        width: 38,
        height: 38
    },
    title: {
        marginTop: 12,
        fontFamily: "Montserrat_600SemiBold",
        fontSize: 13,
        color: COLORS.textSecondary
    },
    value: {
        marginTop: 6,
        fontFamily: "Montserrat_800ExtraBold",
        fontSize: 34,
        color: COLORS.white
    }
});
