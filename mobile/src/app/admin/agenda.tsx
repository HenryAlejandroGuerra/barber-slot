/* ================================================
    mobile/src/app/admin/agenda.tsx
    Agenda Diaria Administrativa
================================================ */

import { useMemo, useState } from "react";

import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

import AdminScreen from "@/components/admin/AdminScreen";
import BrandHeader from "@/components/layout/BrandHeader";

import {
    COLORS,
    RADIUS
} from "@/constants/theme";


type EstadoCita =
    | "confirmada"
    | "pendiente"
    | "cancelada";


interface Cita {
    id: string;
    fecha: string;
    hora: string;
    cliente: string;
    servicio: string;
    barbero: string;
    estado: EstadoCita;
}


/* =========================================
   DATOS MOCK
========================================= */

const CITAS_MOCK: Cita[] = [
    {
        id: "1",
        fecha: "2026-01-01",
        hora: "09:00 AM",
        cliente: "Juan Pérez",
        servicio: "Corte normal",
        barbero: "Víctor Flores",
        estado: "confirmada"
    },
    {
        id: "2",
        fecha: "2026-01-01",
        hora: "10:30 AM",
        cliente: "Cristian Castro",
        servicio: "Solo barba",
        barbero: "Luis Miguel",
        estado: "cancelada"
    },
    {
        id: "3",
        fecha: "2026-01-01",
        hora: "12:00 PM",
        cliente: "Carlos Mendoza",
        servicio: "Corte y barba",
        barbero: "Andrés Portillo",
        estado: "pendiente"
    },
    {
        id: "4",
        fecha: "2026-01-01",
        hora: "02:00 PM",
        cliente: "Samuel Anaya",
        servicio: "Corte normal",
        barbero: "Víctor Flores",
        estado: "confirmada"
    },

    /* Datos para comprobar el calendario */
    {
        id: "5",
        fecha: "2026-01-02",
        hora: "11:00 AM",
        cliente: "Kevin Hernández",
        servicio: "Corte y barba",
        barbero: "Luis Miguel",
        estado: "pendiente"
    },
    {
        id: "6",
        fecha: "2026-01-02",
        hora: "03:00 PM",
        cliente: "Diego Torres",
        servicio: "Solo barba",
        barbero: "Andrés Portillo",
        estado: "confirmada"
    }
];


const BARBEROS = [
    "Todos",
    "Víctor Flores",
    "Luis Miguel",
    "Andrés Portillo"
];


const MESES = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
];


const DIAS_SEMANA = [
    "D",
    "L",
    "M",
    "M",
    "J",
    "V",
    "S"
];


