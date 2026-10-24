/* ================================================
    mobile/src/app/(public)/_layout.tsx
    Layout de la parte pública
================================================ */
import { ReservaProvider } from "@/components/reservas/ReservaContext";
import { Stack } from "expo-router";

export default function PublicLayout() {
    return (
        <ReservaProvider><Stack screenOptions={{ headerShown: false }} /></ReservaProvider>
    );
}
