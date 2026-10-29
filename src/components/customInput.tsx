import { useState } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

import { colors, fonts, radius, TOUCH_TARGET } from "@/theme";

interface CustomInputProps extends TextInputProps {
  // Você pode adicionar propriedades customizadas aqui no futuro (ex: ícones, mensagens de erro)
}

export default function CustomInput({ style, ...rest }: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        // Destaca a borda com a cor da marca quando o usuário clica no input
        isFocused && styles.containerFocused,
      ]}
    >
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.textMuted}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface2,
    width: "100%",
    minHeight: TOUCH_TARGET + 8,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  containerFocused: {
    borderColor: colors.primary,
  },
  input: {
    color: colors.text,
    fontFamily: fonts.text,
    fontSize: 16,
    width: "100%",
    height: "100%",
  },
});
