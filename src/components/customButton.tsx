import {
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    ViewStyle,
} from "react-native";

import { colors, fonts, radius, TOUCH_TARGET } from "@/theme";

// Estendemos as props para aceitar estilos customizados de fora
interface CustomButtonProps {
  title: string;
  type?: "primary" | "secondary" | "outline" | "destructive";
  onPress: () => void;
  style?: StyleProp<ViewStyle>; // Permite customizar o container (largura, margem, etc)
  textStyle?: StyleProp<TextStyle>; // Permite customizar o texto (fonte, tamanho, etc)
}

export default function CustomButton({
  title,
  type = "primary",
  onPress,
  style,
  textStyle,
}: CustomButtonProps) {
  const isPrimary = type === "primary";
  const isDestructive = type === "destructive";

  // Definição dinâmica das cores de feedback visual (Active Opacity / Pressed)
  const getBackgroundColor = (pressed: boolean) => {
    if (isPrimary) return pressed ? "#D98A0A" : colors.primary;
    if (isDestructive) return pressed ? "#E05A5A" : colors.tertiary;
    if (type === "outline") return "transparent";
    return pressed ? "#2B3550" : colors.surface2;
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.buttonContainer,
        type === "outline" && styles.outlineButton,
        { backgroundColor: getBackgroundColor(pressed) },
        style, // O estilo passado por fora SEMPRE vem por último para sobrescrever o padrão
      ]}
    >
      <Text
        style={[
          styles.label,
          isPrimary || isDestructive
            ? styles.onFilledText
            : styles.onSurfaceText,
          textStyle, // Permite mudar fonte, tamanho, etc. na chamada do componente
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    minHeight: TOUCH_TARGET,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontFamily: fonts.textBold,
    fontSize: 16,
  },
  onFilledText: {
    color: colors.onPrimary,
  },
  onSurfaceText: {
    color: colors.text,
  },
});
