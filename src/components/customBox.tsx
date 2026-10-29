import React from "react";
import { DimensionValue, StyleSheet, Text, View } from "react-native";

import { colors, radius, typography } from "@/theme";

interface CustomBox {
  value: string | number;
  label: string;
  valueColor?: string;
  width?: DimensionValue;
}

export const CustomBox: React.FC<CustomBox> = ({
  value,
  label,
  valueColor = colors.text,
  width = "31%",
}) => {
  return (
    <View style={[styles.container, { width }]}>
      <Text
        style={[styles.value, { color: valueColor }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface1,
    borderRadius: radius.card,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    minHeight: 104,
  },
  value: {
    ...typography.numberHighlight,
    fontSize: 24,
    textAlign: "center",
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
