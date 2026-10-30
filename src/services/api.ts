import { getToken } from "./session"; // <--- 1. Importa a função que busca o token

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "https://trolley-api-3klp.onrender.com";

export interface ApiErrorResponse {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly response?: ApiErrorResponse;

  constructor(status: number, message: string, response?: ApiErrorResponse) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.response = response;
  }
}

type QueryValue = string | number | boolean | undefined | null;

export function buildQuery(params: Record<string, QueryValue>): string {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.append(key, String(value));
    }
  });

  const query = search.toString();
  return query ? `?${query}` : "";
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, signal } = options;

  // <--- 2. Recupera o token salvo (SecureStore ou localStorage)
  const token = await getToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      // <--- 3. Adiciona o cabeçalho Authorization se o token existir
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  const raw = await response.text();
  const data = raw ? safeParse(raw) : undefined;

  if (!response.ok) {
    const errorBody = (typeof data === "object" ? data : undefined) as
      | ApiErrorResponse
      | undefined;

    throw new ApiError(
      response.status,
      errorBody?.message ?? `Falha na requisição (${response.status})`,
      errorBody,
    );
  }

  return data as T;
}

function safeParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}