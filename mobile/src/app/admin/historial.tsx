/* =====================================================
    mobile/src/app/admin/historial.tsx
    Muestra el historial de reservas almacenadas en Firestore para el usuario autenticado.
===================================================== */
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import AdminScreen from "@/components/admin/AdminScreen";
import BrandHeader from "@/components/layout/BrandHeader";
import { reservaFirestoreService, type ReservaHistorial } from "@/services/reservaFirestore.service";
import { COLORS, RADIUS, SPACING } from "@/constants/theme";

export default function HistorialScreen() {
    const [reservas, setReservas] = useState<ReservaHistorial[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useFocusEffect(useCallback(() => {
        let activa = true;

        async function cargarReservas() {
            setCargando(true);
            setError("");

            try {
                const resultado = await reservaFirestoreService.obtenerReservas();

                if (activa) {
                    setReservas(resultado);
                }
            } catch (motivo) {
                if (activa) {
                    setError(motivo instanceof Error ? motivo.message : "No se pudo cargar el historial.");
                }
            } finally {
                if (activa) {
                    setCargando(false);
                }
            }
        }

        cargarReservas();

        return () => {activa = false;};
    }, []));

    return (
        <AdminScreen>
            <BrandHeader />
            <View style={styles.content}>
                <Text style={styles.title}>
                    Historial de reservas
                </Text>

                <Text style={styles.subtitle}>
                    Reservas almacenadas en Firestore para el usuario autenticado.
                </Text>

                {cargando && (
                    <Text style={styles.message}>
                        Cargando reservas...
                    </Text>
                )}

                {Boolean(error) && (
                    <Text style={styles.error}>
                        {error}
                    </Text>
                )}

                {!cargando && !error && reservas.length === 0 && (
                    <Text style={styles.message}>
                        No hay reservas registradas.
                    </Text>
                )}

                {reservas.map((reserva) => (
                    <View key={reserva.citaId} style={styles.card}>
                        <Text style={styles.service}>
                            {reserva.servicioNombre}
                        </Text>

                        <Text style={styles.detail}>
                            Barbero:{" "}
                            {reserva.barberoNombre}
                        </Text>

                        <Text style={styles.detail}>
                            Fecha: {reserva.fecha}
                        </Text>

                        <Text style={styles.detail}>
                            Hora: {reserva.hora}
                        </Text>

                        <Text style={styles.detail}>
                            Estado:{" "}
                            {reserva.estado}
                        </Text>

                        <Text style={styles.id}>
                            ID: {reserva.citaId}
                        </Text>
                    </View>
                ))}

                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backText}>
                        ← Regresar
                    </Text>
                </Pressable>
            </View>
        </AdminScreen>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: SPACING.lg,
        gap: SPACING.md
    },
    title: {
        fontFamily: "Montserrat_800ExtraBold",
        fontSize: 28,
        color: COLORS.white
    },
    subtitle: {
        fontFamily: "Montserrat_400Regular",
        fontSize: 14,
        lineHeight: 21,
        color: COLORS.textSecondary
    },
    message: {
        marginTop: SPACING.md,
        fontFamily: "Montserrat_500Medium",
        color: COLORS.textPrimary
    },
    error: {
        fontFamily: "Montserrat_500Medium",
        color: COLORS.danger
    },
    card: {
        padding: SPACING.lg,
        gap: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.adminBorder,
        borderRadius: RADIUS.lg,
        backgroundColor: COLORS.adminHeader
    },
    service: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 18,
        color: COLORS.gold
    },
    detail: {
        fontFamily: "Montserrat_400Regular",
        fontSize: 14,
        color: COLORS.textPrimary
    },
    id: {
        marginTop: SPACING.sm,
        fontFamily: "Montserrat_400Regular",
        fontSize: 10,
        color: COLORS.textSecondary
    },
    backButton: {
        marginTop: SPACING.md,
        alignSelf: "flex-start"
    },
    backText: {
        fontFamily: "Montserrat_600SemiBold",
        color: COLORS.gold
    }
});
