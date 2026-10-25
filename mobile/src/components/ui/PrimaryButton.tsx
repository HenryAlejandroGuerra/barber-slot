/* ================================================
    mobile/src/components/ui/PrimaryButton.tsx
    Botón primario dorado (equivalente a .btn-primary en web)
================================================ */
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { Link, type Href } from "expo-router";
import { COLORS, RADIUS, SPACING } from "@/constants/theme";

interface PrimaryButtonProps {
    children: string;
    href?: Href;
    onPress?: () => void;
    compact?: boolean;
    style?: ViewStyle;
}

export default function PrimaryButton({children, href, onPress, compact = false, style}: PrimaryButtonProps) {
    const buttonStyle = StyleSheet.flatten([styles.button, compact && styles.buttonCompact, style]);
    const textStyle = [styles.text, compact && styles.textCompact];

    if (href) {
        return (
            <Link href={href} asChild>
                <Pressable style={buttonStyle}>
                    <Text style={textStyle}>{children}</Text>
                </Pressable>
            </Link>
        );
    }

    return (
        <Pressable style={buttonStyle} onPress={onPress}>
            <Text style={textStyle}>{children}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        alignSelf: "center",
        minHeight: 48,
        paddingHorizontal: SPACING.xl,
        borderRadius: RADIUS.pill,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.gold
    },
    buttonCompact: {
        minHeight: 36,
        paddingHorizontal: SPACING.md
    },
    text: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 16,
        color: COLORS.white
    },
    textCompact: {
        fontSize: 13
    }
});