export default function AgendaScreen() {

    const [barberoSeleccionado, setBarberoSeleccionado] =
        useState("Todos");

    const [mostrarBarberos, setMostrarBarberos] =
        useState(false);

    const [fechaSeleccionada, setFechaSeleccionada] =
        useState(
            new Date(2026, 0, 1)
        );

    const [mesVisible, setMesVisible] =
        useState(
            new Date(2026, 0, 1)
        );

    const [mostrarCalendario, setMostrarCalendario] =
        useState(false);


    /* =========================================
       FORMATO DE FECHA
    ========================================= */

    function fechaISO(fecha: Date) {

        const anio =
            fecha.getFullYear();

        const mes =
            String(
                fecha.getMonth() + 1
            ).padStart(2, "0");

        const dia =
            String(
                fecha.getDate()
            ).padStart(2, "0");

        return `${anio}-${mes}-${dia}`;
    }


    function fechaVisual(fecha: Date) {

        const dia =
            String(
                fecha.getDate()
            ).padStart(2, "0");

        const mes =
            String(
                fecha.getMonth() + 1
            ).padStart(2, "0");

        const anio =
            fecha.getFullYear();

        return `${dia} / ${mes} / ${anio}`;
    }


    /* =========================================
       FILTRAR CITAS
    ========================================= */

    const citasFiltradas =
        useMemo(() => {

            return CITAS_MOCK.filter(
                (cita) => {

                    const coincideFecha =
                        cita.fecha ===
                        fechaISO(
                            fechaSeleccionada
                        );

                    const coincideBarbero =
                        barberoSeleccionado ===
                        "Todos" ||
                        cita.barbero ===
                        barberoSeleccionado;

                    return (
                        coincideFecha &&
                        coincideBarbero
                    );
                }
            );

        }, [
            fechaSeleccionada,
            barberoSeleccionado
        ]);


    /* =========================================
       CALENDARIO
    ========================================= */

    const anioVisible =
        mesVisible.getFullYear();

    const numeroMesVisible =
        mesVisible.getMonth();

    const primerDiaMes =
        new Date(
            anioVisible,
            numeroMesVisible,
            1
        ).getDay();

    const diasDelMes =
        new Date(
            anioVisible,
            numeroMesVisible + 1,
            0
        ).getDate();


    const celdasCalendario = [

        ...Array(
            primerDiaMes
        ).fill(null),

        ...Array.from(
            {
                length:
                diasDelMes
            },
            (_, indice) =>
                indice + 1
        )
    ];


    function mesAnterior() {

        setMesVisible(
            new Date(
                anioVisible,
                numeroMesVisible - 1,
                1
            )
        );
    }


    function mesSiguiente() {

        setMesVisible(
            new Date(
                anioVisible,
                numeroMesVisible + 1,
                1
            )
        );
    }


    function seleccionarDia(
        dia: number
    ) {

        const nuevaFecha =
            new Date(
                anioVisible,
                numeroMesVisible,
                dia
            );

        setFechaSeleccionada(
            nuevaFecha
        );

        setMostrarCalendario(
            false
        );
    }


    function esDiaSeleccionado(
        dia: number
    ) {

        return (
            fechaSeleccionada.getFullYear() ===
            anioVisible &&

            fechaSeleccionada.getMonth() ===
            numeroMesVisible &&

            fechaSeleccionada.getDate() ===
            dia
        );
    }


    /* =========================================
       ESTADOS
    ========================================= */

    function obtenerColorEstado(
        estado: EstadoCita
    ) {

        switch (estado) {

            case "confirmada":
                return COLORS.success;

            case "pendiente":
                return COLORS.warning;

            case "cancelada":
                return COLORS.danger;
        }
    }


    function obtenerTextoEstado(
        estado: EstadoCita
    ) {

        switch (estado) {

            case "confirmada":
                return "Confirmada";

            case "pendiente":
                return "Pendiente";

            case "cancelada":
                return "Cancelada";
        }
    }


    return (

        <AdminScreen>

            <BrandHeader />


            <View style={styles.content}>

                <Text style={styles.title}>
                    Agenda Diaria
                </Text>

                <Text style={styles.subtitle}>
                    Consulta y administra las citas del día
                </Text>


                {/* FECHA */}

                <View style={styles.filterBlock}>

                    <Text style={styles.label}>
                        Fecha
                    </Text>

                    <Pressable
                        style={styles.selector}
                        onPress={() => {

                            setMesVisible(
                                new Date(
                                    fechaSeleccionada
                                )
                            );

                            setMostrarCalendario(
                                true
                            );
                        }}
                    >

                        <Ionicons
                            name="calendar-outline"
                            size={20}
                            color={COLORS.gold}
                        />

                        <Text style={styles.selectorText}>
                            {
                                fechaVisual(
                                    fechaSeleccionada
                                )
                            }
                        </Text>

                    </Pressable>

                </View>


                {/* BARBERO */}

                <View style={styles.filterBlock}>

                    <Text style={styles.label}>
                        Barbero
                    </Text>

                    <Pressable
                        style={styles.selector}
                        onPress={() =>
                            setMostrarBarberos(
                                !mostrarBarberos
                            )
                        }
                    >

                        <Ionicons
                            name="person-outline"
                            size={20}
                            color={COLORS.gold}
                        />

                        <Text style={styles.selectorText}>
                            {barberoSeleccionado}
                        </Text>

                        <Ionicons
                            name={
                                mostrarBarberos
                                    ? "chevron-up"
                                    : "chevron-down"
                            }
                            size={18}
                            color={COLORS.gold}
                        />

                    </Pressable>


                    {mostrarBarberos && (

                        <View style={styles.dropdown}>

                            {BARBEROS.map(
                                (
                                    barbero,
                                    index
                                ) => (

                                    <Pressable
                                        key={barbero}
                                        style={[
                                            styles.dropdownItem,

                                            index <
                                            BARBEROS.length - 1 &&
                                            styles.dropdownBorder
                                        ]}
                                        onPress={() => {

                                            setBarberoSeleccionado(
                                                barbero
                                            );

                                            setMostrarBarberos(
                                                false
                                            );
                                        }}
                                    >

                                        <Text
                                            style={[
                                                styles.dropdownText,

                                                barbero ===
                                                barberoSeleccionado &&
                                                styles.dropdownSelected
                                            ]}
                                        >
                                            {barbero}
                                        </Text>

                                    </Pressable>
                                )
                            )}

                        </View>
                    )}

                </View>


                {/* CITAS */}

                <View style={styles.appointmentsCard}>

                    {citasFiltradas.length === 0 ? (

                        <Text style={styles.emptyText}>
                            No hay citas para esta fecha y barbero.
                        </Text>

                    ) : (

                        citasFiltradas.map(
                            (
                                cita,
                                index
                            ) => (

                                <View
                                    key={cita.id}
                                    style={[
                                        styles.appointment,

                                        index <
                                        citasFiltradas.length - 1 &&
                                        styles.appointmentBorder
                                    ]}
                                >

                                    <View style={styles.appointmentTop}>

                                        <View style={styles.row}>

                                            <Text style={styles.detailLabel}>
                                                Hora:
                                            </Text>

                                            <Text style={styles.detailValue}>
                                                {cita.hora}
                                            </Text>

                                        </View>


                                        <View>

                                            <Text style={styles.statusLabel}>
                                                Estado:
                                            </Text>

                                            <View
                                                style={[
                                                    styles.statusBadge,
                                                    {
                                                        borderColor:
                                                            obtenerColorEstado(
                                                                cita.estado
                                                            )
                                                    }
                                                ]}
                                            >

                                                <Text
                                                    style={[
                                                        styles.statusText,
                                                        {
                                                            color:
                                                                obtenerColorEstado(
                                                                    cita.estado
                                                                )
                                                        }
                                                    ]}
                                                >
                                                    {
                                                        obtenerTextoEstado(
                                                            cita.estado
                                                        )
                                                    }
                                                </Text>

                                            </View>

                                        </View>

                                    </View>


                                    <View style={styles.row}>

                                        <Text style={styles.detailLabel}>
                                            Cliente:
                                        </Text>

                                        <Text style={styles.detailValue}>
                                            {cita.cliente}
                                        </Text>

                                    </View>


                                    <View style={styles.row}>

                                        <Text style={styles.detailLabel}>
                                            Servicio:
                                        </Text>

                                        <Text style={styles.detailValue}>
                                            {cita.servicio}
                                        </Text>

                                    </View>


                                    <View style={styles.row}>

                                        <Text style={styles.detailLabel}>
                                            Barbero:
                                        </Text>

                                        <Text style={styles.detailValue}>
                                            {cita.barbero}
                                        </Text>

                                    </View>

                                </View>
                            )
                        )
                    )}

                </View>


                <Pressable
                    style={styles.backButton}
                    onPress={() =>
                        router.replace(
                            "/admin/inicio"
                        )
                    }
                >

                    <Ionicons
                        name="arrow-back"
                        size={20}
                        color={COLORS.gold}
                    />

                    <Text style={styles.backText}>
                        Regresar
                    </Text>

                </Pressable>


                <Pressable
                    style={styles.logoutButton}
                    onPress={() =>
                        router.replace(
                            "/admin"
                        )
                    }
                >

                    <Text style={styles.logoutText}>
                        Cerrar Sesión
                    </Text>

                </Pressable>

            </View>


            {/* =================================
                MODAL CALENDARIO
            ================================= */}

            <Modal
                visible={mostrarCalendario}
                transparent
                animationType="fade"
                onRequestClose={() =>
                    setMostrarCalendario(
                        false
                    )
                }
            >

                <View style={styles.modalOverlay}>

                    <View style={styles.calendarCard}>

                        <Text style={styles.calendarTitle}>
                            Seleccionar fecha
                        </Text>


                        {/* MES */}

                        <View style={styles.monthHeader}>

                            <Pressable
                                style={styles.monthButton}
                                onPress={
                                    mesAnterior
                                }
                            >

                                <Ionicons
                                    name="chevron-back"
                                    size={24}
                                    color={COLORS.gold}
                                />

                            </Pressable>


                            <Text style={styles.monthTitle}>
                                {
                                    MESES[
                                        numeroMesVisible
                                        ]
                                }
                                {" "}
                                {anioVisible}
                            </Text>


                            <Pressable
                                style={styles.monthButton}
                                onPress={
                                    mesSiguiente
                                }
                            >

                                <Ionicons
                                    name="chevron-forward"
                                    size={24}
                                    color={COLORS.gold}
                                />

                            </Pressable>

                        </View>


                        {/* DÍAS DE SEMANA */}

                        <View style={styles.weekRow}>

                            {DIAS_SEMANA.map(
                                (
                                    dia,
                                    indice
                                ) => (

                                    <View
                                        key={
                                            `${dia}-${indice}`
                                        }
                                        style={
                                            styles.dayCell
                                        }
                                    >

                                        <Text style={styles.weekText}>
                                            {dia}
                                        </Text>

                                    </View>
                                )
                            )}

                        </View>


                        {/* DÍAS */}

                        <View style={styles.daysGrid}>

                            {celdasCalendario.map(
                                (
                                    dia,
                                    indice
                                ) => (

                                    <View
                                        key={indice}
                                        style={
                                            styles.dayCell
                                        }
                                    >

                                        {dia && (

                                            <Pressable
                                                style={[
                                                    styles.dayButton,

                                                    esDiaSeleccionado(
                                                        dia
                                                    ) &&
                                                    styles.daySelected
                                                ]}
                                                onPress={() =>
                                                    seleccionarDia(
                                                        dia
                                                    )
                                                }
                                            >

                                                <Text
                                                    style={[
                                                        styles.dayText,

                                                        esDiaSeleccionado(
                                                            dia
                                                        ) &&
                                                        styles.daySelectedText
                                                    ]}
                                                >
                                                    {dia}
                                                </Text>

                                            </Pressable>
                                        )}

                                    </View>
                                )
                            )}

                        </View>


                        <Pressable
                            style={styles.calendarCancel}
                            onPress={() =>
                                setMostrarCalendario(
                                    false
                                )
                            }
                        >

                            <Text style={styles.calendarCancelText}>
                                CANCELAR
                            </Text>

                        </Pressable>

                    </View>

                </View>

            </Modal>

        </AdminScreen>
    );
}


