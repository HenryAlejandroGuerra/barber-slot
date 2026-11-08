/* =====================================================
    mobile/src/components/admin/AdminScreen.tsx
    Contenedor general para pantallas administrativas, con soporte de scroll y teclado en formularios.
===================================================== */
import { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/theme";

interface AdminScreenProps {
    children: ReactNode;
    scroll?: boolean;
}

export default function AdminScreen({children, scroll = true}: AdminScreenProps) {
    if (!scroll) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    {children}
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
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
        backgroundColor: COLORS.adminBackground
    },
    keyboard: {
        flex: 1
    },
    scroll: {
        flex: 1,
        backgroundColor: COLORS.adminBackground
    },
    content: {
        flexGrow: 1,
        paddingBottom: 32
    }
});
