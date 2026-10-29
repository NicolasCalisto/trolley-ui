import { AuthInput } from "@/components/authInput";
import CustomButton from "@/components/customButton";
import { authErrorMessage, register } from "@/services/auth";
import { colors, spacing, typography } from "@/theme";
import { AVATARS, DEFAULT_AVATAR } from "@/theme/avatars";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const CORAL = "#F87171"; // mova para "@/theme"
const HOME_ROUTE = "/tabs"; // ajuste para a rota da sua Home
const MIN_PASSWORD = 8; // ajuste se a API exigir outro mínimo

type FieldErrors = {
  username?: string;
  email?: string;
  password?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(username: string, email: string, password: string) {
  const errors: FieldErrors = {};
  if (username.trim().length < 2) {
    errors.username = "Conta pra gente como te chamar (mínimo 2 letras).";
  } else if (username.trim().length > 50) {
    errors.username = "Esse nome ficou grande demais (máximo 50 letras).";
  }
  if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = "Confira o e-mail, parece que algo ficou faltando.";
  }
  if (password.length < MIN_PASSWORD) {
    errors.password = `Use pelo menos ${MIN_PASSWORD} caracteres.`;
  }
  return errors;
}

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<string>(DEFAULT_AVATAR);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (loading) return;

    const found = validate(username, email, password);
    setErrors(found);
    setFormError(null);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    try {
      await register({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
        avatar,
      });
      router.replace(HOME_ROUTE);
    } catch (e) {
      setFormError(authErrorMessage(e, "register"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.brand}>Minha Cestinha</Text>

        <Text style={styles.title}>Vamos começar!</Text>
        <Text style={styles.subtitle}>
          Crie sua conta para guardar suas cestinhas.
        </Text>

        <View style={styles.form}>
          <View>
            <Text style={styles.label}>Escolha seu avatar</Text>
            <View style={styles.avatars}>
              {AVATARS.map(({ key, emoji }) => (
                <Pressable
                  key={key}
                  onPress={() => setAvatar(key)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: avatar === key }}
                  style={[
                    styles.avatar,
                    avatar === key && styles.avatarSelected,
                  ]}
                >
                  <Text style={styles.avatarEmoji}>{emoji}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <AuthInput
            label="Como podemos te chamar?"
            value={username}
            onChangeText={setUsername}
            placeholder="Seu nome"
            autoCapitalize="words"
            autoComplete="username"
            returnKeyType="next"
            error={errors.username}
          />

          <AuthInput
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="voce@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            returnKeyType="next"
            error={errors.email}
          />

          <AuthInput
            label="Senha"
            value={password}
            onChangeText={setPassword}
            placeholder={`Mínimo de ${MIN_PASSWORD} caracteres`}
            secure
            autoCapitalize="none"
            autoComplete="new-password"
            returnKeyType="done"
            onSubmitEditing={handleRegister}
            error={errors.password}
          />

          {!!formError && <Text style={styles.formError}>{formError}</Text>}

          <CustomButton
            title={loading ? "Criando sua conta..." : "Criar minha conta"}
            type="primary"
            onPress={handleRegister}
          />
        </View>

        <Pressable
          onPress={() => router.replace("/login")}
          hitSlop={12}
          style={styles.switchRow}
        >
          <Text style={styles.switchText}>
            Já tem conta? <Text style={styles.switchLink}>Entrar</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.xxl,
  },
  brand: {
    ...typography.screenTitle,
    color: colors.primary,
  },
  title: {
    ...typography.greeting,
    color: colors.text,
    marginTop: spacing.xxl,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  form: {
    gap: spacing.lg,
    marginTop: spacing.xl,
  },
  label: {
    ...typography.body,
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  avatars: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface1,
    borderWidth: 2,
    borderColor: "transparent",
  },
  avatarSelected: {
    borderColor: colors.primary,
  },
  avatarEmoji: {
    fontSize: 28,
  },
  formError: {
    ...typography.body,
    fontSize: 14,
    color: CORAL,
  },
  switchRow: {
    alignSelf: "center",
    marginTop: spacing.xl,
  },
  switchText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  switchLink: {
    fontWeight: "700",
    color: colors.primary,
  },
});