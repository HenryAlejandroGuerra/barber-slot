/* ================================================
    mobile/src/constants/theme.ts
    Identidad visual de BarberSlot
================================================ */
export const COLORS = {
    // Marca
    gold: "#D9A94E",

    // Público
    publicBackground: "#FFFFFF",
    black: "#0D0D0D",
    white: "#FFFFFF",

    // Administración
    adminBackground: "#0D1118",
    adminHeader: "#0D0D0D",
    adminSurface: "#10151D",
    adminSurfaceSoft: "#151A23",
    adminBorder: "#A77B2E",

    // Texto
    textPrimary: "#FFFFFF",
    textSecondary: "#AEB3BD",
    textDark: "#111111",

    // Estados
    success: "#22C55E",
    danger: "#EF4444",
    warning: "#D9A94E",
} as const;

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
} as const;

export const RADIUS = {
    sm: 8,
    md: 14,
    lg: 20,
    xl: 26,
    pill: 999,
} as const;
