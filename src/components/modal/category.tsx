import { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import type { Category } from "../../services/types";
import { colors, radius, spacing, typography } from "../../theme";

export const ALL_CATEGORIES = "Todas";

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
}

export function CategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryTabsProps) {
  const tabs = useMemo(
    () => [ALL_CATEGORIES, ...categories.map((category) => category.name)],
    [categories],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tabs}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(name) => name}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isSelected = item === selectedCategory;

          return (
            <Pressable
              onPress={() => onSelectCategory(item)}
              style={[
                styles.tab,
                isSelected ? styles.selectedTab : styles.unselectedTab,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  isSelected
                    ? styles.selectedTabText
                    : styles.unselectedTabText,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  listContent: {
    paddingHorizontal: spacing.screen,
    gap: spacing.sm,
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedTab: {
    backgroundColor: colors.primary,
  },
  unselectedTab: {
    backgroundColor: colors.surface2,
  },
  tabText: {
    ...typography.label,
  },
  selectedTabText: {
    color: colors.onPrimary,
  },
  unselectedTabText: {
    color: colors.textSecondary,
  },
});
