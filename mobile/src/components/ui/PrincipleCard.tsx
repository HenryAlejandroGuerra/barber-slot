/* ================================================
    mobile/src/components/ui/PrincipleCard.tsx
    Tarjeta oscura (equivalente a .card-dark en web)
================================================ */
import { StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "@/constants/theme";

interface PrincipleCardProps {
    title: string;
    description: string;
}

export default function PrincipleCard({title, description}: PrincipleCardProps) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        // Base 240 + shrink: 1 por fila en celular, varias en tablet, y el texto envuelve.
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 240,
        borderRadius: RADIUS.lg,
        backgroundColor: COLORS.adminBackground,
        padding: SPACING.lg
    },
    title: {
        marginBottom: SPACING.sm,
        fontFamily: "Montserrat_700Bold",
        fontSize: 18,
        color: COLORS.gold
    },
    description: {
        fontFamily: "Montserrat_600SemiBold",
        fontSize: 14,
        lineHeight: 20,
        color: COLORS.textPrimary
    }
});
