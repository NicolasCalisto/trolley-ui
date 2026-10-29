import { colors, spacing, TOUCH_TARGET, typography } from "@/theme";
import { FontAwesome5 } from "@expo/vector-icons";
import { useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    type TextInputProps,
    View,
} from "react-native";

const CORAL = "#F87171"; // cor de erro (terciária); mova para "@/theme"
const INPUT_RADIUS = 16;

type Props = TextInputProps & {
  label: string;
  error?: string | null;
  secure?: boolean; // campo de senha, com botão de mostrar/esconder
};

export function AuthInput({ label, error, secure, ...inputProps }: Props) {
  const [hidden, setHidden] = useState(!!secure);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.field, !!error && styles.fieldError]}>
        <TextInput
          {...inputProps}
          secureTextEntry={secure ? hidden : false}
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
        />

        {secure && (
          <Pressable
            onPress={() => setHidden((current) => !current)}
            hitSlop={12}
            accessibilityLabel={hidden ? "Mostrar senha" : "Esconder senha"}
          >
            <FontAwesome5
              name={hidden ? "eye" : "eye-slash"}
              size={18}
              color={colors.textSecondary}
            />
          </Pressable>
        )}
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  label: {
    ...typography.body,
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: TOUCH_TARGET,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface1,
    borderRadius: INPUT_RADIUS,
    borderWidth: 1,
    borderColor: "transparent",
  },
  fieldError: {
    borderColor: CORAL,
  },
  input: {
    ...typography.body,
    flex: 1,
    color: colors.text,
    paddingVertical: spacing.xs,
  },
  error: {
    ...typography.body,
    fontSize: 13,
    color: CORAL,
    marginTop: spacing.xs,
  },
});