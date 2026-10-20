/* =====================================================
    mobile/src/components/barberos/BarberoCard.tsx
===================================================== */
import { Image, StyleSheet, Text, View } from "react-native";
import type { Barbero } from "@/types/barbero";
import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { resolverImagenBarbero } from "@/constants/images";

function calcularIniciales(nombre: string): string {
    return nombre
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((palabra) => palabra[0]?.toUpperCase() ?? "")
        .join("");
}

export default function BarberoCard({ barbero }: { barbero: Barbero }) {
    const imagen = resolverImagenBarbero(barbero.imagenUrl);

    return (
        <View style={styles.card}>
            {/* El marco fija la proporción; si el Image la llevara, RN usaría el alto real del archivo. */}
            <View style={styles.photoFrame}>
                {imagen ? (
                    <Image source={imagen} style={styles.photo} resizeMode="cover" />
                ) : (
                    <Text style={styles.photoFallbackText}>
                        {calcularIniciales(barbero.nombre)}
                    </Text>
                )}
            </View>

            <View style={styles.info}>
                <Text style={styles.nombre} numberOfLines={2}>{barbero.nombre}</Text>
                <Text style={styles.especialidad} numberOfLines={2}>{barbero.especialidad}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        overflow: "hidden",
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        backgroundColor: COLORS.white
    },
    photoFrame: {
        width: "100%",
        aspectRatio: 1,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.adminBackground
    },
    photo: {
        width: "100%",
        height: "100%"
    },
    photoFallbackText: {
        fontFamily: "Montserrat_800ExtraBold",
        fontSize: 28,
        color: COLORS.gold
    },
    info: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm + SPACING.xs
    },
    nombre: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 15,
        lineHeight: 20,
        color: COLORS.black
    },
    especialidad: {
        marginTop: SPACING.xs,
        fontFamily: "Montserrat_500Medium",
        fontSize: 13,
        lineHeight: 18,
        color: COLORS.textSecondary
    }
});
