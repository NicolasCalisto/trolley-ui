import { AVATARS, DEFAULT_AVATAR } from "@/assets/avatars/avatars";
import CustomButton from "@/components/customButton";
import { authErrorMessage, register } from "@/services/auth";
import { AuthInput } from "@/services/authInput";
import { colors, fonts, radius, spacing, typography } from "@/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Register() {
  const [currentStep, setCurrentStep] = useState(0);

  // Estados dos campos, avatar e modal de seleção
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Estados para o Modal Customizado de Feedback (Sucesso / Erro)
  const [modalFeedbackVisible, setModalFeedbackVisible] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalMessage, setModalMessage] = useState("");

  const handleBack = () => {
    if (currentStep === 1) {
      setCurrentStep(0);
      return true;
    } else {
      router.back();
      return true;
    }
  };

  useEffect(() => {
    const backAction = () => handleBack();
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    return () => backHandler.remove();
  }, [currentStep]);

  const handleNext = async () => {
    if (currentStep === 0) {
      if (!name.trim()) {
        Alert.alert(
          "Campo obrigatório",
          "Por favor, digite seu nome ou apelido.",
        );
        return;
      }
      setCurrentStep(1);
      return;
    }

    // Validações básicas antes de chamar a API
    if (!email.trim() || !email.includes("@")) {
      Alert.alert("E-mail inválido", "Por favor, insira um e-mail válido.");
      return;
    }

    if (!password || password.length < 6) {
      Alert.alert("Senha fraca", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    // --- Chamada real à API Spring Boot ---
    try {
      setIsLoading(true);
      const avatarKey = selectedAvatar || DEFAULT_AVATAR;

      console.log("iniciando registro");
      await register({
        username: name.trim(),
        email: email.trim(),
        password,
        avatar: avatarKey,
      });
      console.log("registro concluído com sucesso");

      // Sucesso: Configura o modal de sucesso
      setModalType("success");
      setModalMessage("PEGUE SUA CESTINHA!");
      setModalFeedbackVisible(true);
    } catch (error) {
      console.log("erro ao registrar:", error);
      const friendlyMessage = authErrorMessage(error, "register");
      // Erro: Configura o modal de erro
      setModalType("error");
      setModalMessage(friendlyMessage);
      setModalFeedbackVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Ação ao fechar o modal de feedback
  const handleModalClose = () => {
    setModalFeedbackVisible(false);
    if (modalType === "success") {
      router.replace("/tabs/home");
    }
    // Se for erro, apenas fecha e o usuário continua na tela de registro
  };

  const selectedAvatarSource = AVATARS.find(
    (a) => a.key === selectedAvatar,
  )?.source;

  return (
    <KeyboardAvoidingView
      style={styles.mainContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      {/* BOTÃO DE RETORNO FIXO NO TOPO ESQUERDO */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => handleBack()}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={24}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* 1. TOPO: Imagem Ilustrativa */}
        <Image
          source={require("@/assets/img/image_02.png")}
          style={styles.illustration}
        />

        {/* Título Principal */}
        <Text style={styles.titlePrincipal}>Minha Cestinha</Text>

        {/* Texto Amigável */}
        <Text style={styles.title}>Vamos criar sua conta.</Text>
        <Text style={styles.subtitle}>
          Nos informe seus dados para pegar uma cestinha exclusiva para você.
        </Text>

        {/* 2. INDICADOR DE PROGRESSO (Stories) */}
        <View style={styles.storiesIndicatorContainer}>
          <View
            style={[styles.storyBar, currentStep >= 0 && styles.storyBarActive]}
          />
          <View
            style={[styles.storyBar, currentStep >= 1 && styles.storyBarActive]}
          />
        </View>

        {/* 3. BLOCO DO CONTEÚDO DE CADASTRO */}
        <View style={styles.stepContainer}>
          {currentStep === 0 ? (
            // --- PASSO 1: Avatar em cima, Nome em baixo ---
            <View style={styles.stepContent}>
              <TouchableOpacity
                style={styles.avatarPickerButton}
                onPress={() => setIsAvatarModalVisible(true)}
                activeOpacity={0.8}
              >
                <View style={styles.avatarCircle}>
                  {selectedAvatarSource ? (
                    <Image
                      source={selectedAvatarSource}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="account-outline"
                      size={36}
                      color={colors.textSecondary}
                    />
                  )}
                </View>
                <Text style={styles.avatarPickerLabel}>
                  {selectedAvatar ? "Alterar avatar" : "Escolha seu avatar"}
                </Text>
              </TouchableOpacity>

              <View style={styles.inputGroup}>
                <AuthInput
                  label="Nome ou Apelido"
                  placeholder="Como podemos te chamar?"
                  autoCapitalize="words"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>
          ) : (
            // --- PASSO 2: E-mail e Senha ---
            <View style={styles.stepContent}>
              <View style={styles.inputGroup}>
                <AuthInput
                  label="E-mail"
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
                <AuthInput
                  label="Senha"
                  placeholder="Senha"
                  secure={true}
                  autoCapitalize="none"
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>
          )}
        </View>

        {/* 4. BOTÕES DE AÇÃO */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title={currentStep === 0 ? "Avançar" : "Criar conta"}
            type="primary"
            onPress={handleNext}
            disabled={isLoading}
          />

          {currentStep === 1 && (
            <CustomButton
              title="Voltar"
              type="secondary"
              onPress={handleBack}
              disabled={isLoading}
            />
          )}
        </View>
      </ScrollView>

      {/* MODAL DE SELEÇÃO DE AVATAR */}
      <Modal
        visible={isAvatarModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsAvatarModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Escolha um avatar</Text>
              <TouchableOpacity
                onPress={() => setIsAvatarModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Selecione o visual que mais combina com você:
            </Text>

            <ScrollView
              style={styles.modalScrollView}
              contentContainerStyle={styles.avatarGrid}
              showsVerticalScrollIndicator={true}
            >
              {AVATARS.map((avatar) => {
                const isSelected = selectedAvatar === avatar.key;
                return (
                  <TouchableOpacity
                    key={avatar.key}
                    onPress={() => {
                      setSelectedAvatar(avatar.key);
                      setIsAvatarModalVisible(false);
                    }}
                    style={[
                      styles.avatarOption,
                      isSelected && styles.avatarOptionSelected,
                    ]}
                  >
                    <Image source={avatar.source} style={styles.avatarImage} />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL CUSTOMIZADO DE FEEDBACK (SUCESSO / ERRO) */}
      <Modal
        visible={modalFeedbackVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.feedbackModalContent}>
            {modalType === "success" ? (
              <>
                <Text style={styles.feedbackTitle}>BOAS VINDAS</Text>
                <Text style={styles.feedbackSubtitle}>{modalMessage}</Text>
                <TouchableOpacity
                  style={styles.feedbackCenterButton}
                  onPress={handleModalClose}
                >
                  <Text style={styles.feedbackButtonText}>Ir para a Home</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.feedbackTitleError}>DESCULPE,</Text>
                <Text style={styles.feedbackTitleErrorSub}>
                  HOUVE UM PROBLEMA
                </Text>
                <Text style={styles.feedbackSubtitle}>{modalMessage}</Text>
                <TouchableOpacity
                  style={styles.feedbackCloseIconButton}
                  onPress={handleModalClose}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color={colors.text}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.screen,
    paddingTop: Platform.OS === "android" ? 50 : 44,
    paddingBottom: 100,
  },

  /* Botão de Retorno Absoluto no Topo Esquerdo */
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: spacing.screen,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    margin: spacing.md,
    marginTop: spacing.xxl,
    backgroundColor: colors.surface1,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },

  illustration: {
    width: "100%",
    height: 360,
    resizeMode: "contain",
    marginTop: 48,
    marginBottom: spacing.md,
  },
  titlePrincipal: {
    fontFamily: fonts.textBold,
    fontSize: 32,
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
    marginTop: spacing.xs,
    marginBottom: spacing.xxl,
    textAlign: "center",
  },

  storiesIndicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
    width: "100%",
  },
  storyBar: {
    flex: 1,
    maxWidth: 80,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
  },
  storyBarActive: {
    backgroundColor: colors.primary,
  },

  stepContainer: {
    width: "100%",
    marginTop: spacing.sm,
  },
  stepContent: {
    width: "100%",
    alignItems: "center",
  },

  avatarPickerButton: {
    alignItems: "center",
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  avatarCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: colors.surface1,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarPickerLabel: {
    fontFamily: fonts.textMedium,
    fontSize: typography.label.fontSize,
    color: colors.primary,
    marginBottom: spacing.xxl,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  inputGroup: {
    width: "100%",
    gap: spacing.md,
  },

  buttonContainer: {
    marginTop: spacing.xl,
    gap: spacing.md,
    width: "100%",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.screen,
  },
  modalContent: {
    backgroundColor: colors.surface1,
    width: "100%",
    maxHeight: "80%",
    borderRadius: radius.card,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  modalScrollView: {
    maxHeight: 320,
    width: "100%",
  },
  modalTitle: {
    ...typography.sectionTitle,
    color: colors.primary,
  },
  closeButtonText: {
    fontFamily: fonts.textMedium,
    fontSize: typography.label.fontSize,
    color: colors.primary,
  },
  modalSubtitle: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  avatarOption: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: colors.bg,
    overflow: "hidden",
  },
  avatarOptionSelected: {
    borderColor: colors.primary,
  },

  /* Estilos para o Modal Customizado de Feedback */
  feedbackModalContent: {
    backgroundColor: colors.surface1,
    width: "85%",
    borderRadius: radius.card,
    padding: spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  feedbackTitle: {
    fontFamily: fonts.textBold,
    fontSize: 24,
    color: colors.primary,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  feedbackTitleError: {
    fontFamily: fonts.textBold,
    fontSize: 22,
    color: "#F87171",
    textAlign: "center",
  },
  feedbackTitleErrorSub: {
    fontFamily: fonts.textBold,
    fontSize: 18,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  feedbackSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xl,
    marginTop: spacing.xs,
  },
  feedbackCenterButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: spacing.xxl,
    borderRadius: radius.pill,
    width: "100%",
    alignItems: "center",
  },
  feedbackButtonText: {
    fontFamily: fonts.textMedium,
    fontSize: 16,
    color: colors.bg,
  },
  feedbackCloseIconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.sm,
  },
});
