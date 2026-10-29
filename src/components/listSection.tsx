import { colors, spacing, typography } from "@/theme";
import { FontAwesome5 } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

// Valores que ainda não vi no seu tema: mova para "@/theme" quando puder.
const BLUE = "#60A5FA"; // cor secundária (link "Ver todas")
const GREEN = "#4ADE80"; // sucesso (cestinha concluída)
const TRACK = "#232C40"; // superfície 2 (trilho da barra e botão)
const CARD_RADIUS = 20;

export type ListStatus = "PLANNING" | "SHOPPING" | "FINISHED";

export type ListCardData = {
  id: number;
  title: string;
  status: ListStatus;
  itemCount: number;
  checkedCount: number;
  estimate: number;
  date: string; // data de criação (ISO)
};

type SectionProps = {
  title: string;
  total: number;
  lists: ListCardData[];
  onSeeAllPress: () => void;
  onListPress: (list: ListCardData) => void;
};

const currency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const itemsLabel = (count: number) =>
  `${count} ${count === 1 ? "item" : "itens"}`;

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

const timeAgo = (iso: string) => {
  const DAY = 24 * 60 * 60 * 1000;
  const days = Math.round(
    (startOfDay(new Date()) - startOfDay(new Date(iso))) / DAY,
  );
  if (days <= 0) return "hoje";
  if (days === 1) return "ontem";
  if (days < 7) return `há ${days} dias`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? "há 1 semana" : `há ${weeks} semanas`;
  }
  const months = Math.floor(days / 30);
  return months === 1 ? "há 1 mês" : `há ${months} meses`;
};

function ListCard({
  list,
  onPress,
}: {
  list: ListCardData;
  onPress: () => void;
}) {
  const progress =
    list.itemCount > 0 ? list.checkedCount / list.itemCount : 0;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.titleRow}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {list.title}
        </Text>
        {list.status === "FINISHED" && (
          <FontAwesome5 name="check-circle" size={16} color={GREEN} />
        )}
      </View>

      {list.status === "SHOPPING" && (
        <>
          <Text style={styles.meta}>Criada {timeAgo(list.date)}</Text>

          <View style={styles.progressRow}>
            <Text style={styles.progressText}>
              <Text style={styles.progressStrong}>{list.checkedCount}</Text> de{" "}
              {list.itemCount} na sacola
            </Text>
            <Text style={styles.meta}>Est. {currency(list.estimate)}</Text>
          </View>

          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                { width: `${Math.round(progress * 100)}%` },
              ]}
            />
          </View>

          <View style={styles.continueButton}>
            <Text style={styles.continueText}>Continuar comprando</Text>
            <FontAwesome5 name="arrow-right" size={14} color={colors.text} />
          </View>
        </>
      )}

      {list.status === "PLANNING" && (
        <Text style={styles.meta}>
          {itemsLabel(list.itemCount)} • Est. {currency(list.estimate)} • Criada{" "}
          {timeAgo(list.date)}
        </Text>
      )}

      {list.status === "FINISHED" && (
        <Text style={styles.meta}>
          {itemsLabel(list.itemCount)} • Est. {currency(list.estimate)}
        </Text>
      )}
    </Pressable>
  );
}

export function ListSection({
  title,
  total,
  lists,
  onSeeAllPress,
  onListPress,
}: SectionProps) {
  // Seção sem cestinhas não aparece (sem título vazio).
  if (total === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {total > lists.length && (
          <Pressable onPress={onSeeAllPress} hitSlop={12}>
            <Text style={styles.seeAll}>Ver todas ({total})</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.cards}>
        {lists.map((list) => (
          <ListCard
            key={list.id}
            list={list}
            onPress={() => onListPress(list)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.xxl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.body,
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  seeAll: {
    ...typography.body,
    fontWeight: "600",
    color: BLUE,
  },
  cards: {
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface1,
    borderRadius: CARD_RADIUS,
    padding: spacing.lg,
  },
  cardPressed: {
    opacity: 0.85,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.lg,
  },
  cardTitle: {
    ...typography.body,
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    flexShrink: 1,
  },
  meta: {
    ...typography.body,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.lg,
  },
  progressText: {
    ...typography.body,
    fontSize: 13,
    color: colors.text,
  },
  progressStrong: {
    fontWeight: "700",
    color: colors.primary,
  },
  track: {
    height: 6,
    borderRadius: 999,
    backgroundColor: TRACK,
    marginTop: spacing.xs,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    minHeight: 48,
    marginTop: spacing.lg,
    borderRadius: 999,
    backgroundColor: TRACK,
  },
  continueText: {
    ...typography.body,
    fontWeight: "600",
    color: colors.text,
  },
});