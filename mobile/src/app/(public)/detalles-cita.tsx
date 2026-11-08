import { useState } from "react";
import { Redirect, router } from "expo-router";
import { Text, TextInput, View } from "react-native";
import ReservaLayout, { ReservaButton, styles } from "@/components/reservas/ReservaLayout";
import { fechaValida, useReserva } from "@/components/reservas/ReservaContext";
import { citaService } from "@/services/cita.service";
import ResumenReserva from "@/components/reservas/ResumenReserva";
import { reservaFirestoreService } from "@/services/reservaFirestore.service";

export default function DetallesCitaScreen() {
    const r = useReserva();
    const [error, setError] = useState("");
    const [revisado, setRevisado] = useState(false);
    const [guardando, setGuardando] = useState(false);
    if (r.confirmada) return <Redirect href="/cita-reservada" />;
    if (!r.barberoId) return <Redirect href="/reservar" />;
    if (!r.servicioSeleccionado) return <Redirect href="/servicios" />;
    if (!r.horaSeleccionada || !fechaValida(r.fecha)) return <Redirect href="/horarios" />;

    function validar() {
        if (r.nombre.trim().length < 2) return "Ingresa tu nombre completo.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.correo.trim())) return "Ingresa un correo electrónico válido.";
        if (!/^\+?[\d\s()-]+$/.test(r.telefono.trim()) || r.telefono.replace(/\D/g, "").length < 8 || r.telefono.replace(/\D/g, "").length > 15) return "Ingresa un teléfono válido de 8 a 15 dígitos.";
        return "";
    }

    function confirmarDatos() {
        const mensaje = validar();
        setError(mensaje); setRevisado(!mensaje);
    }

    async function reservar() {
        const mensaje = validar();
        setError(mensaje);
        if (mensaje || !revisado || r.confirmada || guardando) return;
        setGuardando(true);
        try {
            const cita = await citaService.crear({
                nombreCliente: r.nombre.trim(),
                correoCliente: r.correo.trim(),
                telefonoCliente: r.telefono.trim(),
                barberoId: r.barberoId,
                servicioId: r.servicioSeleccionado!,
                fecha: r.fecha,
                hora: r.horaSeleccionada!
            });

            const barbero = r.barberos.find((item) => item.id === r.barberoId);
            const servicio = r.servicios.find((item) => item.id === r.servicioSeleccionado);

            try {
                const guardadaEnFirestore = await reservaFirestoreService.guardarReserva({
                    cita,
                    barberoId: r.barberoId,
                    barberoNombre: barbero?.nombre ?? "Barbero",
                    servicioId: r.servicioSeleccionado!,
                    servicioNombre: servicio?.nombre ?? "Servicio",
                    fecha: r.fecha,
                    hora: r.horaSeleccionada!
                });

                if (guardadaEnFirestore) {
                    console.log("Reserva guardada en Firestore:", cita.id);
                } else {
                    console.log("Reserva creada sin historial Firestore: no hay usuario autenticado.");
                }
            } catch (errorFirestore) {
                console.error("La cita se creó, pero no se pudo guardar su historial en Firestore:", errorFirestore);
            }

            r.setCitaCreada(cita);
            r.setConfirmada(true);

            router.replace("/cita-reservada");
        } catch (motivo) {
            setError(motivo instanceof Error ? motivo.message : "No se pudo guardar la cita. Inténtalo nuevamente.");
        } finally {
            setGuardando(false);
        }
    }

    return <ReservaLayout paso={4} title="Detalles de la cita">
        <Text style={styles.heading}>Datos del cliente</Text>
        <Text style={styles.text}>Nombre completo</Text>
        <TextInput accessibilityLabel="Nombre completo" autoComplete="name" value={r.nombre} maxLength={100}
            onChangeText={v => { r.setNombre(v); setRevisado(false); setError(""); }} style={styles.input} />
        <Text style={styles.text}>Correo electrónico</Text>
        <TextInput accessibilityLabel="Correo electrónico" autoComplete="email" keyboardType="email-address"
            autoCapitalize="none" value={r.correo} maxLength={254}
            onChangeText={v => { r.setCorreo(v); setRevisado(false); setError(""); }} style={styles.input} />
        <Text style={styles.text}>Teléfono</Text>
        <TextInput accessibilityLabel="Teléfono" autoComplete="tel" keyboardType="phone-pad" value={r.telefono} maxLength={25}
            onChangeText={v => { r.setTelefono(v); setRevisado(false); setError(""); }} style={styles.input} />
        {Boolean(error) && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
        <ReservaButton title="Confirmar Datos" onPress={confirmarDatos} />
        <ResumenReserva />
        <Text style={styles.text}>{revisado ? "Datos confirmados. Revisa el resumen y pulsa Reservar cita." : "El resumen se actualiza mientras escribes. Confirma tus datos para continuar."}</Text>
        <View style={styles.row}>
            <ReservaButton title="Atrás" secondary onPress={() => { setRevisado(false); router.navigate("/horarios"); }} />
            <ReservaButton title={guardando ? "Guardando..." : "Reservar cita"} disabled={!revisado || guardando} onPress={reservar} />
        </View>
    </ReservaLayout>;
}
