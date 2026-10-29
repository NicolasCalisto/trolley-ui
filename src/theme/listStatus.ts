import type { ShoppingListStatus } from "../services/types";
import { colors } from "./index";

/** Cor nunca é o único sinal: cada status carrega palavra e ícone. */
export const LIST_STATUS: Record<
  ShoppingListStatus,
  {
    label: string;
    color: string;
    icon: "clipboard-list" | "shopping-cart" | "check-circle";
  }
> = {
  PLANNING: {
    label: "Separando",
    color: colors.secondary,
    icon: "clipboard-list",
  },
  SHOPPING: {
    label: "No mercado",
    color: colors.primary,
    icon: "shopping-cart",
  },
  FINISHED: {
    label: "Tudo na sacola",
    color: colors.success,
    icon: "check-circle",
  },
};

export const ERROR_MESSAGE = "Ops, algo deu errado. Tenta de novo?";

export const errorMessage = (error: unknown) =>
  error instanceof Error && error.message ? error.message : ERROR_MESSAGE;

export const greeting = (name: string) => {
  const hour = new Date().getHours();
  if (hour < 12) return `Bom dia, ${name}!`;
  if (hour < 18) return `Boa tarde, ${name}!`;
  return `Boa noite, ${name}!`;
};
