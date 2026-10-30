import CustomButton from "@/components/customButton";
import CustomInput from "@/components/customInput";
import { createList } from "@/services/lists";
import { colors, radius, spacing, TOUCH_TARGET, typography } from "@/theme";
import { errorMessage } from "@/theme/listStatus";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const suggestedName = () =>
  `Cestinha de ${new Date().toLocaleDateString("pt-BR")}`;

export default function NewList() {
  const router = useRouter();
  const [name, setName] = useState(suggestedName());
  const [creating, setCreating] = useState(false);

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert("Quase lá", "Dê um nome para a sua cestinha.");
      return;
    }

    try {
      setCreating(true);
      const list = await createList(trimmed);
      router.replace({
        pathname: "/tabs/planning",
        params: { listId: String(list.id) },
      });
    } catch (error) {
      Alert.alert("Ops", errorMessage(error));
      console.error("DETALHE DO ERRO DA API:", error?.response ?? error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          style={styles.backButton}
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace("/tabs/home")
          }
        >
          <FontAwesome5 name="arrow-left" size={18} color={colors.primary} />
        </Pressable>

        <Text style={styles.title}>Nova cestinha</Text>
        <Text style={styles.subtitle}>
          Dê um nome pra ela e já pode começar a encher.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nome da cestinha</Text>
          <CustomInput
            value={name}
            onChangeText={setName}
            placeholder="Ex.: Compras do mês"
            autoFocus
            maxLength={60}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />
        </View>

        <View style={styles.footer}>
          {creating ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <CustomButton
              title="Criar cestinha"
              type="primary"
              style={styles.button}
              onPress={handleSubmit}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.xxl,
    paddingTop: 56,
  },
  backButton: {
    width: TOUCH_TARGET,
    height: TOUCH_TARGET,
    borderRadius: radius.pill,
    backgroundColor: colors.surface1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.screenTitle,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  form: {
    marginTop: spacing.xxl,
    gap: spacing.md,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
  },
  footer: {
    marginTop: "auto",
    paddingTop: spacing.xxl,
  },
  button: {
    width: "100%",
  },
});
