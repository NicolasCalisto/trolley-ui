import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme";

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Favoritos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: "center", alignItems: "center" },
  text: { color: colors.textPrimary, fontSize: 16 }
});