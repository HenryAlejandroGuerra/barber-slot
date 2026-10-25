/* =====================================================
    mobile/src/app/admin/inicio.tsx
    Dashboard principal del módulo administrativo
===================================================== */
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import AdminScreen from "@/components/admin/AdminScreen";
import DashboardCard from "@/components/admin/DashboardCard";
import BrandHeader from "@/components/layout/BrandHeader";
import { COLORS, RADIUS } from "@/constants/theme";
import { IMAGES } from "@/constants/images";
import { dashboardMock } from "@/data/mock/dashboard.mock";

export default function AdminInicioScreen() {
    const { resumen, citasNuevas, barberosDisponibles } = dashboardMock;

    return (
        <AdminScreen>
            <BrandHeader />
            <View style={styles.content}>
                {/* Encabezado */}
                <Text style={styles.title}>
                    Panel de Inicio
                </Text>
                <Text style={styles.subtitle}>
                    Resumen General del Sistema y Citas Recientes
                </Text>

                {/* Métricas */}
                <View style={styles.metrics}>
                    <DashboardCard titulo="Citas de Hoy" valor={resumen.citasHoy} icono={IMAGES.admin.citasHoy} />
                    <DashboardCard titulo="Nuevas Citas" valor={resumen.nuevasCitas} icono={IMAGES.admin.nuevasCitas} />
                    <DashboardCard titulo="Canceladas" valor={resumen.canceladas} icono={IMAGES.admin.canceladas} />
                    <DashboardCard titulo="Servicios Activos" valor={resumen.serviciosActivos} icono={IMAGES.admin.serviciosActivos} />
                </View>

                {/* Accesos rápidos */}
                <Text style={styles.sectionTitle}>
                    Accesos rápidos
                </Text>
                <Pressable style={styles.quickAction} onPress={() => router.push("/admin/agenda")}>
                    <Text style={styles.quickActionText}>
                        Agenda Diaria
                    </Text>
                    <Text style={styles.quickActionArrow}>
                        ›
                    </Text>
                </Pressable>
                <Pressable style={styles.quickAction} onPress={() => router.push("/admin/servicios")}>
                    <Text style={styles.quickActionText}>
                        Servicios
                    </Text>
                    <Text style={styles.quickActionArrow}>
                        ›
                    </Text>
                </Pressable>

                {/* Citas nuevas */}
                <View style={styles.sectionHeader}>
                    <Image source={IMAGES.admin.nuevasCitas} style={styles.sectionIcon} resizeMode="contain" />
                    <Text style={styles.sectionHeaderText}>
                        Citas Nuevas Agendadas
                    </Text>
                </View>

                <View style={styles.appointmentsCard}>
                    {citasNuevas.map((cita, index) => (
                        <View key={cita.id} style={[
                            styles.appointment, index < citasNuevas.length - 1 && styles.appointmentBorder
                        ]}>
                            <View style={styles.appointmentTop}>
                                <Text style={styles.appointmentTime}>
                                    {cita.hora}
                                </Text>
                                <Text style={styles.appointmentStatus}>
                                    Nueva
                                </Text>
                            </View>

                            <Text style={styles.appointmentClient}>
                                {cita.cliente}
                            </Text>

                            <View style={styles.appointmentDetails}>
                                <Text style={styles.detailLabel}>
                                    Servicio:
                                </Text>
                                <Text style={styles.detailValue}>
                                    { cita.servicio }
                                </Text>
                            </View>

                            <View style={styles.appointmentDetails}>
                                <Text style={styles.detailLabel}>
                                    Barbero:
                                </Text>
                                <Text style={styles.detailValue}>
                                    { cita.barbero }
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Barberos disponibles */}
                <View style={styles.sectionHeader}>
                    <Image source={IMAGES.admin.barberosDisponibles} style={styles.barberSectionIcon} resizeMode="contain" />
                    <Text style={styles.sectionHeaderText}>
                        Barberos Disponibles
                    </Text>
                </View>

                <View style={styles.barbersCard}>
                    {barberosDisponibles.map((barbero) => (
                        <View key={barbero.id} style={styles.barberRow}>
                            <View style={styles.availableDot} />
                            <Text style={styles.barberName}>
                                {barbero.nombre}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Cerrar sesión */}
                <Pressable style={styles.logoutButton} onPress={() => router.replace("/admin")}>
                    <Text style={styles.logoutText}>
                        Cerrar Sesión
                    </Text>
                </Pressable>
            </View>
        </AdminScreen>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40
    },
    /* Encabezado */
    title: {
        marginTop: 28,
        textAlign: "center",
        fontFamily: "Montserrat_800ExtraBold",
        fontSize: 30,
        color: COLORS.white
    },
    subtitle: {
        marginTop: 8,
        marginBottom: 28,
        textAlign: "center",
        fontFamily: "Montserrat_600SemiBold",
        fontSize: 14,
        lineHeight: 21,
        color: COLORS.textSecondary
    },
    /* Métricas */
    metrics: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 14
    },
    /* Títulos de sección */
    sectionTitle: {
        marginTop: 34,
        marginBottom: 14,
        fontFamily: "Montserrat_700Bold",
        fontSize: 18,
        color: COLORS.gold
    },
    /* Accesos rápidos */
    quickAction: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: COLORS.adminBorder,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.adminSurface
    },
    quickActionText: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 15,
        color: COLORS.white
    },
    quickActionArrow: {
        fontFamily: "Montserrat_400Regular",
        fontSize: 28,
        color: COLORS.gold
    },
    /* Encabezados con icono */
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 34,
        marginBottom: 14,
        gap: 10
    },
    sectionIcon: {
        width: 32,
        height: 32
    },
    barberSectionIcon: {
        width: 42,
        height: 42
    },
    sectionHeaderText: {
        flex: 1,
        fontFamily: "Montserrat_700Bold",
        fontSize: 18,
        color: COLORS.gold
    },
    /* Citas */
    appointmentsCard: {
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: COLORS.adminBorder,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.adminSurface
    },
    appointment: {
        paddingVertical: 18
    },
    appointmentBorder: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.adminBorder
    },
    appointmentTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6
    },
    appointmentTime: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 16,
        color: COLORS.gold
    },
    appointmentStatus: {
        paddingVertical: 4,
        paddingHorizontal: 9,
        borderWidth: 1,
        borderColor: COLORS.success,
        borderRadius: RADIUS.pill,
        fontFamily: "Montserrat_500Medium",
        fontSize: 11,
        color: COLORS.success
    },
    appointmentClient: {
        marginBottom: 10,
        fontFamily: "Montserrat_700Bold",
        fontSize: 15,
        color: COLORS.white
    },
    appointmentDetails: {
        flexDirection: "row",
        marginBottom: 4
    },
    detailLabel: {
        width: 78,
        fontFamily: "Montserrat_600SemiBold",
        fontSize: 12,
        color: COLORS.textSecondary
    },
    detailValue: {
        flex: 1,
        fontFamily: "Montserrat_400Regular",
        fontSize: 12,
        color: COLORS.white
    },
    /* Barberos */
    barbersCard: {
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderWidth: 1,
        borderColor: COLORS.adminBorder,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.adminSurface
    },
    barberRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        gap: 12
    },
    availableDot: {
        width: 13,
        height: 13,
        borderRadius: 999,
        backgroundColor: COLORS.success
    },
    barberName: {
        flex: 1,
        fontFamily: "Montserrat_500Medium",
        fontSize: 14,
        color: COLORS.white
    },
    /* Cerrar sesión */
    logoutButton: {
        marginTop: 36,
        paddingVertical: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.adminBorder,
        borderRadius: RADIUS.md
    },
    logoutText: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 14,
        color: COLORS.gold
    }
});
