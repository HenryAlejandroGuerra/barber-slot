/* ================================================
    mobile/src/components/layout/PublicHeader.tsx
    Encabezado de la parte pública: logo + reservar / navegación
================================================ */
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Link, usePathname } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { COLORS, SPACING } from "@/constants/theme";
import { IMAGES } from "@/constants/images";

const navigation = [
    { label: "Inicio", href: "/" as const },
    { label: "Barberos", href: "/barberos" as const }
];

export default function PublicHeader() {
    const pathname = usePathname();

    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <Link href="/" asChild>
                    <Pressable accessibilityLabel="Ir al inicio">
                        <Image source={IMAGES.brand.logoFull} style={styles.logo} resizeMode="contain" />
                    </Pressable>
                </Link>

                <PrimaryButton href="/reservar" compact>
                    Reservar cita
                </PrimaryButton>
            </View>

            <View style={styles.nav}>
                {navigation.map((item) => {
                    const activo = pathname === item.href;

                    return (
                        <Link key={item.href} href={item.href} asChild>
                            <Pressable style={styles.navItem}>
                                <Text style={[styles.navLink, activo && styles.navLinkActive]}>
                                    {item.label}
                                </Text>
                                <View style={[styles.indicator, activo && styles.indicatorActive]} />
                            </Pressable>
                        </Link>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.publicHeader,
        paddingHorizontal: SPACING.lg
    },
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: SPACING.md,
        paddingVertical: SPACING.md
    },
    logo: {
        width: 150,
        height: 41
    },
    nav: {
        flexDirection: "row",
        gap: SPACING.lg
    },
    navItem: {
        paddingTop: SPACING.xs
    },
    navLink: {
        fontFamily: "Montserrat_600SemiBold",
        fontSize: 15,
        color: COLORS.textPrimary
    },
    navLinkActive: {
        color: COLORS.gold
    },
    indicator: {
        marginTop: SPACING.sm,
        height: 3,
        borderRadius: 2,
        backgroundColor: "transparent"
    },
    indicatorActive: {
        backgroundColor: COLORS.gold
    }
});
