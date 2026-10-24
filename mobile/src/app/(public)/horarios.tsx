import { useEffect, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { Redirect, router } from "expo-router";
import { useReserva, fechaValida } from "@/components/reservas/ReservaContext";
import { citaService } from "@/services/cita.service";
import CalendarioFecha from "@/components/reservas/CalendarioFecha";

import BrandHeader from "@/components/layout/BrandHeader";

import {
    COLORS,
    RADIUS,
} from "@/constants/theme";


/*
========================================================
    COMPONENTE PARA CADA PASO
========================================================

    Se reutiliza la misma idea de Servicios.

    En Horarios:

        Paso 1 → completado
        Paso 2 → completado
        Paso 3 → actual
        Paso 4 → pendiente
========================================================
*/
function Paso({
    numero,
    activo,
}: {
    numero: number;
    activo: boolean;
}) {
    return (
        <View
            style={[
                styles.stepCircle,

                activo
                    ? styles.stepCircleActive
                    : styles.stepCircleInactive,
            ]}
        >
            <Text
                style={[
                    styles.stepNumber,

                    activo
                        ? styles.stepNumberActive
                        : styles.stepNumberInactive,
                ]}
            >
                {numero}
            </Text>
        </View>
    );
}


/*
========================================================
    COMPONENTE PRINCIPAL
========================================================
*/
export default function HorariosScreen() {
    const reserva = useReserva();
    const [fecha, setFecha] = [reserva.fecha, reserva.cambiarFecha] as const;
    const [horaSeleccionada, setHoraSeleccionada] = [reserva.horaSeleccionada, reserva.setHoraSeleccionada] as const;
    const [resultadoHorarios, setResultadoHorarios] = useState<{ fecha: string; horarios: string[]; error?: string } | null>(null);
    const [calendarioAbierto, setCalendarioAbierto] = useState(!reserva.fecha);
    const resultadoActual = resultadoHorarios?.fecha === fecha ? resultadoHorarios : null;
    const horarios = resultadoActual?.horarios ?? [];
    const cargandoHorarios = fechaValida(fecha) && !resultadoActual;
    const errorHorarios = resultadoActual?.error ?? "";

    useEffect(() => {
        if (!fechaValida(fecha) || !reserva.barberoId || !reserva.servicioSeleccionado) {
            return;
        }
        let activa = true;
        citaService.obtenerDisponibilidad(reserva.barberoId, reserva.servicioSeleccionado, fecha)
            .then((disponibles) => {
                if (activa) setResultadoHorarios({ fecha, horarios: disponibles });
            })
            .catch((motivo: unknown) => {
                if (activa) setResultadoHorarios({
                    fecha,
                    horarios: [],
                    error: motivo instanceof Error ? motivo.message : "No se pudieron cargar los horarios.",
                });
            });
        return () => { activa = false; };
    }, [fecha, reserva.barberoId, reserva.servicioSeleccionado]);

    if (!reserva.barberoId || reserva.confirmada) return <Redirect href="/reservar" />;
    if (!reserva.servicioSeleccionado) return <Redirect href="/servicios" />;

    /*
    ========================================================
        HORA SELECCIONADA
    ========================================================

        Aquí guardamos la hora elegida.

        Al inicio:

            null

        Ejemplo después de seleccionar:

            "10:30"
    */
    /*
    ========================================================
        CONTINUAR
    ========================================================

        Solo permitimos avanzar si existe:

            una fecha
            una hora seleccionada
    */
    function continuar() {
        if (fecha && horaSeleccionada && fechaValida(fecha) && horarios.includes(horaSeleccionada)) {
            router.push("/detalles-cita");
        }
    }


    /*
    ========================================================
        INTERFAZ
    ========================================================
    */
    return (
        <View style={styles.screen}>

            {/*
                Encabezado general BarberSlot.
            */}
            <BrandHeader />


            <ScrollView
                style={styles.scroll}

                contentContainerStyle={
                    styles.content
                }

                showsVerticalScrollIndicator={
                    false
                }
            >

                {/*
                ==================================================
                    ENCABEZADO
                ==================================================
                */}

                <Text style={styles.eyebrow}>
                    RESERVA TU CITA
                </Text>


                <Text style={styles.title}>
                    Selecciona fecha y hora
                </Text>


                <Text style={styles.subtitle}>
                    Completa los pasos para agendar una experiencia hecha para ti.
                </Text>


                {/*
                ==================================================
                    INDICADOR DE PASOS
                ==================================================
                */}

                <View style={styles.stepsContainer}>

                    <Paso
                        numero={1}
                        activo={true}
                    />


                    <View
                        style={[
                            styles.stepLine,
                            styles.stepLineActive,
                        ]}
                    />


                    <Paso
                        numero={2}
                        activo={true}
                    />


                    <View
                        style={[
                            styles.stepLine,
                            styles.stepLineActive,
                        ]}
                    />


                    <Paso
                        numero={3}
                        activo={true}
                    />


                    <View
                        style={[
                            styles.stepLine,
                            styles.stepLineInactive,
                        ]}
                    />


                    <Paso
                        numero={4}
                        activo={false}
                    />

                </View>


                {/*
                ==================================================
                    TARJETA PRINCIPAL
                ==================================================
                */}

                <View style={styles.mainCard}>

                    {/*
                    ==================================================
                        FECHA
                    ==================================================
                    */}

                    <Text style={styles.sectionLabel}>
                        Fecha de la cita
                    </Text>


                    <Pressable accessibilityRole="button" accessibilityLabel="Seleccionar fecha de la cita"
                        onPress={() => setCalendarioAbierto((abierto) => !abierto)} style={styles.dateInput}>
                        <Text style={styles.dateButtonText}>{fecha || "Elige una fecha"}</Text>
                    </Pressable>
                    {calendarioAbierto && <CalendarioFecha value={fecha}
                        onSelect={(valor) => { setFecha(valor); setCalendarioAbierto(false); }} />}


                    {/*
                    ==================================================
                        HORA DISPONIBLE
                    ==================================================
                    */}

                    {fecha.length > 0 && !fechaValida(fecha) && <Text accessibilityRole="alert">Selecciona una fecha válida, de lunes a sábado y desde hoy.</Text>}
                    {cargandoHorarios && <Text style={styles.availabilityMessage}>Buscando horarios disponibles...</Text>}
                    {Boolean(errorHorarios) && <Text accessibilityRole="alert" style={styles.availabilityError}>{errorHorarios}</Text>}
                    {fechaValida(fecha) && !cargandoHorarios && !errorHorarios && horarios.length === 0 && <Text style={styles.availabilityMessage}>No hay horarios disponibles para esta fecha. Elige otro día.</Text>}
                    <Text
                        style={[
                            styles.sectionLabel,
                            styles.hoursTitle,
                        ]}
                    >
                        Hora disponible
                    </Text>


                    <View style={styles.hoursGrid}>

                        {horarios.map((hora) => {

                            /*
                                Comprobamos si este horario
                                está seleccionado.
                            */
                            const seleccionada =
                                horaSeleccionada === hora;


                            return (

                                <Pressable
                                    key={hora}

                                    /*
                                        Guardamos la hora elegida.
                                    */
                                    onPress={() =>
                                        setHoraSeleccionada(
                                            hora
                                        )
                                    }

                                    style={[
                                        styles.hourButton,

                                        seleccionada &&
                                            styles.hourButtonSelected,
                                    ]}
                                >

                                    <Text
                                        style={[
                                            styles.hourText,

                                            seleccionada &&
                                                styles.hourTextSelected,
                                        ]}
                                    >
                                        {hora}
                                    </Text>

                                </Pressable>
                            );
                        })}

                    </View>


                    {/*
                    ==================================================
                        DIVISOR
                    ==================================================
                    */}

                    <View style={styles.divider} />


                    {/*
                    ==================================================
                        BOTONES DE NAVEGACIÓN
                    ==================================================
                    */}

                    <View style={styles.navigation}>

                        {/*
                            ATRÁS

                            Regresa a Servicios.
                        */}
                        <Pressable
                            style={[
                                styles.navigationButton,
                                styles.backButton,
                            ]}

                            onPress={() =>
                                router.navigate("/servicios")
                            }
                        >

                            <Text
                                style={
                                    styles.backButtonText
                                }
                            >
                                Atrás
                            </Text>

                        </Pressable>


                        {/*
                            SIGUIENTE

                            Solo se habilita cuando
                            existe una hora seleccionada.
                        */}
                        <Pressable
                            style={[
                                styles.navigationButton,
                                styles.nextButton,

                                (!horaSeleccionada || !fechaValida(fecha)) &&
                                    styles.nextButtonDisabled,
                            ]}

                            disabled={
                                (!horaSeleccionada || !fechaValida(fecha))
                            }

                            onPress={
                                continuar
                            }
                        >

                            <Text
                                style={
                                    styles.nextButtonText
                                }
                            >
                                Siguiente
                            </Text>

                        </Pressable>

                    </View>

                </View>

            </ScrollView>

        </View>
    );
}


/*
========================================================
    ESTILOS
========================================================
*/
const styles = StyleSheet.create({

    /*
    ========================================================
        PANTALLA
    ========================================================
    */

    screen: {
        flex: 1,

        backgroundColor:
            COLORS.publicBackground,
    },


    scroll: {
        flex: 1,
    },


    content: {
        paddingHorizontal: 20,
        paddingTop: 28,
        paddingBottom: 50,
    },


    /*
    ========================================================
        ENCABEZADO
    ========================================================
    */

    eyebrow: {
        textAlign: "center",

        fontFamily:
            "Montserrat_700Bold",

        fontSize: 12,

        letterSpacing: 3,

        color: COLORS.gold,
    },


    title: {
        marginTop: 8,

        textAlign: "center",

        fontFamily:
            "Montserrat_800ExtraBold",

        fontSize: 28,

        color: COLORS.black,
    },


    subtitle: {
        marginTop: 8,

        paddingHorizontal: 12,

        textAlign: "center",

        fontFamily:
            "Montserrat_500Medium",

        fontSize: 13,

        lineHeight: 19,

        color: "#A4A4A4",
    },


    /*
    ========================================================
        PASOS
    ========================================================
    */

    stepsContainer: {
        flexDirection: "row",

        alignItems: "center",
        justifyContent: "center",

        marginTop: 26,
        marginBottom: 28,
    },


    stepCircle: {
        width: 30,
        height: 30,

        borderRadius: 15,

        alignItems: "center",
        justifyContent: "center",
    },


    stepCircleActive: {
        backgroundColor: COLORS.gold,
    },


    stepCircleInactive: {
        backgroundColor: "#ECEDEF",
    },


    stepNumber: {
        fontFamily:
            "Montserrat_700Bold",

        fontSize: 12,
    },


    stepNumberActive: {
        color: COLORS.white,
    },


    stepNumberInactive: {
        color: "#BFC1C5",
    },


    stepLine: {
        width: 34,
        height: 2,

        marginHorizontal: 7,
    },


    stepLineActive: {
        backgroundColor: COLORS.gold,
    },


    stepLineInactive: {
        backgroundColor: "#E2E3E5",
    },


    /*
    ========================================================
        TARJETA PRINCIPAL
    ========================================================
    */

    mainCard: {
        padding: 18,

        borderRadius: RADIUS.lg,

        backgroundColor: COLORS.white,

        /*
            Sombra Android.
        */
        elevation: 5,


        /*
            Sombra iOS.
        */
        shadowColor: "#000000",

        shadowOffset: {
            width: 0,
            height: 5,
        },

        shadowOpacity: 0.08,

        shadowRadius: 12,
    },


    /*
    ========================================================
        FECHA
    ========================================================
    */

    sectionLabel: {
        fontFamily:
            "Montserrat_700Bold",

        fontSize: 14,

        color: COLORS.black,
    },


    dateInput: {
        marginTop: 10,
        height: 50,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: "#D9DDE3",
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.white,
        justifyContent: "center",
    },

    dateButtonText: {
        fontFamily: "Montserrat_600SemiBold",
        fontSize: 14,
        color: COLORS.black,
    },

    availabilityMessage: {
        color: "#656565",
        fontFamily: "Montserrat_400Regular",
        fontSize: 13,
    },

    availabilityError: {
        color: "#B42318",
        fontFamily: "Montserrat_500Medium",
        fontSize: 13,
    },

    /*
    ========================================================
        HORARIOS
    ========================================================
    */

    hoursTitle: {
        marginTop: 24,
    },


    hoursGrid: {
        flexDirection: "row",

        flexWrap: "wrap",

        justifyContent: "space-between",

        marginTop: 12,

        rowGap: 12,
    },


    /*
        Cada botón ocupa aproximadamente
        un tercio del ancho disponible.
    */
    hourButton: {
        width: "31%",

        minHeight: 48,

        alignItems: "center",
        justifyContent: "center",

        borderWidth: 1,

        borderColor: "#E1E3E7",

        borderRadius: RADIUS.md,

        backgroundColor: COLORS.white,
    },


    /*
        Horario seleccionado.
    */
    hourButtonSelected: {
        borderColor: COLORS.gold,

        backgroundColor: "#FFF7E7",
    },


    hourText: {
        fontFamily:
            "Montserrat_700Bold",

        fontSize: 13,

        color: COLORS.black,
    },


    hourTextSelected: {
        color: COLORS.gold,
    },


    /*
    ========================================================
        DIVISOR
    ========================================================
    */

    divider: {
        height: 1,

        marginTop: 26,
        marginBottom: 18,

        backgroundColor: "#ECECEC",
    },


    /*
    ========================================================
        BOTONES
    ========================================================
    */

    navigation: {
        flexDirection: "row",

        justifyContent: "space-between",

        gap: 14,
    },


    navigationButton: {
        flex: 1,

        minHeight: 52,

        alignItems: "center",
        justifyContent: "center",

        borderRadius: RADIUS.md,
    },


    /*
        Atrás.
    */
    backButton: {
        backgroundColor: "#11151D",
    },


    backButtonText: {
        fontFamily:
            "Montserrat_700Bold",

        fontSize: 15,

        color: COLORS.white,
    },


    /*
        Siguiente.
    */
    nextButton: {
        backgroundColor: COLORS.gold,
    },


    nextButtonDisabled: {
        opacity: 0.45,
    },


    nextButtonText: {
        fontFamily:
            "Montserrat_700Bold",

        fontSize: 15,

        color: COLORS.white,
    },
});
