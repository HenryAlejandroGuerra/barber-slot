/* =====================================================
    mobile/src/components/layout/PublicScreen.tsx
===================================================== */
import { ReactNode } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/theme";

export default function PublicScreen({children}: {children: ReactNode}) {
    return (
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} >
                {children}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.publicHeader
    },
    scroll: {
        flex: 1,
        backgroundColor: COLORS.publicBackground
    },
    content: {
        flexGrow: 1
    }
});
