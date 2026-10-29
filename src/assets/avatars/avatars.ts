export const AVATARS = [
  { key: "avatar_01", source: require("@/assets/avatars/img/avatar_01.png") },
  { key: "avatar_02", source: require("@/assets/avatars/img/avatar_02.png") }
] as const;

export const DEFAULT_AVATAR = AVATARS[0].key;

export const avatarEmoji = (key?: string | null) =>
  AVATARS.find((avatar) => avatar.key === key)?.source ?? AVATARS[0].source;