import { colors, fonts, radius, spacing } from "@/theme";
import { FontAwesome5 } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { ColorValue, StyleSheet, Text, View } from "react-native";

type TabIconProps = {
  name:
    | "home"
    | "shopping-basket"
    | "plus"
    | "heart"
    | "receipt-text-check-outline";
  label: string;
  color: ColorValue;
  focused: boolean;
};

// Aba ativa vira pílula âmbar com ícone e palavra; inativa fica só no ícone.
function TabIcon({ name, label, color, focused }: TabIconProps) {
  return (
    <View style={focused ? styles.activeTab : styles.inactiveTab}>
      <FontAwesome5 name={name} size={20} color={color} />
      {focused && <Text style={styles.activeLabel}>{label}</Text>}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // o rótulo vive dentro da pílula da aba ativa
        tabBarActiveTintColor: colors.onPrimary,
        tabBarInactiveTintColor: colors.textSecondary,
        sceneStyle: { backgroundColor: colors.bg },
        tabBarStyle: {
          backgroundColor: colors.surface1,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 76,
          paddingBottom: 0,
          paddingTop: spacing.md,
        },
      }}
    >
      {/* Rota 1: cestinhas/home */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="shopping-basket"
              label="Cestinhas"
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      {/* Rota 2: nova cestinha */}
      <Tabs.Screen
        name="newList"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="plus"
              label="Nova Cestinha"
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      {/* Rota 3: favoritos */}
      <Tabs.Screen
        name="favorites"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="heart"
              label="Favoritos"
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      {/* Rota 4: historico de compras */}
      <Tabs.Screen
        name="finished"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="receipt"
              label="Compras Feitas"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeTab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
  },
  activeLabel: {
    fontFamily: fonts.textMedium,
    fontSize: 13,
    color: colors.onPrimary,
  },
  inactiveTab: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    justifyContent: "center",
    alignItems: "center",
  },
});
