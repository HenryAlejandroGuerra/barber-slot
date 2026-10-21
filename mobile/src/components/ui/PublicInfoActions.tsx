import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { COLORS, RADIUS, SPACING } from "@/constants/theme";

export default function PublicInfoActions() {
    return (
        <View style={styles.actions}>
            <PrimaryButton href="/reservar" style={styles.reserve}>
                Solicitar reserva
            </PrimaryButton>
            <Link href="/" asChild>
                <Pressable style={styles.home}>
                    <Text style={styles.homeText}>Volver al inicio</Text>
                </Pressable>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    actions: { marginTop: SPACING.xl, gap: SPACING.md },
    reserve: { alignSelf: "stretch" },
    home: {
        minHeight: 48,
        padding: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.gold,
        borderRadius: RADIUS.pill,
        alignItems: "center",
        justifyContent: "center"
    },
    homeText: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 16,
        color: COLORS.black
    }
});