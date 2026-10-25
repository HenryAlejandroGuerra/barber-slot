/* ================================================
    mobile/src/components/layout/PublicFooter.tsx
================================================ */
import { Image, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, SPACING } from "@/constants/theme";
import { IMAGES } from "@/constants/images";

const socialLinks = [
    { name: "Facebook", icon: IMAGES.social.facebook },
    { name: "WhatsApp", icon: IMAGES.social.whatsapp },
    { name: "Instagram", icon: IMAGES.social.instagram }
];

export default function PublicFooter() {
    const { bottom } = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingBottom: SPACING.lg + bottom }]}>
            <Text style={styles.schedule}>
                Lun-sab 9:00am-5:00pm, Santa Tecla
            </Text>

            <View style={styles.social}>
                {socialLinks.map((social) => (
                    <Image key={social.name} source={social.icon} style={styles.icon} resizeMode="contain" accessibilityLabel={social.name} />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        gap: SPACING.md,
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.lg,
        backgroundColor: COLORS.footer
    },
    schedule: {
        textAlign: "center",
        fontFamily: "Montserrat_700Bold",
        fontSize: 14,
        color: COLORS.black
    },
    social: {
        flexDirection: "row",
        gap: SPACING.md
    },
    icon: {
        width: 40,
        height: 40
    }
});
