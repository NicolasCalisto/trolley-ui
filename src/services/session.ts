import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "trolley.token";
const USER_INFO_KEY = "trolley.user_info";

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
      localStorage.removeItem(USER_INFO_KEY);
    }
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_INFO_KEY);
  }
}

export async function saveSession(
  token: string,
  user: {
    id: string;
    username: string;
    email: string;
    avatar: string | null;
  },
): Promise<void> {
  await saveToken(token);

  const userString = JSON.stringify(user);

  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_INFO_KEY, userString);
    }
  } else {
    await SecureStore.setItemAsync(USER_INFO_KEY, userString);
  }
}

export async function getUserInfo(): Promise<{
  id: string;
  username: string;
  email: string;
  avatar: string | null;
} | null> {
  let data: string | null = null;

  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      data = localStorage.getItem(USER_INFO_KEY);
    }
  } else {
    data = await SecureStore.getItemAsync(USER_INFO_KEY);
  }

  return data ? JSON.parse(data) : null;
}
