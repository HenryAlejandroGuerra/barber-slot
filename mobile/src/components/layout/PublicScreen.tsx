/* =====================================================
    mobile/src/components/layout/PublicScreen.tsx
    Contenedor general para las pantallas públicas, con scroll y ajuste automático frente al teclado.
===================================================== */
import { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/theme";

export default function PublicScreen({children}: {children: ReactNode;}) {
    return (
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
                    {children}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.publicHeader
    },
    keyboard: {
        flex: 1
    },
    scroll: {
        flex: 1,
        backgroundColor: COLORS.publicBackground
    },
    content: {
        flexGrow: 1
    }
});
