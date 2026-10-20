/* ================================================
    mobile/src/app/(public)/index.tsx
    Index de la parte pública
================================================ */
import { Image, StyleSheet, Text, View } from "react-native";
import PublicScreen from "@/components/layout/PublicScreen";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import PrimaryButton from "@/components/ui/PrimaryButton";
import PrincipleCard from "@/components/ui/PrincipleCard";
import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { IMAGES } from "@/constants/images";

const principles = [
    {
        title: "Profesionalismo",
        description: "Cada personal en nuestra barbería está altamente capacitado para cada corte."
    },
    {
        title: "Perfección",
        description: "Porque no solo queda bien, sino queda perfecto."
    },
    {
        title: "Buen precio",
        description: "Porque verte bien no es caro."
    }
];

export default function LandingScreen() {
    return (
        <PublicScreen>
            <PublicHeader />

            <View style={styles.heroFrame}>
                <Image source={IMAGES.home.hero} style={styles.hero} resizeMode="cover" />
            </View>

            <View style={styles.section}>
                <Text style={styles.title}>Nuestros principios</Text>

                <Text style={styles.subtitle}>
                    Cada corte es hecho por profesionales altamente calificados y
                    aptos para darte el cuidado que mereces.
                </Text>

                <PrimaryButton href="/reservar" style={styles.cta}>
                    Reservar cita
                </PrimaryButton>

                <View style={styles.principles}>
                    {principles.map((principle) => (
                        <PrincipleCard key={principle.title} title={principle.title} description={principle.description} />
                    ))}
                </View>
            </View>

            <PublicFooter />
        </PublicScreen>
    );
}

const styles = StyleSheet.create({
    heroFrame: {
        marginHorizontal: SPACING.lg,
        marginTop: SPACING.lg,
        aspectRatio: 4 / 3,
        maxHeight: 390,
        overflow: "hidden",
        borderRadius: RADIUS.lg
    },
    hero: {
        width: "100%",
        height: "100%"
    },
    section: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.xl
    },
    title: {
        textAlign: "center",
        fontFamily: "Montserrat_800ExtraBold",
        fontSize: 28,
        color: COLORS.gold
    },
    subtitle: {
        marginTop: SPACING.md,
        textAlign: "center",
        fontFamily: "Montserrat_600SemiBold",
        fontSize: 15,
        lineHeight: 22,
        color: COLORS.black
    },
    cta: {
        marginTop: SPACING.lg
    },
    principles: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: SPACING.md,
        marginTop: SPACING.xl
    }
});
