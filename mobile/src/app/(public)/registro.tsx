/* ================================================
    mobile/src/app/(public)/registro.tsx
    Registro
================================================ */
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "@/constants/theme";

export default function AgendaScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Registro
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.white
    },
    text: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 26,
        color: COLORS.gold
    },
});
