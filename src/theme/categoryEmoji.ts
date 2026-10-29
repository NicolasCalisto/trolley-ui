const EMOJI_BY_CATEGORY: Record<string, string> = {
  acougue: "🥩",
  hortifruti: "🍎",
  laticinios: "🧀",
  padaria: "🥖",
  bebidas: "🥤",
  mercearia: "🍝",
  limpeza: "🧴",
  "higiene pessoal": "🧼",
  congelados: "🧊",
  "pet shop": "🐶",
};

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export const categoryEmoji = (category?: string | null) =>
  (category && EMOJI_BY_CATEGORY[normalize(category)]) || "🛒";
