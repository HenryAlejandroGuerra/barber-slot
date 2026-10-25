/* ================================================
    mobile/src/app/admin/agenda.tsx
    Agenda Diaria de la administrativa
================================================ */
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "@/constants/theme";

export default function AgendaScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Agenda Diaria
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.adminBackground
    },
    text: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 26,
        color: COLORS.gold
    },
});
