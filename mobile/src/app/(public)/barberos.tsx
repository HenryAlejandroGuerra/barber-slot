/* ================================================
    mobile/src/app/(public)/barberos.tsx
    Página para visualizar barberos disponibles
================================================ */
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import PublicScreen from "@/components/layout/PublicScreen";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import PrimaryButton from "@/components/ui/PrimaryButton";
import BarberoCard from "@/components/barberos/BarberoCard";
import { barberoService } from "@/services/barbero.service";
import type { Barbero } from "@/types/barbero";
import { COLORS, SPACING } from "@/constants/theme";

export default function BarberosScreen() {
    const [barberos, setBarberos] = useState<Barbero[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const { width } = useWindowDimensions();

    useEffect(() => {
        barberoService
            .obtenerDisponibles()
            .then(setBarberos)
            .catch(() => setError("No se pudieron cargar los barberos. Intenta de nuevo más tarde."))
            .finally(() => setCargando(false));
    }, []);

    // ponytail: columnas = cuántas tarjetas de ~150pt caben en el ancho disponible,
    // en vez de breakpoints fijos pensados para web — así se adapta a cualquier
    // tamaño de teléfono/tablet en vez de quedar forzado a 1 columna en celulares.
    const anchoDisponible = width - SPACING.lg * 2;
    const columnas = Math.max(1, Math.min(4, Math.floor(anchoDisponible / 150)));

    return (
        <PublicScreen>
            <PublicHeader />

            <View style={styles.section}>
                <Text style={styles.title}>Nuestro equipo</Text>

                <Text style={styles.subtitle}>
                    Cada uno tiene una historia que contarte, un regalo, una convicción
                    que darte.
                </Text>

                {cargando && (
                    <Text style={styles.estado}>Cargando barberos...</Text>
                )}

                {!cargando && Boolean(error) && (
                    <Text style={[styles.estado, styles.estadoError]}>{error}</Text>
                )}

                {!cargando && !error && barberos.length === 0 && (
                    <Text style={styles.estado}>No hay barberos disponibles por el momento.</Text>
                )}

                {!cargando && barberos.length > 0 && (
                    <FlatList key={columnas} data={barberos} keyExtractor={(barbero) => barbero.id} numColumns={columnas}
                        scrollEnabled={false} columnWrapperStyle={columnas > 1 ? styles.fila : undefined}
                        contentContainerStyle={styles.grid} renderItem={({ item }) => <BarberoCard barbero={item} />} />
                )}

                <PrimaryButton href="/reservar" style={styles.cta}>
                    Reservar cita
                </PrimaryButton>
            </View>

            <PublicFooter />
        </PublicScreen>
    );
}

const styles = StyleSheet.create({
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
    estado: {
        marginTop: SPACING.xl,
        textAlign: "center",
        fontFamily: "Montserrat_600SemiBold",
        fontSize: 16,
        color: COLORS.black
    },
    estadoError: {
        color: COLORS.danger
    },
    grid: {
        marginTop: SPACING.xl,
        gap: SPACING.md
    },
    fila: {
        gap: SPACING.md
    },
    cta: {
        marginTop: SPACING.xl
    }
});
