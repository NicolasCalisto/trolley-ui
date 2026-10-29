import CustomButton from "@/components/customButton";
import { colors, fonts, radius, spacing, typography } from "@/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const router = useRouter();
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Aqui entra a chamada para a sua API Spring Boot (/auth/login)
    console.log("Entrando com:", email, password);
    // Se der sucesso, redireciona para as abas principais
    router.replace("/tabs/home");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <Image
        source={require("@/assets/img/image_01.png")}
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
          onPress={() => router.push("/auth/register")}
        />

        <CustomButton
          title="Entrar"
          type="secondary"
          onPress={() => setIsLoginModalVisible(true)}
        />
      </View>

      {/* MODAL DE LOGIN */}
      <Modal
        visible={isLoginModalVisible}
        transparent={true}
        animationType="fade" // "fade" combina muito bem com modais centrais
        onRequestClose={() => setIsLoginModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Acessar conta</Text>
              <TouchableOpacity onPress={() => setIsLoginModalVisible(false)}>
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Entre com seu e-mail e senha para continuar.
            </Text>

            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <CustomButton
                title="Entrar na conta"
                type="primary"
                onPress={handleLogin}
              />
            </View>
          </View>
        </View>
      </Modal>
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
    height: 360,
    resizeMode: "contain",
    marginTop: 84,
    marginBottom: spacing.md,
  },
  titlePrincipal: {
    fontFamily: fonts.textBold,
    fontSize: 40,
    color: colors.primary,
    marginTop: spacing.md,
    margin: spacing.xl,
    textAlign: "center",
  },
  title: {
    ...typography.greeting,
    color: colors.text,
    marginTop: spacing.md,
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
    marginBottom: 120,
    paddingTop: spacing.xxl,
    gap: spacing.md,
  },
  // Estilos do Modal
  // Estilos do Modal Centralizado
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center", // Alinha ao centro verticalmente
    alignItems: "center", // Alinha ao centro horizontalmente
    paddingHorizontal: spacing.screen, // Garante respiro nas laterais em telas pequenas
  },
  modalContent: {
    backgroundColor: colors.surface1,
    width: "100%", // Ocupa a largura disponível respeitando o padding da overlay
    borderRadius: radius.lg, // Arredonda todos os cantos por igual
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  modalTitle: {
    fontFamily: fonts.textBold,
    fontSize: 22,
    color: colors.primary,
  },
  closeButtonText: {
    fontFamily: fonts.textMedium,
    fontSize: 14,
    color: colors.primary,
  },
  modalSubtitle: {
    fontFamily: fonts.text,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  formContainer: {
    gap: spacing.md,
  },
  input: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontFamily: fonts.text,
    fontSize: 16,
    color: colors.text,
  },
});
