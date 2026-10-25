/* =====================================================
    mobile/src/components/admin/AdminScreen.tsx
===================================================== */
import { ReactNode } from "react";
import { ScrollView, StyleSheet } from "react-native";
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
                {children}
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" >
                {children}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.adminBackground
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
