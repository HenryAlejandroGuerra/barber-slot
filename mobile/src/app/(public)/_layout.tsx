/* ================================================
    mobile/src/app/(public)/_layout.tsx
    Layout de la parte pública
================================================ */
import { Stack } from "expo-router";

export default function PublicLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }} />
    );
}
