/*
========================================================
    mobile/src/app/(public)/servicios.tsx

    Pantalla móvil para seleccionar un servicio.

    Esta pantalla adapta a móvil el diseño utilizado
    actualmente en la versión web de BarberSlot.

    Por ahora trabajamos únicamente la parte visual
    utilizando datos temporales locales.

    Más adelante estos datos podrán obtenerse
    directamente desde la API.
========================================================
*/

import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
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
    TIPO DEL SERVICIO
========================================================

    Esta estructura define qué información
    necesitamos mostrar de cada servicio.

    id:
        Identificador único.

    nombre:
        Nombre visible del servicio.

    descripcion:
        Explicación corta.

    precio:
        Precio en dólares.

    duracion:
        Duración aproximada en minutos.
========================================================
*/
type ServicioVisual = {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    duracion: number;
};


/*
========================================================
    SERVICIOS TEMPORALES
========================================================

    Estos datos corresponden a los servicios
    que hemos venido utilizando en BarberSlot.

    Más adelante reemplazaremos este arreglo
    por información proveniente del backend.
========================================================
*/
const SERVICIOS: ServicioVisual[] = [
    {
        id: "1",
        nombre: "Afeitado Clásico",
        descripcion: "Servicio de afeitado clásico.",
        precio: 2,
        duracion: 10,
    },
    {
        id: "2",
        nombre: "Corte y Barba",
        descripcion: "Servicio combinado de corte y barba.",
        precio: 8,
        duracion: 45,
    },
    {
        id: "3",
        nombre: "Solo Barba",
        descripcion: "Perfilado y arreglo de barba.",
        precio: 3,
        duracion: 15,
    },
    {
        id: "4",
        nombre: "Solo Corte",
        descripcion: "Servicio de corte de cabello.",
        precio: 5,
        duracion: 30,
    },
];


/*
========================================================
    COMPONENTE PARA CADA PASO
========================================================

    Lo utilizamos para mostrar:

        1 ── 2 ── 3 ── 4

    "activo" determina si el círculo aparece
    en dorado o en gris.
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

                /*
                    Si está activo usamos dorado.

                    Si todavía no se ha alcanzado,
                    utilizamos gris.
                */
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
    PANTALLA PRINCIPAL
