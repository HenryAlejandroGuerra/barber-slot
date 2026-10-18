/* =====================================================
    mobile/src/components/layout/BrandHeader.tsx
===================================================== */
import { Image, StyleSheet, View } from "react-native";
import { COLORS } from "@/constants/theme";
import { IMAGES } from "@/constants/images";

export default function BrandHeader() {
    return (
        <View style={styles.container}>
            <Image source={IMAGES.brand.logoFull} style={styles.logo} resizeMode="contain" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
        backgroundColor: COLORS.adminHeader
    },
    logo: {
        width: 235,
        height: 80,
    }
});
