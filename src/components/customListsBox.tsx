import { FontAwesome5 } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { ShoppingListStatus } from "@/services/types";
import {
  colors,
  fonts,
  radius,
  spacing,
  TOUCH_TARGET,
  typography,
} from "@/theme";
import { LIST_STATUS } from "@/theme/listStatus";

// Interface para a estrutura de dados da cestinha
export interface ShoppingListSummary {
  id: number;
  title: string;
  itemCount: number;
  checkedCount: number;
  estimate: number;
  status: ShoppingListStatus;
  date?: string;
}

interface RecentListsProps {
  lists: ShoppingListSummary[];
  onSeeAllPress?: () => void;
  onListPress?: (list: ShoppingListSummary) => void;
}

const currency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function CustomListsBox({
  lists,
  onSeeAllPress,
  onListPress,
}: RecentListsProps) {
  // Pega apenas as 3 primeiras cestinhas caso receba mais que isso
  const displayLists = lists.slice(0, 3);

  return (
    <View style={styles.container}>
      {/* CABEÇALHO DA SEÇÃO */}
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Cestinhas recentes</Text>
        {onSeeAllPress && (
          <TouchableOpacity onPress={onSeeAllPress} style={styles.seeAll}>
            <Text style={styles.seeAllText}>Ver todas</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* CARDS DAS CESTINHAS */}
      {displayLists.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>🧺</Text>
          <Text style={styles.emptyText}>
            Sua cestinha está vazia. Bora encher?
          </Text>
        </View>
      ) : (
        displayLists.map((item) => {
          const status = LIST_STATUS[item.status];
          const progress =
            item.itemCount > 0 ? item.checkedCount / item.itemCount : 0;

          return (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => onListPress && onListPress(item)}
            >
              <View style={styles.cardTop}>
                <View style={styles.leftContent}>
                  <Text style={styles.emoji}>🧺</Text>

                  <View style={styles.infoContainer}>
                    <Text style={styles.listTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.itemCountText}>
                      <Text style={styles.itemCountNumber}>
                        {item.itemCount}
                      </Text>
                      {item.itemCount === 1 ? " item" : " itens"} ·{" "}
                      <Text style={styles.itemCountNumber}>
                        {currency(item.estimate)}
                      </Text>
                    </Text>
                  </View>
                </View>

                <FontAwesome5
                  name="chevron-right"
                  size={12}
                  color={colors.textMuted}
                />
              </View>

              {/* Progresso da cestinha */}
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.round(progress * 100)}%`,
                      backgroundColor: status.color,
                    },
                  ]}
                />
              </View>

              <View
                style={[styles.badge, { backgroundColor: `${status.color}26` }]}
              >
                <FontAwesome5
                  name={status.icon}
                  size={11}
                  color={status.color}
                />
                <Text style={[styles.badgeText, { color: status.color }]}>
                  {status.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.text,
  },
  seeAll: {
    minHeight: TOUCH_TARGET,
    justifyContent: "center",
  },
  seeAllText: {
    ...typography.label,
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.surface1,
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: spacing.md,
  },
  emoji: {
    fontSize: 24,
  },
  infoContainer: {
    flex: 1,
    gap: 2,
  },
  listTitle: {
    ...typography.itemName,
    color: colors.text,
  },
  itemCountText: {
    fontFamily: fonts.text,
    fontSize: 13,
    color: colors.textSecondary,
  },
  itemCountNumber: {
    ...typography.numberSmall,
    color: colors.textSecondary,
  },
  progressTrack: {
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surface2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: radius.pill,
  },
  badge: {
    alignSelf: "flex-start",
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
  emptyCard: {
    backgroundColor: colors.surface1,
    padding: spacing.xl,
    borderRadius: radius.card,
    alignItems: "center",
    gap: spacing.md,
  },
  emptyEmoji: {
    fontSize: 32,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
