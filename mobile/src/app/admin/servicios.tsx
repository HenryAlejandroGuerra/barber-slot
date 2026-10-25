/* ================================================
    mobile/src/app/admin/servicios.tsx
    Gestión de Servicios Administrativa
================================================ */

import { useState } from "react";

import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
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


interface Servicio {
    id: string;
    nombre: string;
    precio: number;
    duracion: number;
    activo: boolean;

    icono:
        | "cut-outline"
        | "person-outline"
        | "sparkles-outline";
}


const SERVICIOS_INICIALES: Servicio[] = [
    {
        id: "1",
        nombre: "Solo Corte",
        precio: 5,
        duracion: 30,
        activo: true,
        icono: "cut-outline"
    },
    {
        id: "2",
        nombre: "Corte y Barba",
        precio: 8,
        duracion: 45,
        activo: true,
        icono: "cut-outline"
    },
    {
        id: "3",
        nombre: "Solo Barba",
        precio: 3,
        duracion: 15,
        activo: true,
        icono: "person-outline"
    },
    {
        id: "4",
        nombre: "Afeitado Clásico",
        precio: 2,
        duracion: 10,
        activo: true,
        icono: "sparkles-outline"
    }
];


export default function ServiciosScreen() {

    const [servicios, setServicios] =
        useState<Servicio[]>(
            SERVICIOS_INICIALES
        );

    const [modalVisible, setModalVisible] =
        useState(false);

    const [
        servicioEditando,
        setServicioEditando
    ] =
        useState<Servicio | null>(
            null
        );

    const [
        servicioAEliminar,
        setServicioAEliminar
    ] =
        useState<Servicio | null>(
            null
        );

    const [nombre, setNombre] =
        useState("");

    const [precio, setPrecio] =
        useState("");

    const [duracion, setDuracion] =
        useState("");


    /* =========================================
       NUEVO SERVICIO
    ========================================= */

    function abrirNuevoServicio() {

        setServicioEditando(null);

        setNombre("");
        setPrecio("");
        setDuracion("");

        setModalVisible(true);
    }


    /* =========================================
       EDITAR
    ========================================= */

    function abrirEditar(
        servicio: Servicio
    ) {

        setServicioEditando(
            servicio
        );

        setNombre(
            servicio.nombre
        );

        setPrecio(
            servicio.precio.toString()
        );

        setDuracion(
            servicio.duracion.toString()
        );

        setModalVisible(true);
    }


    /* =========================================
       GUARDAR
    ========================================= */

    function guardarServicio() {

        const precioNumero =
            Number(precio);

        const duracionNumero =
            Number(duracion);


        if (
            !nombre.trim() ||
            Number.isNaN(
                precioNumero
            ) ||
            precioNumero <= 0 ||
            Number.isNaN(
                duracionNumero
            ) ||
            duracionNumero <= 0
        ) {
            return;
        }


        if (servicioEditando) {

            setServicios(
                (actuales) =>
                    actuales.map(
                        (servicio) =>
                            servicio.id ===
                            servicioEditando.id
                                ? {
                                    ...servicio,

                                    nombre:
                                        nombre.trim(),

                                    precio:
                                    precioNumero,

                                    duracion:
                                    duracionNumero
                                }
                                : servicio
                    )
            );

        } else {

            const nuevo: Servicio = {

                id:
                    Date.now()
                        .toString(),

                nombre:
                    nombre.trim(),

                precio:
                precioNumero,

                duracion:
                duracionNumero,

                activo: true,

                icono:
                    "cut-outline"
            };


            setServicios(
                (actuales) => [
                    ...actuales,
                    nuevo
                ]
            );
        }


        cerrarModal();
    }


    /* =========================================
       CONFIRMACIÓN ELIMINAR
    ========================================= */

    function solicitarEliminar(
        servicio: Servicio
    ) {

        setServicioAEliminar(
            servicio
        );
    }


    function confirmarEliminar() {

        if (!servicioAEliminar) {
            return;
        }


        setServicios(
            (actuales) =>
                actuales.filter(
                    (servicio) =>
                        servicio.id !==
                        servicioAEliminar.id
                )
        );


        setServicioAEliminar(
            null
        );
    }


    /* =========================================
       CERRAR FORMULARIO
    ========================================= */

    function cerrarModal() {

        setModalVisible(false);

        setServicioEditando(null);

        setNombre("");
        setPrecio("");
        setDuracion("");
    }


    return (

        <AdminScreen>

            <BrandHeader />


            <View style={styles.content}>

                <Text style={styles.title}>
                    Gestión de Servicios
                </Text>

                <Text style={styles.subtitle}>
                    Alta, baja y edición de servicios
                </Text>


                <Pressable
                    style={styles.addButton}
                    onPress={
                        abrirNuevoServicio
                    }
                >

                    <Ionicons
                        name="add"
                        size={18}
                        color={
                            COLORS.adminBackground
                        }
                    />

                    <Text style={styles.addButtonText}>
                        AGREGAR SERVICIO
                    </Text>

                </Pressable>


                <View style={styles.servicesCard}>

                    {servicios.length === 0 ? (

                        <Text style={styles.emptyText}>
                            No hay servicios registrados.
                        </Text>

                    ) : (

                        servicios.map(
                            (
                                servicio,
                                index
                            ) => (

                                <View
                                    key={
                                        servicio.id
                                    }
                                    style={[
                                        styles.serviceItem,

                                        index <
                                        servicios.length - 1 &&
                                        styles.serviceBorder
                                    ]}
                                >

                                    <View style={styles.iconBox}>

                                        <Ionicons
                                            name={
                                                servicio.icono
                                            }
                                            size={22}
                                            color={
                                                COLORS.gold
                                            }
                                        />

                                    </View>


                                    <View style={styles.info}>

                                        <View style={styles.infoRow}>

                                            <Text style={styles.label}>
                                                Servicio:
                                            </Text>

                                            <Text style={styles.value}>
                                                {servicio.nombre}
                                            </Text>

                                        </View>


                                        <View style={styles.infoRow}>

                                            <Text style={styles.label}>
                                                Precio:
                                            </Text>

                                            <Text style={styles.value}>
                                                $
                                                {
                                                    servicio.precio
                                                        .toFixed(
                                                            2
                                                        )
                                                }
                                            </Text>

                                        </View>


                                        <View style={styles.infoRow}>

                                            <Text style={styles.label}>
                                                Duración:
                                            </Text>

                                            <Text style={styles.value}>
                                                {servicio.duracion}
                                                {" min."}
                                            </Text>

                                        </View>


                                        <View style={styles.actions}>

                                            <Pressable
                                                style={
                                                    styles.editButton
                                                }
                                                onPress={() =>
                                                    abrirEditar(
                                                        servicio
                                                    )
                                                }
                                            >

                                                <Text style={styles.editText}>
                                                    EDITAR
                                                </Text>

                                            </Pressable>


                                            <Pressable
                                                style={
                                                    styles.deleteButton
                                                }
                                                onPress={() =>
                                                    solicitarEliminar(
                                                        servicio
                                                    )
                                                }
                                            >

                                                <Text style={styles.deleteText}>
                                                    ELIMINAR
                                                </Text>

                                            </Pressable>

                                        </View>

                                    </View>


                                    <View style={styles.statusContainer}>

                                        <Text style={styles.statusLabel}>
                                            Estado:
                                        </Text>

                                        <Text style={styles.activeText}>
                                            Activo
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
                MODAL AGREGAR / EDITAR
            ================================= */}

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={
                    cerrarModal
                }
            >

                <View style={styles.modalOverlay}>

                    <View style={styles.modalCard}>

                        <Text style={styles.modalTitle}>

                            {
                                servicioEditando
                                    ? "Editar Servicio"
                                    : "Agregar Servicio"
                            }

                        </Text>


                        <Text style={styles.inputLabel}>
                            Nombre
                        </Text>

                        <TextInput
                            value={nombre}
                            onChangeText={setNombre}
                            placeholder="Ej. Corte Premium"
                            placeholderTextColor={
                                COLORS.textSecondary
                            }
                            style={styles.input}
                        />


                        <Text style={styles.inputLabel}>
                            Precio ($)
                        </Text>

                        <TextInput
                            value={precio}
                            onChangeText={setPrecio}
                            keyboardType="decimal-pad"
                            placeholder="5.00"
                            placeholderTextColor={
                                COLORS.textSecondary
                            }
                            style={styles.input}
                        />


                        <Text style={styles.inputLabel}>
                            Duración (min)
                        </Text>

                        <TextInput
                            value={duracion}
                            onChangeText={setDuracion}
                            keyboardType="number-pad"
                            placeholder="30"
                            placeholderTextColor={
                                COLORS.textSecondary
                            }
                            style={styles.input}
                        />


                        <View style={styles.modalActions}>

                            <Pressable
                                style={
                                    styles.cancelButton
                                }
                                onPress={
                                    cerrarModal
                                }
                            >

                                <Text style={styles.cancelText}>
                                    CANCELAR
                                </Text>

                            </Pressable>


                            <Pressable
                                style={
                                    styles.saveButton
                                }
                                onPress={
                                    guardarServicio
                                }
                            >

                                <Text style={styles.saveText}>
                                    GUARDAR
                                </Text>

                            </Pressable>

                        </View>

                    </View>

                </View>

            </Modal>


            {/* =================================
                MODAL CONFIRMAR ELIMINAR
            ================================= */}

            <Modal
                visible={
                    servicioAEliminar !==
                    null
                }
                transparent
                animationType="fade"
                onRequestClose={() =>
                    setServicioAEliminar(
                        null
                    )
                }
            >

                <View style={styles.modalOverlay}>

                    <View style={styles.confirmCard}>

                        <View style={styles.deleteIconBox}>

                            <Ionicons
                                name="trash-outline"
                                size={30}
                                color={COLORS.danger}
                            />

                        </View>


                        <Text style={styles.confirmTitle}>
                            Eliminar Servicio
                        </Text>


                        <Text style={styles.confirmText}>

                            ¿Deseas eliminar

                            {" \""}

                            {
                                servicioAEliminar
                                    ?.nombre
                            }

                            {"\"?"}

                        </Text>


                        <Text style={styles.confirmWarning}>
                            Esta acción quitará el servicio de la lista.
                        </Text>


                        <View style={styles.modalActions}>

                            <Pressable
                                style={
                                    styles.cancelButton
                                }
                                onPress={() =>
                                    setServicioAEliminar(
                                        null
                                    )
                                }
                            >

                                <Text style={styles.cancelText}>
                                    CANCELAR
                                </Text>

                            </Pressable>


                            <Pressable
                                style={
                                    styles.confirmDeleteButton
                                }
                                onPress={
                                    confirmarEliminar
                                }
                            >

                                <Text style={styles.confirmDeleteText}>
                                    ELIMINAR
                                </Text>

                            </Pressable>

                        </View>

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
        fontFamily:
            "Montserrat_800ExtraBold",
        fontSize: 27,
        color: COLORS.gold
    },

    subtitle: {
        marginTop: 7,
        textAlign: "center",
        fontFamily:
            "Montserrat_400Regular",
        fontSize: 12,
        color: COLORS.textSecondary
    },

    addButton: {
        marginTop: 25,
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: RADIUS.pill,
        backgroundColor: COLORS.gold
    },

    addButtonText: {
        fontFamily:
            "Montserrat_700Bold",
        fontSize: 12,
        color:
        COLORS.adminBackground
    },

    servicesCard: {
        marginTop: 22,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: COLORS.gold,
        borderRadius: RADIUS.md,
        backgroundColor:
        COLORS.adminSurface
    },

    serviceItem: {
        flexDirection: "row",
        paddingVertical: 17
    },

    serviceBorder: {
        borderBottomWidth: 1,
        borderBottomColor:
        COLORS.gold
    },

    iconBox: {
        width: 36,
        height: 36,
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: COLORS.gold,
        borderRadius: RADIUS.sm
    },

    info: {
        flex: 1
    },

    infoRow: {
        flexDirection: "row",
        marginBottom: 3
    },

    label: {
        width: 72,
        fontFamily:
            "Montserrat_700Bold",
        fontSize: 11,
        color: COLORS.gold
    },

    value: {
        flex: 1,
        fontFamily:
            "Montserrat_400Regular",
        fontSize: 11,
        color: COLORS.textSecondary
    },

    statusContainer: {
        alignItems: "flex-end",
        marginLeft: 5
    },

    statusLabel: {
        fontFamily:
            "Montserrat_700Bold",
        fontSize: 10,
        color: COLORS.gold
    },

    activeText: {
        marginTop: 3,
        fontFamily:
            "Montserrat_500Medium",
        fontSize: 9,
        color: COLORS.success
    },

    actions: {
        marginTop: 8,
        flexDirection: "row",
        gap: 12
    },

    editButton: {
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: COLORS.gold,
        borderRadius: RADIUS.pill
    },

    editText: {
        fontFamily:
            "Montserrat_700Bold",
        fontSize: 8,
        color: COLORS.gold
    },

    deleteButton: {
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: COLORS.danger,
        borderRadius: RADIUS.pill
    },

    deleteText: {
        fontFamily:
            "Montserrat_700Bold",
        fontSize: 8,
        color: COLORS.danger
    },

    emptyText: {
        paddingVertical: 25,
        textAlign: "center",
        color: COLORS.textSecondary
    },

    backButton: {
        marginTop: 28,
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },

    backText: {
        fontFamily:
            "Montserrat_500Medium",
        fontSize: 12,
        color: COLORS.gold
    },

    logoutButton: {
        alignSelf: "center",
        marginTop: 28,
        padding: 10
    },

    logoutText: {
        fontFamily:
            "Montserrat_500Medium",
        fontSize: 13,
        color: COLORS.gold
    },


    /* MODALES */

    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor:
            "rgba(0,0,0,0.82)"
    },

    modalCard: {
        width: "100%",
        maxWidth: 380,
        alignSelf: "center",
        padding: 22,
        borderWidth: 1,
        borderColor: COLORS.gold,
        borderRadius: RADIUS.md,
        backgroundColor:
        COLORS.adminSurface
    },

    modalTitle: {
        marginBottom: 20,
        textAlign: "center",
        fontFamily:
            "Montserrat_700Bold",
        fontSize: 22,
        color: COLORS.gold
    },

    inputLabel: {
        marginBottom: 6,
        fontFamily:
            "Montserrat_700Bold",
        fontSize: 12,
        color: COLORS.gold
    },

    input: {
        minHeight: 45,
        marginBottom: 16,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor:
        COLORS.adminBorder,
        borderRadius: RADIUS.sm,
        backgroundColor:
        COLORS.adminBackground,
        fontFamily:
            "Montserrat_400Regular",
        color: COLORS.white
    },

    modalActions: {
        marginTop: 8,
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10
    },

    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor:
        COLORS.adminBorder,
        borderRadius: RADIUS.sm
    },

    cancelText: {
        fontFamily:
            "Montserrat_700Bold",
        fontSize: 11,
        color: COLORS.textSecondary
    },

    saveButton: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: RADIUS.sm,
        backgroundColor:
        COLORS.gold
    },

    saveText: {
        fontFamily:
            "Montserrat_700Bold",
        fontSize: 11,
        color:
        COLORS.adminBackground
    },


    /* CONFIRMACIÓN */

    confirmCard: {
        width: "100%",
        maxWidth: 350,
        alignSelf: "center",
        padding: 24,
        borderWidth: 1,
        borderColor: COLORS.danger,
        borderRadius: RADIUS.md,
        backgroundColor:
        COLORS.adminSurface
    },

    deleteIconBox: {
        alignSelf: "center",
        width: 55,
        height: 55,
        marginBottom: 14,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: COLORS.danger,
        borderRadius: RADIUS.pill,
        backgroundColor:
            "rgba(239,68,68,0.08)"
    },

    confirmTitle: {
        textAlign: "center",
        fontFamily:
            "Montserrat_700Bold",
        fontSize: 20,
        color: COLORS.danger
    },

    confirmText: {
        marginTop: 12,
        textAlign: "center",
        fontFamily:
            "Montserrat_500Medium",
        fontSize: 13,
        color: COLORS.white
    },

    confirmWarning: {
        marginTop: 8,
        marginBottom: 12,
        textAlign: "center",
        fontFamily:
            "Montserrat_400Regular",
        fontSize: 11,
        color:
        COLORS.textSecondary
    },

    confirmDeleteButton: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: RADIUS.sm,
        backgroundColor:
        COLORS.danger
    },

    confirmDeleteText: {
        fontFamily:
            "Montserrat_700Bold",
        fontSize: 11,
        color: COLORS.white
    }

});