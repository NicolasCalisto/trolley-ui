import { AVATARS } from "@/assets/avatars/avatars"; // Importa a lista de avatares
import { colors, radius, TOUCH_TARGET } from "@/theme";
import { FontAwesome5 } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, View } from "react-native";

interface UserAvatarProps {
  avatarUri?: string | null;
  size?: number;
  onPress?: () => void;
}

export function UserAvatar({
  avatarUri,
  size = TOUCH_TARGET,
  onPress,
}: UserAvatarProps) {
  // Procura se o avatarUri é uma chave cadastrada (ex: "avatar_01")
  const matchedAvatar = AVATARS.find((a) => a.key === avatarUri);

  // Define a fonte da imagem: se achou na lista, usa o require source, senão tenta usar { uri: avatarUri }
  const imageSource = matchedAvatar
    ? matchedAvatar.source
    : avatarUri
      ? { uri: avatarUri }
      : null;

  const content = (
    <View style={[styles.container, { width: size, height: size }]}>
      {imageSource ? (
        <Image
          source={imageSource}
          style={[styles.image, { width: size, height: size }]}
        />
      ) : (
        <View style={styles.fallback}>
          <FontAwesome5 name="user" size={size * 0.45} color={colors.primary} />
        </View>
      )}
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.pill,
    overflow: "hidden",
    backgroundColor: colors.surface1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  fallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface1,
  },
});
