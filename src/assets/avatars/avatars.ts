export const AVATARS = [
  { key: "avatar_01", source: require("@/assets/avatars/img/avatar_01.png") },
  { key: "avatar_02", source: require("@/assets/avatars/img/avatar_02.png") },
  { key: "avatar_03", source: require("@/assets/avatars/img/avatar_03.png") },
  { key: "avatar_04", source: require("@/assets/avatars/img/avatar_04.png") },
  { key: "avatar_05", source: require("@/assets/avatars/img/avatar_05.png") },
  { key: "avatar_06", source: require("@/assets/avatars/img/avatar_06.png") },
  { key: "avatar_07", source: require("@/assets/avatars/img/avatar_07.png") },
] as const;

export const DEFAULT_AVATAR = AVATARS[0].key;

export const avatarEmoji = (key?: string | null) =>
  AVATARS.find((avatar) => avatar.key === key)?.source ?? AVATARS[0].source;