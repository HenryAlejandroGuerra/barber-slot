/* ================================================
    mobile/src/app/admin/index.tsx
    Inicio de sesión administrativo mediante Firebase Authentication, Google y Firestore.
================================================ */
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import AdminScreen from "@/components/admin/AdminScreen";
import BrandHeader from "@/components/layout/BrandHeader";
import { COLORS, RADIUS } from "@/constants/theme";
import { authService } from "@/services/auth.service";
import { usuarioService } from "@/services/usuario.service";

export default function AdminLoginScreen() {
    const [correo, setCorreo] = useState("");
    const [contra, setContra] = useState("");
    const [mostrarContra, setMostrarContra] = useState(false);
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);
    const [cargandoGoogle, setCargandoGoogle] = useState(false);
    const bloqueado = cargando || cargandoGoogle;

    async function validarAcceso(usuarioUid: string): Promise<boolean> {
        const perfil = await usuarioService.obtenerPerfil(usuarioUid);

        if (!perfil) {
            await authService.cerrarSesion();
            setError("Esta cuenta no tiene un perfil asociado al panel administrativo.");

            return false;
        }

        if (perfil.rol !== "administrador" && perfil.rol !== "barbero") {
            await authService.cerrarSesion();
            setError("Este usuario no tiene acceso al panel administrativo.");

            return false;
        }

        return true;
    }

    async function iniciarSesion() {
        setError("");
        const correoLimpio = correo.trim();

        if (!correoLimpio || !contra.trim()) {
            setError("Completa el correo electrónico y la contraseña.");
            return;
        }

        const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!correoValido.test(correoLimpio)) {
            setError("Ingresa un correo electrónico válido.");
            return;
        }

        setCargando(true);

        try {
            const usuario = await authService.iniciarSesion(correoLimpio, contra);
            const accesoPermitido = await validarAcceso(usuario.uid);

            if (!accesoPermitido) {
                return;
            }

            router.replace("/admin/inicio");
        } catch (error) {
            console.error(
                "Error al iniciar sesión:",
                error
            );

            setError(
                "Correo electrónico o contraseña incorrectos."
            );
        } finally {
            setCargando(false);
        }
    }

    async function iniciarSesionGoogle() {
        setError("");
        setCargandoGoogle(true);

        try {
            const usuario = await authService.iniciarSesionConGoogle();

            if (!usuario) {
                return;
            }

            const accesoPermitido = await validarAcceso(usuario.uid);

            if (!accesoPermitido) {
                return;
            }

            router.replace("/admin/inicio");
        } catch (error) {
            console.error("Error al iniciar sesión con Google:", error);

            setError("No se pudo iniciar sesión con Google.");
        } finally {
            setCargandoGoogle(false);
        }
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
                        editable={!bloqueado}
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
                            editable={!bloqueado}
                            onSubmitEditing={iniciarSesion}
                            style={styles.passwordInput}
                        />

                        <Pressable onPress={() => setMostrarContra(!mostrarContra)} disabled={bloqueado}>
                            <Ionicons name={mostrarContra ? "eye-off-outline" : "eye-outline"} size={23} color={COLORS.textSecondary} />
                        </Pressable>
                    </View>

                    <View style={styles.options}>
                        <View />
                        <Text style={styles.forgot}>
                            ¿Olvidaste tu contraseña?
                        </Text>
                    </View>

                    {error !== "" && (
                        <Text style={styles.error}>
                            {error}
                        </Text>
                    )}

                    <Pressable style={styles.loginButton} onPress={iniciarSesion} disabled={bloqueado}>
                        <Text style={styles.loginText}>
                            {cargando ? "INGRESANDO..." : "INGRESAR"}
                        </Text>
                    </Pressable>

                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>
                            O
                        </Text>
                        <View style={styles.divider} />
                    </View>

                    <Pressable style={styles.googleButton} onPress={iniciarSesionGoogle} disabled={bloqueado}>
                        <Ionicons name="logo-google" size={21} color={COLORS.textDark} />
                        <Text style={styles.googleText}>
                            {cargandoGoogle ? "CONECTANDO..." : "CONTINUAR CON GOOGLE"}
                        </Text>
                    </Pressable>
                </View>

                <Pressable style={styles.backButton} onPress={() => router.replace("/")} disabled={bloqueado}>
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
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.adminBorder
    },
    dividerText: {
        marginHorizontal: 12,
        fontFamily: "Montserrat_600SemiBold",
        fontSize: 12,
        color: COLORS.textSecondary
    },
    googleButton: {
        minHeight: 54,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.white
    },
    googleText: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 13,
        color: COLORS.textDark
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
