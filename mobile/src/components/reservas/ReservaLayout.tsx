import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import PublicScreen from "@/components/layout/PublicScreen";
import BrandHeader from "@/components/layout/BrandHeader";
import { COLORS, RADIUS } from "@/constants/theme";

export function ReservaButton({ title, onPress, disabled = false, secondary = false }: {
    title: string; onPress: () => void; disabled?: boolean; secondary?: boolean;
}) {
    return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled}
        onPress={onPress} style={[styles.button, secondary && styles.secondary, disabled && styles.disabled]}>
        <Text style={styles.buttonText}>{title}</Text>
    </Pressable>;
}
export default function ReservaLayout({ paso, title, children }: { paso: number; title: string; children: ReactNode }) {
    return <PublicScreen><BrandHeader />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.content}>
                <Text style={styles.eyebrow}>RESERVA TU CITA</Text>
                <Text accessibilityRole="header" style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>Completa los pasos para agendar una experiencia hecha para ti.</Text>
                <View style={styles.steps} accessibilityLabel={'Paso ' + paso + ' de 4'}>
                    {["Barbero", "Servicio", "Horario", "Datos"].map((label, i) =>
                        <View key={label} style={styles.step}>
                            <View style={[styles.circle, i < paso && styles.active]}><Text style={styles.number}>{i + 1}</Text></View>
                            <Text style={styles.stepLabel}>{label}</Text>
                        </View>)}
                </View>
                <View style={styles.card}>{children}</View>
            </View>
        </KeyboardAvoidingView>
    </PublicScreen>;
}
export const styles = StyleSheet.create({
    content: { padding: 20, paddingBottom: 48, gap: 16 },
    eyebrow: { color: COLORS.gold, textAlign: "center", letterSpacing: 3, fontFamily: "Montserrat_700Bold", fontSize: 12 },
    title: { fontSize: 28, fontFamily: "Montserrat_800ExtraBold", textAlign: "center", color: COLORS.black },
    subtitle: { color: "#656565", fontFamily: "Montserrat_400Regular", textAlign: "center", lineHeight: 21, fontSize: 13 },
    steps: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10 },
    step: { alignItems: "center", gap: 6 },
    circle: { borderRadius: 18, width: 36, height: 36, backgroundColor: "#ECEDEF", justifyContent: "center", alignItems: "center" },
    active: { backgroundColor: COLORS.gold },
    number: { fontFamily: "Montserrat_700Bold", color: COLORS.black },
    stepLabel: { fontSize: 11, color: "#656565" },
    card: { padding: 18, gap: 16, backgroundColor: COLORS.white, borderWidth: 1, borderColor: "#E1E3E7", borderRadius: RADIUS.lg },
    option: { padding: 18, gap: 8, borderWidth: 1, borderColor: "#E1E3E7", borderRadius: RADIUS.md },
    selected: { borderColor: COLORS.gold, backgroundColor: "#FFF7E7" },
    heading: { fontFamily: "Montserrat_700Bold", fontSize: 17, color: COLORS.black },
    text: { fontFamily: "Montserrat_400Regular", fontSize: 14, lineHeight: 22, color: "#555555" },
    row: { flexDirection: "row", gap: 12 },
    button: { flexGrow: 1, minHeight: 52, padding: 14, backgroundColor: COLORS.gold, borderRadius: RADIUS.md, alignItems: "center", justifyContent: "center" },
    secondary: { backgroundColor: "#11151D" },
    disabled: { opacity: 0.45 },
    buttonText: { color: COLORS.white, fontFamily: "Montserrat_700Bold", fontSize: 15 },
    input: { borderWidth: 1, borderColor: "#D9DDE3", borderRadius: RADIUS.md, minHeight: 50, padding: 14, color: COLORS.black, fontFamily: "Montserrat_500Medium" },
    error: { color: "#B42318", fontSize: 14 },
});
