import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme";

export default function FinishedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Finalizados</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: "center", alignItems: "center" },
  text: { color: colors.text, fontSize: 16 }
});