/* ================================================
    mobile/src/app/admin/index.tsx
    Index de la parte administrativa
================================================ */
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import AdminScreen from "@/components/admin/AdminScreen";
import BrandHeader from "@/components/layout/BrandHeader";
import { COLORS, RADIUS } from "@/constants/theme";

const ADMIN_MOCK = {
    correo: "admin@barberslot.test",
    contra: "Admin123!"
};

export default function AdminLoginScreen() {
    const [correo, setCorreo] = useState("");
    const [contra, setContra] = useState("");
    const [mostrarContra, setMostrarContra] = useState(false);
    const [recordarme, setRecordarme] = useState(false);
    const [error, setError] = useState("");

    function iniciarSesion() {
        setError("");

        if (!correo.trim() || !contra.trim()) {
            setError("Completa el correo electrónico y la contraseña.");
            return;
        }

        const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!correoValido.test(correo.trim())) {
            setError("Ingresa un correo electrónico válido.");
            return;
        }

        if (correo.trim().toLowerCase() !== ADMIN_MOCK.correo || contra !== ADMIN_MOCK.contra) {
            setError("Correo o contraseña incorrectos.");
            return;
        }

        router.replace("/admin/inicio");
    }

    return (
        <AdminScreen>
            <BrandHeader />
            <View style={styles.content}>
                <Text style={styles.title}>
                    Iniciar Sesión
                </Text>

                <Text style={styles.subtitle}>
                    Acceso para Administrador/Barbero
                </Text>

                <View style={styles.card}>
                    <Text style={styles.label}>
                        Correo electrónico
                    </Text>

                    <TextInput
                        value={correo}
                        onChangeText={setCorreo}
                        placeholder="ejemplo@barberslot.com"
                        placeholderTextColor={COLORS.textSecondary}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={styles.input}
                    />

                    <Text style={styles.label}>
                        Contraseña
                    </Text>

                    <View style={styles.passwordContainer}>
                        <TextInput
                            value={contra}
                            onChangeText={setContra}
                            placeholder="Ingresa tu contraseña"
                            placeholderTextColor={COLORS.textSecondary}
                            secureTextEntry={!mostrarContra}
                            style={styles.passwordInput}
                        />

                        <Pressable onPress={() => setMostrarContra(!mostrarContra)}>
                            <Ionicons
                                name={mostrarContra ? "eye-off-outline" : "eye-outline"}
                                size={23}
                                color={COLORS.textSecondary}
                            />
                        </Pressable>
                    </View>

                    <View style={styles.options}>
                        <Pressable style={styles.remember} onPress={() => setRecordarme(!recordarme)}>
                            <Ionicons
                                name={recordarme ? "checkbox" : "square-outline"}
                                size={21}
                                color={COLORS.gold}
                            />

                            <Text style={styles.rememberText}>
                                Recordarme
                            </Text>
                        </Pressable>

                        <Text style={styles.forgot}>
                            ¿Olvidaste tu contraseña?
                        </Text>
                    </View>

                    {error !== "" && (
                        <Text style={styles.error}>
                            {error}
                        </Text>
                    )}

                    <Pressable style={styles.loginButton} onPress={iniciarSesion} >
                        <Text style={styles.loginText}>
                            INGRESAR
                        </Text>
                    </Pressable>
                </View>

                <Pressable style={styles.backButton} onPress={() => router.replace("/")} >
                    <Text style={styles.backText}>
                        ← Regresar al inicio
                    </Text>
                </Pressable>
            </View>
        </AdminScreen>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 24,
        paddingBottom: 32
    },
    title: {
        marginTop: 34,
        textAlign: "center",
        fontFamily: "Montserrat_800ExtraBold",
        fontSize: 34,
        color: COLORS.white
    },
    subtitle: {
        marginTop: 8,
        marginBottom: 30,
        textAlign: "center",
        fontFamily: "Montserrat_400Regular",
        fontSize: 15,
        color: COLORS.textSecondary
    },
    card: {
        padding: 22,
        borderWidth: 1,
        borderColor: COLORS.adminBorder,
        borderRadius: RADIUS.lg,
        backgroundColor: COLORS.adminHeader
    },
    label: {
        marginBottom: 8,
        fontFamily: "Montserrat_700Bold",
        fontSize: 14,
        color: COLORS.gold
    },
    input: {
        height: 56,
        marginBottom: 22,
        paddingHorizontal: 16,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.white,
        fontFamily: "Montserrat_400Regular",
        fontSize: 14,
        color: COLORS.textDark
    },
    passwordContainer: {
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        paddingHorizontal: 16,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.white
    },
    passwordInput: {
        flex: 1,
        fontFamily: "Montserrat_400Regular",
        fontSize: 14,
        color: COLORS.textDark
    },
    options: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 18
    },
    remember: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7
    },
    rememberText: {
        fontFamily: "Montserrat_400Regular",
        fontSize: 12,
        color: COLORS.textSecondary
    },
    forgot: {
        fontFamily: "Montserrat_500Medium",
        fontSize: 11,
        color: COLORS.gold
    },
    error: {
        marginBottom: 14,
        fontFamily: "Montserrat_500Medium",
        fontSize: 12,
        color: COLORS.danger
    },
    loginButton: {
        paddingVertical: 16,
        alignItems: "center",
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.gold
    },
    loginText: {
        fontFamily: "Montserrat_800ExtraBold",
        fontSize: 17,
        color: COLORS.black
    },
    backButton: {
        marginTop: 28,
        alignSelf: "flex-start"
    },
    backText: {
        fontFamily: "Montserrat_600SemiBold",
        fontSize: 13,
        color: COLORS.gold
    }
});
