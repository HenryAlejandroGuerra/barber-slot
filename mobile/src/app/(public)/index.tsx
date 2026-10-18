/* ================================================
    mobile/src/app/(public)/index.tsx
    Index de la parte pública
================================================ */
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { COLORS } from "@/constants/theme";

export default function LandingScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.logo}>
                Barber
                <Text style={styles.logoGold}>
                    Slot
                </Text>
            </Text>

            <Text style={styles.title}>
                BarberSlot Mobile
            </Text>

            <Pressable style={styles.button} onPress={() => router.push("/reservar")} >
                <Text style={styles.buttonText}>
                    Reservar
                </Text>
            </Pressable>

            <Text style={styles.adminQuestion}>
                ¿Eres administrador?
            </Text>

            <Pressable onPress={() => router.push("/admin")}>
                <Text style={styles.adminLink}>
                    Iniciar Sesión
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        backgroundColor: COLORS.publicBackground
    },
    logo: {
        fontFamily: "Montserrat_800ExtraBold",
        fontSize: 40,
        color: COLORS.black
    },
    logoGold: {
        color: COLORS.gold
    },
    title: {
        marginTop: 24,
        fontFamily: "Montserrat_600SemiBold",
        fontSize: 20,
        color: COLORS.textDark
    },
    button: {
        marginTop: 40,
        width: "100%",
        paddingVertical: 16,
        borderRadius: 999,
        alignItems: "center",
        backgroundColor: COLORS.gold
    },
    buttonText: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 18,
        color: COLORS.black
    },
    adminAccess: {
        marginTop: 60,
        alignItems: "center"
    },
    adminQuestion: {
        fontFamily: "Montserrat_600SemiBold",
        fontSize: 16,
        color: COLORS.textSecondary
    },
    adminLink: {
        marginTop: 10,
        fontFamily: "Montserrat_500Medium",
        fontSize: 14,
        color: COLORS.gold
    }
});