/* =========================================
   ESTILOS
========================================= */

const styles = StyleSheet.create({

    content: {
        paddingHorizontal: 20,
        paddingBottom: 40
    },

    title: {
        marginTop: 28,
        textAlign: "center",
        fontFamily: "Montserrat_800ExtraBold",
        fontSize: 30,
        color: COLORS.gold
    },

    subtitle: {
        marginTop: 8,
        marginBottom: 30,
        textAlign: "center",
        fontFamily: "Montserrat_400Regular",
        fontSize: 13,
        color: COLORS.textSecondary
    },

    filterBlock: {
        width: "100%",
        maxWidth: 340,
        alignSelf: "center",
        marginBottom: 20
    },

    label: {
        marginBottom: 8,
        textAlign: "center",
        fontFamily: "Montserrat_700Bold",
        fontSize: 15,
        color: COLORS.gold
    },

    selector: {
        minHeight: 48,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: COLORS.adminBorder,
        borderRadius: RADIUS.md,
        backgroundColor:
        COLORS.adminSurface
    },

    selectorText: {
        flex: 1,
        textAlign: "center",
        fontFamily: "Montserrat_500Medium",
        fontSize: 14,
        color: COLORS.white
    },

    dropdown: {
        marginTop: 6,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: COLORS.adminBorder,
        borderRadius: RADIUS.md,
        backgroundColor:
        COLORS.adminSurfaceSoft
    },

    dropdownItem: {
        paddingVertical: 13,
        paddingHorizontal: 16
    },

    dropdownBorder: {
        borderBottomWidth: 1,
        borderBottomColor:
        COLORS.adminBorder
    },

    dropdownText: {
        textAlign: "center",
        fontFamily: "Montserrat_500Medium",
        fontSize: 13,
        color: COLORS.white
    },

    dropdownSelected: {
        color: COLORS.gold
    },

    appointmentsCard: {
        marginTop: 10,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: COLORS.adminBorder,
        borderRadius: RADIUS.md,
        backgroundColor:
        COLORS.adminSurface
    },

    appointment: {
        paddingVertical: 18
    },

    appointmentBorder: {
        borderBottomWidth: 1,
        borderBottomColor:
        COLORS.adminBorder
    },

    appointmentTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 6,
        gap: 10
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
        gap: 6
    },

    detailLabel: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 12,
        color: COLORS.gold
    },

    detailValue: {
        flexShrink: 1,
        fontFamily: "Montserrat_400Regular",
        fontSize: 12,
        color: COLORS.textSecondary
    },

    statusLabel: {
        marginBottom: 4,
        textAlign: "right",
        fontFamily: "Montserrat_700Bold",
        fontSize: 11,
        color: COLORS.gold
    },

    statusBadge: {
        alignSelf: "flex-end",
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderRadius: RADIUS.pill
    },

    statusText: {
        fontFamily: "Montserrat_500Medium",
        fontSize: 10
    },

    emptyText: {
        paddingVertical: 28,
        textAlign: "center",
        fontFamily: "Montserrat_500Medium",
        fontSize: 13,
        color: COLORS.textSecondary
    },

    backButton: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        marginTop: 28,
        gap: 8
    },

    backText: {
        fontFamily: "Montserrat_500Medium",
        fontSize: 13,
        color: COLORS.gold
    },

    logoutButton: {
        alignSelf: "center",
        marginTop: 28,
        paddingVertical: 10,
        paddingHorizontal: 20
    },

    logoutText: {
        fontFamily: "Montserrat_500Medium",
        fontSize: 14,
        color: COLORS.gold
    },


    /* CALENDARIO */

    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor:
            "rgba(0,0,0,0.82)"
    },

    calendarCard: {
        width: "100%",
        maxWidth: 360,
        alignSelf: "center",
        padding: 18,
        borderWidth: 1,
        borderColor: COLORS.gold,
        borderRadius: RADIUS.md,
        backgroundColor:
        COLORS.adminSurface
    },

    calendarTitle: {
        marginBottom: 18,
        textAlign: "center",
        fontFamily: "Montserrat_700Bold",
        fontSize: 21,
        color: COLORS.gold
    },

    monthHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 15
    },

    monthButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center"
    },

    monthTitle: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 15,
        color: COLORS.white
    },

    weekRow: {
        flexDirection: "row",
        marginBottom: 4
    },

    weekText: {
        textAlign: "center",
        fontFamily: "Montserrat_700Bold",
        fontSize: 11,
        color: COLORS.gold
    },

    daysGrid: {
        flexDirection: "row",
        flexWrap: "wrap"
    },

    dayCell: {
        width: "14.2857%",
        alignItems: "center",
        justifyContent: "center"
    },

    dayButton: {
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: RADIUS.pill
    },

    daySelected: {
        backgroundColor:
        COLORS.gold
    },

    dayText: {
        fontFamily: "Montserrat_500Medium",
        fontSize: 12,
        color: COLORS.white
    },

    daySelectedText: {
        fontFamily: "Montserrat_700Bold",
        color:
        COLORS.adminBackground
    },

    calendarCancel: {
        alignSelf: "center",
        marginTop: 18,
        paddingVertical: 8,
        paddingHorizontal: 15
    },

    calendarCancelText: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 11,
        color: COLORS.gold
    }

});