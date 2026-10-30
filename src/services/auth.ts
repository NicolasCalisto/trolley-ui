import { API_BASE_URL } from "./api";
import { clearSession, getToken, saveSession } from "./session";

// O Render pode demorar para "acordar" a API na primeira chamada.
const TIMEOUT_MS = 60_000;

export type RegisterInput = {
  username: string;
  email: string;
  password: string;
  avatar?: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

type AuthResponse = { token?: string; accessToken?: string };

export type UserProfile = {
  id: string;
  username: string;
  email: string;
  avatar?: string | null;
};

export class AuthError extends Error {
  constructor(
    public status: number | null,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(
  path: string,
  options: { method: "GET" | "POST"; body?: unknown; token?: string | null },
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method,
      headers: {
        "Content-Type": "application/json",
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new AuthError(response.status, `HTTP ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError(null, "Sem resposta do servidor");
  } finally {
    clearTimeout(timer);
  }
}

const extractToken = (data: AuthResponse): string => {
  const token = data.token ?? data.accessToken;
  if (!token) throw new AuthError(null, "A resposta não trouxe o token");
  return token;
};

// Busca perfil passando token opcionalmente (garante autenticação imediata)
export async function getProfile(overrideToken?: string): Promise<UserProfile> {
  const token = overrideToken ?? (await getToken());
  return request<UserProfile>("/users/me", {
    method: "GET",
    token,
  });
}

// O cadastro devolve o token e já salva a sessão completa
export async function register(input: RegisterInput): Promise<UserProfile> {
  const data = await request<AuthResponse>("/auth/register", {
    method: "POST",
    body: input,
  });

  const token = extractToken(data);
  const profile = await getProfile(token);

  await saveSession(token, {
    id: String(profile.id ?? ""),
    username: profile.username,
    email: profile.email,
    avatar: profile.avatar ?? null,
  });

  return profile;
}

// O login obtém o token, busca o perfil e salva no storage local
export async function login(input: LoginInput): Promise<UserProfile> {
  const data = await request<AuthResponse>("/auth/login", {
    method: "POST",
    body: input,
  });

  const token = extractToken(data);
  const profile = await getProfile(token);

  await saveSession(token, {
    id: String(profile.id ?? ""),
    username: profile.username,
    email: profile.email,
    avatar: profile.avatar ?? null,
  });

  return profile;
}

// Limpa token e dados do usuário na saída
export async function logout(): Promise<void> {
  await clearSession();
}

export function authErrorMessage(
  error: unknown,
  context: "login" | "register",
): string {
  if (error instanceof AuthError) {
    switch (error.status) {
      case null:
        return "Não consegui falar com o servidor. Confira a internet e tente de novo.";
      case 400:
        return "Confira os dados e tente de novo.";
      case 409:
        return "Esse e-mail já tem cadastro. Que tal entrar?";
      case 401:
      case 403:
        return context === "login"
          ? "E-mail ou senha incorretos."
          : "Não consegui criar sua conta agora. Tenta de novo?";
    }
  }
  return "Ops, algo deu errado. Tenta de novo?";
}
