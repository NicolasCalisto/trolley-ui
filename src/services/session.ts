import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "trolley.token";

// Guarda o token em memória para evitar leituras repetidas do storage
let cachedToken: string | null = null;

export async function getToken(): Promise<string | null> {
  if (cachedToken) return cachedToken;

  if (Platform.OS === "web") {
    cachedToken =
      typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
  } else {
    cachedToken = await SecureStore.getItemAsync(TOKEN_KEY);
  }

  return cachedToken;
}

export async function saveToken(token: string): Promise<void> {
  cachedToken = token;

  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
    }
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
}

export async function clearToken(): Promise<void> {
  cachedToken = null;

  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}
