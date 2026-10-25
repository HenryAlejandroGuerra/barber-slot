/* ================================================
    mobile/src/app/_layout.tsx
    Layout raíz de BarberSlot Mobile
================================================ */
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_800ExtraBold, useFonts } from "@expo-google-fonts/montserrat";

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_500Medium,
        Montserrat_600SemiBold,
        Montserrat_700Bold,
        Montserrat_800ExtraBold,
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }} />
        </>
    );
}
