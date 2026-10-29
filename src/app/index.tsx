import CustomButton from "@/components/customButton";
import { colors, fonts, spacing, typography } from "@/theme";
import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <Image
        source={require("@/assets/image.png")}
        style={styles.illustration}
      />

      <Text style={styles.titlePrincipal}>Minha Cestinha</Text>

      <Text style={styles.title}>Suas compras, sem complicação.</Text>

      <Text style={styles.subtitle}>
        Monte suas cestinhas, acompanhe o que já foi pra sacola e saiba quanto
        vai gastar antes de chegar no caixa.
      </Text>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Criar conta"
          type="primary"
          onPress={() => router.push("/login")}
        />

        <CustomButton
          title="Entrar"
          type="secondary"
          onPress={() => router.push("/tabs/home")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.screen,
  },
  illustration: {
    width: "100%",
    height: 280,
    resizeMode: "contain",
    marginTop: 48,
  },
  titlePrincipal: {
    fontFamily: fonts.textBold,
    fontSize: 40,
    color: colors.primary,
    marginTop: spacing.xl,
    textAlign: "center",
  },
  title: {
    ...typography.greeting,
    color: colors.text,
    marginTop: spacing.lg,
    textAlign: "center",
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: "auto",
    marginBottom: spacing.xxl,
    paddingTop: spacing.xxl,
    gap: spacing.md,
  },
});
