import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS } from "@/constants/theme";

const DIAS = ["L", "M", "X", "J", "V", "S", "D"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function convertirFecha(valor: string): Date | null {
    const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valor);
    if (!partes) return null;
    return new Date(Number(partes[3]), Number(partes[2]) - 1, Number(partes[1]));
}

function formatoFecha(fecha: Date): string {
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    return `${dia}/${mes}/${fecha.getFullYear()}`;
}

export default function CalendarioFecha({ value, onSelect }: { value: string; onSelect: (fecha: string) => void }) {
    const [mesVisible, setMesVisible] = useState(() => {
        const actual = convertirFecha(value) ?? new Date();
        return new Date(actual.getFullYear(), actual.getMonth(), 1);
    });
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const diasEnMes = new Date(mesVisible.getFullYear(), mesVisible.getMonth() + 1, 0).getDate();
    const espaciosIniciales = (new Date(mesVisible.getFullYear(), mesVisible.getMonth(), 1).getDay() + 6) % 7;
    const celdas = Array.from({ length: espaciosIniciales + diasEnMes }, (_, indice) => {
        if (indice < espaciosIniciales) return null;
        return new Date(mesVisible.getFullYear(), mesVisible.getMonth(), indice - espaciosIniciales + 1);
    });
    const fechaElegida = convertirFecha(value);

    function cambiarMes(cantidad: number) {
        setMesVisible(new Date(mesVisible.getFullYear(), mesVisible.getMonth() + cantidad, 1));
    }

    return (
        <View style={styles.calendar} accessibilityLabel="Calendario para elegir la fecha de la cita">
            <View style={styles.monthHeader}>
                <Pressable accessibilityRole="button" accessibilityLabel="Mes anterior"
                    disabled={mesVisible.getFullYear() === hoy.getFullYear() && mesVisible.getMonth() === hoy.getMonth()}
                    onPress={() => cambiarMes(-1)} style={styles.monthButton}>
                    <Text style={styles.monthArrow}>‹</Text>
                </Pressable>
                <Text style={styles.monthTitle}>{MESES[mesVisible.getMonth()]} {mesVisible.getFullYear()}</Text>
                <Pressable accessibilityRole="button" accessibilityLabel="Mes siguiente"
                    onPress={() => cambiarMes(1)} style={styles.monthButton}>
                    <Text style={styles.monthArrow}>›</Text>
                </Pressable>
            </View>
            <View style={styles.grid}>
                {DIAS.map((dia, indice) => <Text key={`dia-${indice}`} style={styles.weekday}>{dia}</Text>)}
                {celdas.map((fecha, indice) => {
                    if (!fecha) return <View key={`espacio-${indice}`} style={styles.dayCell} />;
                    const deshabilitada = fecha < hoy || fecha.getDay() === 0;
                    const seleccionada = Boolean(fechaElegida && fechaElegida.getTime() === fecha.getTime());
                    return (
                        <Pressable key={formatoFecha(fecha)} accessibilityRole="button"
                            accessibilityLabel={`${fecha.getDate()} de ${MESES[fecha.getMonth()]}`}
                            accessibilityState={{ disabled: deshabilitada, selected: seleccionada }}
                            disabled={deshabilitada} onPress={() => onSelect(formatoFecha(fecha))}
                            style={[styles.dayCell, seleccionada && styles.selectedDay, deshabilitada && styles.disabledDay]}>
                            <Text style={[styles.dayText, seleccionada && styles.selectedDayText, deshabilitada && styles.disabledDayText]}>
                                {fecha.getDate()}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    calendar: { padding: 14, borderWidth: 1, borderColor: "#E1E3E7", borderRadius: RADIUS.md, backgroundColor: COLORS.white },
    monthHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
    monthButton: { width: 38, height: 38, alignItems: "center", justifyContent: "center", borderRadius: 19, backgroundColor: "#F3F4F6" },
    monthArrow: { color: COLORS.black, fontSize: 26, lineHeight: 30 },
    monthTitle: { color: COLORS.black, fontFamily: "Montserrat_700Bold", fontSize: 15, textTransform: "capitalize" },
    grid: { flexDirection: "row", flexWrap: "wrap" },
    weekday: { width: "14.2857%", textAlign: "center", color: "#656565", fontFamily: "Montserrat_700Bold", fontSize: 12, paddingVertical: 8 },
    dayCell: { width: "14.2857%", height: 42, alignItems: "center", justifyContent: "center", borderRadius: 21 },
    dayText: { color: COLORS.black, fontFamily: "Montserrat_500Medium", fontSize: 14 },
    selectedDay: { backgroundColor: COLORS.gold },
    selectedDayText: { color: COLORS.black, fontFamily: "Montserrat_700Bold" },
    disabledDay: { opacity: 0.5 },
    disabledDayText: { color: "#A5A5A5" },
});
