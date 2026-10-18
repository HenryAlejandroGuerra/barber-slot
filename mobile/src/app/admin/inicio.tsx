/* ================================================
    mobile/src/app/admin/index.tsx
    Inicio de la administrativa
================================================ */
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { COLORS } from "@/constants/theme";

export default function AdminInicioScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Inicio
            </Text>

            <Pressable style={styles.card} onPress={() => router.push("/admin/agenda")}>
                <Text style={styles.cardText}>
                    Agenda Diaria
                </Text>
            </Pressable>

            <Pressable style={styles.card} onPress={() => router.push("/admin/servicios")}>
                <Text style={styles.cardText}>
                    Servicios
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: COLORS.adminBackground
    },
    title: {
        marginTop: 70,
        marginBottom: 40,
        textAlign: "center",
        fontFamily: "Montserrat_800ExtraBold",
        fontSize: 32,
        color: COLORS.gold
    },
    card: {
        marginBottom: 24,
        paddingVertical: 30,
        paddingHorizontal: 20,
        borderRadius: 24,
        backgroundColor: COLORS.adminBackground
    },
    cardText: {
        textAlign: "center",
        fontFamily: "Montserrat_700Bold",
        fontSize: 18,
        color: COLORS.gold
    },
});
