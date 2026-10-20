/*
========================================================
    mobile/src/app/(public)/horarios.tsx

    Pantalla móvil para seleccionar fecha y hora.

    Esta pantalla adapta a móvil el diseño
    utilizado en la versión web de BarberSlot.

    Por ahora trabajamos únicamente la parte visual.
    Más adelante podrá conectarse con la API real
    de disponibilidad.
========================================================
*/

import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { useState } from "react";
import { router } from "expo-router";

import BrandHeader from "@/components/layout/BrandHeader";

import {
    COLORS,
    RADIUS,
    SPACING,
} from "@/constants/theme";


/*
========================================================
    HORARIOS TEMPORALES
========================================================

    Estos horarios imitan los que aparecen
    en el diseño web.

    Más adelante estos valores podrán venir
    directamente desde la API de disponibilidad.
========================================================
*/
const HORARIOS = [
    "09:00",
    "09:30",
    "10:00",

    "10:30",
    "11:00",
    "11:30",

    "14:00",
    "14:30",
    "15:00",

    "15:30",
    "16:00",
    "16:30",
];


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

    /*
    ========================================================
        FECHA
    ========================================================

        Por ahora usamos una fecha visual.

        Más adelante podremos reemplazar este TextInput
        por un selector de fecha real o componente
        especializado.
    */
    const [fecha, setFecha] =
        useState("20/10/2026");


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
    const [
        horaSeleccionada,
        setHoraSeleccionada,
    ] = useState<string | null>(null);


    /*
    ========================================================
        CONTINUAR
    ========================================================

        Solo permitimos avanzar si existe:

            una fecha
            una hora seleccionada
    */
    function continuar() {

        if (!fecha || !horaSeleccionada) {
            return;
        }


        /*
            Por ahora dejamos la función preparada para la siguiente pantalla.
        */
        console.log(
            "Fecha:",
            fecha,
            "Hora:",
            horaSeleccionada
        );
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


                    {/*
                        Por ahora usamos un TextInput
                        para mantener el diseño visual.

                        Más adelante podremos usar
                        un selector nativo de fecha.
                    */}
                    <TextInput
                        value={fecha}

                        onChangeText={
                            setFecha
                        }

                        placeholder="20/10/2026"

                        placeholderTextColor="#A5A5A5"

                        style={styles.dateInput}
                    />


                    {/*
                    ==================================================
                        HORA DISPONIBLE
                    ==================================================
                    */}

                    <Text
                        style={[
                            styles.sectionLabel,
                            styles.hoursTitle,
                        ]}
                    >
                        Hora disponible
                    </Text>


                    {/*
                        Contenedor de botones.

                        flexWrap permite que se acomoden
                        en varias filas automáticamente.
                    */}
                    <View style={styles.hoursGrid}>

                        {HORARIOS.map((hora) => {

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
                                router.back()
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

                                !horaSeleccionada &&
                                    styles.nextButtonDisabled,
                            ]}

                            disabled={
                                !horaSeleccionada
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

        fontFamily:
            "Montserrat_600SemiBold",

        fontSize: 14,

        color: COLORS.black,

        backgroundColor: COLORS.white,
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