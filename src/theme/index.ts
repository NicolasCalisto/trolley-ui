export const colors = {
  bg: "#121826",
  surface1: "#1A2233",
  surface2: "#232C40",
  border: "#2E384D",
  primary: "#F59E0B",
  secondary: "#60A5FA",
  tertiary: "#F87171",
  success: "#4ADE80",
  text: "#F5EFE6",
  textSecondary: "#C9BFAE",
  textMuted: "#8B93A7",
  onPrimary: "#121826",
} as const;

export const radius = {
  card: 20,
  input: 16,
  pill: 999,
  sheet: 28,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  screen: 20,
} as const;

/** Quicksand para texto, Inter para números (sempre com algarismos tabulares). */
export const fonts = {
  text: "Quicksand_500Medium",
  textMedium: "Quicksand_600SemiBold",
  textBold: "Quicksand_700Bold",
  number: "Inter_600SemiBold",
  numberBold: "Inter_700Bold",
  numberLight: "Inter_500Medium",
} as const;

export const typography = {
  screenTitle: { fontFamily: fonts.textBold, fontSize: 24 },
  greeting: { fontFamily: fonts.textMedium, fontSize: 20 },
  sectionTitle: { fontFamily: fonts.textBold, fontSize: 18 },
  itemName: { fontFamily: fonts.textMedium, fontSize: 16 },
  body: { fontFamily: fonts.text, fontSize: 16, lineHeight: 22 },
  label: { fontFamily: fonts.textMedium, fontSize: 13 },
  numberHighlight: {
    fontFamily: fonts.numberBold,
    fontSize: 28,
    fontVariant: ["tabular-nums"] as const,
  },
  number: {
    fontFamily: fonts.number,
    fontSize: 16,
    fontVariant: ["tabular-nums"] as const,
  },
  numberSmall: {
    fontFamily: fonts.numberLight,
    fontSize: 13,
    fontVariant: ["tabular-nums"] as const,
  },
} as const;

/** Alvo mínimo de toque pensado para uso com uma mão só. */
export const TOUCH_TARGET = 48;
