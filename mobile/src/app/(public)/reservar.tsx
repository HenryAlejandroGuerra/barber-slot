import { Image, Pressable, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import ReservaLayout, { ReservaButton, styles } from "@/components/reservas/ReservaLayout";
import { useReserva } from "@/components/reservas/ReservaContext";
import { barberoService } from "@/services/barbero.service";
import type { Barbero } from "@/types/barbero";
import { resolverImagenBarbero } from "@/constants/images";
import type { ImageSourcePropType } from "react-native";

export default function ReservarScreen() {
    const r = useReserva();
    const { confirmada, reiniciar } = r;
    const guardarBarberos = r.setBarberos;
    const [cargando, setCargando] = useState(r.barberos.length === 0);
    const [error, setError] = useState("");

    useEffect(() => {
        let activa = true;
        barberoService.obtenerDisponibles()
            .then((barberos) => {
                if (activa) guardarBarberos(barberos);
            })
            .catch((motivo: unknown) => {
                if (activa) setError(motivo instanceof Error ? motivo.message : "No se pudieron cargar los barberos.");
            })
            .finally(() => {
                if (activa) setCargando(false);
            });
        return () => { activa = false; };
    }, [guardarBarberos]);

    useFocusEffect(useCallback(() => {
        if (confirmada) reiniciar();
    }, [confirmada, reiniciar]));
    return <ReservaLayout paso={1} title="Elige tu barbero">
        {cargando && <Text style={styles.text}>Cargando barberos disponibles...</Text>}
        {Boolean(error) && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
        {!cargando && !error && r.barberos.length === 0 && <Text style={styles.text}>No hay barberos disponibles en este momento.</Text>}
        {r.barberos.map((b: Barbero) => {
            const imagen = resolverImagenBarbero(b.imagenUrl) as ImageSourcePropType | undefined;
            const seleccionado = r.barberoId === b.id;
            return <Pressable key={b.id} accessibilityRole="radio" accessibilityState={{ checked: r.barberoId === b.id }}
                onPress={() => { if (r.barberoId !== b.id) r.setHoraSeleccionada(null); r.setBarberoId(b.id); }}
                style={[styles.option, seleccionado && styles.selected]}>
                {imagen && <Image source={imagen} style={{ width: "100%", height: seleccionado ? 340 : 260, borderRadius: 12, backgroundColor: "#F1F1F1" }} resizeMode="contain" />}
                <Text style={styles.heading}>{b.nombre}</Text>
                <Text style={[styles.text, seleccionado && { color: "#8A5B00", fontFamily: "Montserrat_700Bold" }]}>{b.especialidad}</Text>
            </Pressable>;
        })}
        <View style={styles.row}>
            <ReservaButton title="Inicio" secondary onPress={() => router.replace("/")} />
            <ReservaButton title="Siguiente" disabled={!r.barberoId || cargando || Boolean(error)} onPress={() => router.push("/servicios")} />
        </View>
    </ReservaLayout>;
}
