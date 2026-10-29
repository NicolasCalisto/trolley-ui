import { clearToken, getToken, saveToken } from "./session";

// Reaproveite a URL base que seus outros serviços já usam.
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "";

// O Render pode demorar para "acordar" a API na primeira chamada.
const TIMEOUT_MS = 60_000;

// ATENÇÃO: confira os nomes dos campos nos DTOs da API
// (RegisterRequestDto, LoginRequestDto, AuthResponseDto, UserProfileDto).
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
    const response = await fetch(`${API_URL}${path}`, {
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

// O cadastro já devolve o token: a pessoa entra logada.
export async function register(input: RegisterInput): Promise<void> {
  const data = await request<AuthResponse>("/auth/register", {
    method: "POST",
    body: input,
  });
  await saveToken(extractToken(data));
}

export async function login(input: LoginInput): Promise<void> {
  const data = await request<AuthResponse>("/auth/login", {
    method: "POST",
    body: input,
  });
  await saveToken(extractToken(data));
}

export async function logout(): Promise<void> {
  await clearToken();
}

export async function getProfile(): Promise<UserProfile> {
  return request<UserProfile>("/users/me", {
    method: "GET",
    token: await getToken(),
  });
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