import { FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { deleteList, getLists } from "../../services/lists";
import type { ShoppingList, ShoppingListStatus } from "../../services/types";
import { colors, radius, spacing, TOUCH_TARGET, typography } from "../../theme";
import { errorMessage, LIST_STATUS } from "../../theme/listStatus";

const STATUS_FILTERS: { label: string; value?: ShoppingListStatus }[] = [
  { label: "Todas" },
  { label: LIST_STATUS.PLANNING.label, value: "PLANNING" },
  { label: LIST_STATUS.SHOPPING.label, value: "SHOPPING" },
  { label: LIST_STATUS.FINISHED.label, value: "FINISHED" },
];

export default function ListsScreen() {
  const router = useRouter();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [status, setStatus] = useState<ShoppingListStatus | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLists = useCallback(async () => {
    try {
      setError(null);
      const data = await getLists(status);
      setLists(data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [status]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadLists();
    }, [loadLists]),
  );

  const handleDelete = (list: ShoppingList) => {
    Alert.alert(
      "Esvaziar cestinha",
      `Esvaziar "${list.name}"? Os itens não poderão ser recuperados.`,
      [
        { text: "Voltar", style: "cancel" },
        {
          text: "Esvaziar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteList(list.id);
              setLists((prev) => prev.filter((item) => item.id !== list.id));
            } catch (err) {
              Alert.alert("Ops", errorMessage(err));
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas cestinhas</Text>

      <View style={styles.filters}>
        {STATUS_FILTERS.map((filter) => {
          const isSelected = filter.value === status;
          return (
            <TouchableOpacity
              key={filter.label}
              style={[styles.filter, isSelected && styles.filterSelected]}
              onPress={() => setStatus(filter.value)}
            >
              <Text
                style={[
                  styles.filterText,
                  isSelected && styles.filterTextSelected,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={lists}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadLists();
              }}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🧺</Text>
              <Text style={styles.emptyText}>
                {error ?? "Sua cestinha está vazia. Bora encher?"}
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const badge = LIST_STATUS[item.status];
            return (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.7}
                onPress={() =>
                  router.push({
                    pathname: "/planning",
                    params: { listId: String(item.id) },
                  })
                }
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.listName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.listDate}>
                    {new Date(item.createDate).toLocaleDateString("pt-BR")}
                  </Text>
                </View>

                <View
                  style={[
                    styles.badge,
                    { backgroundColor: `${badge.color}26` },
                  ]}
                >
                  <FontAwesome5
                    name={badge.icon}
                    size={11}
                    color={badge.color}
                  />
                  <Text style={[styles.badgeText, { color: badge.color }]}>
                    {badge.label}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item)}
                >
                  <FontAwesome5
                    name="trash-alt"
                    size={16}
                    color={colors.tertiary}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: 60,
  },
  title: {
    ...typography.screenTitle,
    color: colors.text,
    paddingHorizontal: spacing.screen,
    marginBottom: spacing.lg,
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    paddingHorizontal: spacing.screen,
    marginBottom: spacing.lg,
  },
  filter: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.surface2,
  },
  filterSelected: {
    backgroundColor: colors.primary,
  },
  filterText: {
    ...typography.label,
    color: colors.textSecondary,
  },
  filterTextSelected: {
    color: colors.onPrimary,
  },
  listContent: {
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface1,
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.md,
    minHeight: 56,
  },
  listName: {
    ...typography.itemName,
    color: colors.text,
  },
  listDate: {
    ...typography.numberSmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    gap: 6,
  },
  badgeText: {
    ...typography.label,
  },
  deleteButton: {
    width: TOUCH_TARGET,
    height: TOUCH_TARGET,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    alignItems: "center",
    paddingVertical: 60,
    gap: spacing.md,
  },
  emptyEmoji: {
    fontSize: 40,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