========================================================
*/
export default function ServiciosScreen() {

    /*
    ========================================================
        SERVICIO SELECCIONADO
    ========================================================

        En la versión visual actual trabajaremos
        seleccionando UN servicio.

        null significa:

            todavía no hay servicio seleccionado.

        Ejemplo después de seleccionar Corte y Barba:

            servicioSeleccionado = "2"
    */
    const [
        servicioSeleccionado,
        setServicioSeleccionado,
    ] = useState<string | null>(null);


    /*
    ========================================================
        SELECCIONAR SERVICIO
    ========================================================

        Cuando el usuario presiona una tarjeta,
        guardamos su ID.

        Si presiona nuevamente la misma tarjeta,
        la deseleccionamos.
    */
    function seleccionarServicio(id: string) {

        setServicioSeleccionado(
            (actual) =>
                actual === id
                    ? null
                    : id
        );
    }


    /*
    ========================================================
        CONTINUAR
    ========================================================

        Solo permitimos avanzar cuando
        existe un servicio seleccionado.

        Después navegamos a:

            /horarios
    */
    function continuar() {

        if (!servicioSeleccionado) {
            return;
        }

        router.push("/horarios");
    }


    /*
    ========================================================
        INTERFAZ
    ========================================================
    */
    return (
        <View style={styles.screen}>

            {/*
                Header general del proyecto móvil.
            */}
            <BrandHeader />


            {/*
                ScrollView permite utilizar correctamente
                la pantalla incluso en celulares pequeños.
            */}
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >

                {/*
                ==================================================
                    ENCABEZADO DE LA RESERVA
                ==================================================
                */}

                <Text style={styles.eyebrow}>
                    RESERVA TU CITA
                </Text>


                <Text style={styles.title}>
                    Elige tu Servicio
                </Text>


                <Text style={styles.subtitle}>
                    Completa los pasos para agendar una experiencia hecha para ti.
                </Text>


                {/*
                ==================================================
                    INDICADOR DE PASOS

                    Estamos en Servicios.

                    Paso 1 → completado
                    Paso 2 → actual
                    Paso 3 → pendiente
                    Paso 4 → pendiente
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
                            styles.stepLineInactive,
                        ]}
                    />


                    <Paso
                        numero={3}
                        activo={false}
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
                    CONTENEDOR DE SERVICIOS
                ==================================================
                */}
                <View style={styles.servicesContainer}>

                    {SERVICIOS.map((servicio) => {

                        /*
                            Determinamos si esta tarjeta
                            es la seleccionada.
                        */
                        const seleccionado =
                            servicioSeleccionado ===
                            servicio.id;


                        return (

                            <Pressable
                                key={servicio.id}

                                /*
                                    Permite seleccionar
                                    o deseleccionar.
                                */
                                onPress={() =>
                                    seleccionarServicio(
                                        servicio.id
                                    )
                                }

                                /*
                                    Mostramos un borde dorado
                                    más fuerte cuando el servicio
                                    está seleccionado.
                                */
                                style={[
                                    styles.serviceCard,

                                    seleccionado &&
                                        styles.serviceCardSelected,
                                ]}
                            >

                                {/*
                                    Precio.

                                    En el diseño web aparece
                                    en la parte superior.
                                */}
                                <Text style={styles.price}>
                                    ${servicio.precio}
                                </Text>


                                {/*
                                    Nombre del servicio.
                                */}
                                <Text style={styles.serviceName}>
                                    {servicio.nombre}
                                </Text>


                                {/*
                                    Descripción.
                                */}
                                <Text style={styles.description}>
                                    {servicio.descripcion}
                                </Text>


                                {/*
                                    Duración aproximada.
                                */}
                                <Text style={styles.duration}>
                                    Duración aproximada:{" "}
                                    <Text
                                        style={
                                            styles.durationValue
                                        }
                                    >
                                        {servicio.duracion} min
                                    </Text>
                                </Text>


                                {/*
                                    Texto adicional que solo aparece
                                    cuando la tarjeta está seleccionada.

                                    Ayuda al usuario a identificar
                                    claramente su elección.
                                */}
                                {seleccionado && (

                                    <Text style={styles.selectedText}>
                                        Seleccionado
                                    </Text>

                                )}

                            </Pressable>
                        );
                    })}


                    {/*
                    ==================================================
                        BOTONES DE NAVEGACIÓN
                    ==================================================
                    */}
                    <View style={styles.divider} />


                    <View style={styles.navigation}>

                        {/*
                            ATRÁS

                            Regresa a la pantalla anterior.
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

                            Solamente funciona cuando
                            existe un servicio seleccionado.
                        */}
                        <Pressable
                            style={[
                                styles.navigationButton,
                                styles.nextButton,

                                !servicioSeleccionado &&
                                    styles.nextButtonDisabled,
                            ]}

                            disabled={
                                !servicioSeleccionado
                            }

                            onPress={continuar}
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
        TEXTOS DEL ENCABEZADO
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

        fontSize: 30,

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
        INDICADOR DE PASOS
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
        CONTENEDOR DE SERVICIOS
    ========================================================
    */

    servicesContainer: {
        padding: 16,

        borderRadius: RADIUS.lg,

        backgroundColor: COLORS.white,

        /*
            Sombra para Android.
        */
        elevation: 5,


        /*
            Sombra para iOS.
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
        TARJETA
    ========================================================
    */

    serviceCard: {

        marginBottom: SPACING.md,

        paddingHorizontal: 17,
        paddingVertical: 16,

        minHeight: 138,

        borderWidth: 1,

        borderColor: "#E1E3E7",

        borderRadius: RADIUS.md,

        backgroundColor: COLORS.white,
    },


    /*
        Cuando está seleccionada,
        hacemos más visible el borde.
    */
    serviceCardSelected: {
        borderWidth: 2,

        borderColor: COLORS.gold,

        backgroundColor: "#FFFDF8",
    },


    /*
        Precio.
    */
    price: {
        fontFamily:
            "Montserrat_800ExtraBold",

        fontSize: 25,

        color: COLORS.gold,
    },


    /*
        Nombre.
    */
    serviceName: {
        marginTop: 8,

        fontFamily:
            "Montserrat_700Bold",

        fontSize: 17,

        color: COLORS.black,
    },


    /*
        Descripción.
    */
    description: {
        marginTop: 7,

        fontFamily:
            "Montserrat_500Medium",

        fontSize: 12,

        lineHeight: 18,

        color: "#A5A5A5",
    },


    /*
        Duración.
    */
    duration: {
        marginTop: 10,

        fontFamily:
            "Montserrat_600SemiBold",

        fontSize: 11,

        color: COLORS.black,
    },


    durationValue: {
        fontFamily:
            "Montserrat_700Bold",
    },


    /*
        Indicador cuando la tarjeta
        está seleccionada.
    */
    selectedText: {
        marginTop: 10,

        fontFamily:
            "Montserrat_700Bold",

        fontSize: 11,

        color: COLORS.gold,
    },


    /*
    ========================================================
        DIVISOR
    ========================================================
    */

    divider: {
        height: 1,

        marginTop: 4,
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
        Botón Atrás.
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
        Botón Siguiente.
    */
    nextButton: {
        backgroundColor: COLORS.gold,
    },


    /*
        Siguiente deshabilitado.
    */
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