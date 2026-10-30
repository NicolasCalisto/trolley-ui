import { UserAvatar } from "@/assets/avatars/userAvatar";
import CustomButton from "@/components/customButton";
import {
  ListSection,
  type ListCardData,
  type ListStatus,
} from "@/components/listSection";
import { CreateListModal } from "@/components/modal/createOrCopyModal";
import { getListProducts } from "@/services/listProducts";
import { getLists } from "@/services/lists";
import { getUserInfo } from "@/services/session";
import type { ListProduct, ShoppingList } from "@/services/types";
import { colors, radius, spacing, typography } from "@/theme";
import { errorMessage, greeting } from "@/theme/listStatus";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Quantas cestinhas aparecem em cada seção da Home.
const PER_GROUP = 2;

// Ordem em que as seções aparecem na tela.
const SECTIONS: { status: ListStatus; title: string }[] = [
  { status: "SHOPPING", title: "No mercado" }, // em compra
  { status: "PLANNING", title: "Separando" }, // sendo montada
  { status: "FINISHED", title: "Tudo na sacola" }, // finalizada
];

type Group = { total: number; items: ListCardData[] };
type Groups = Record<ListStatus, Group>;

const EMPTY_GROUPS: Groups = {
  SHOPPING: { total: 0, items: [] },
  PLANNING: { total: 0, items: [] },
  FINISHED: { total: 0, items: [] },
};

const toCard = (list: ShoppingList, items: ListProduct[]): ListCardData => ({
  id: list.id,
  title: list.name,
  status: list.status,
  itemCount: items.length,
  checkedCount: items.filter((item) => item.checked).length,
  estimate: items.reduce(
    (sum, item) =>
      sum + (item.currentPrice ?? item.basePrice ?? 0) * item.plannedQuantity,
    0,
  ),
  date: list.createDate,
});

export default function Home() {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [groups, setGroups] = useState<Groups>(EMPTY_GROUPS);
  const [loading, setLoading] = useState(true);

  const [userName, setUserName] = useState<string>("");
  const [userAvatar, setUserAvatar] = useState<string>("");

  console.log("usuario", userName, "", userAvatar);

  const loadHome = useCallback(async () => {
    try {
      // Carrega os dados do usuário e as listas em paralelo
      const [userInfo, allLists] = await Promise.all([
        getUserInfo().catch(() => null),
        getLists(),
      ]);

      if (userInfo) {
        if (userInfo.username) setUserName(userInfo.username);
        if (userInfo.avatar) setUserAvatar(userInfo.avatar);
      }

      // Mais recentes primeiro.
      const sorted = [...allLists].sort(
        (a, b) =>
          new Date(b.createDate).getTime() - new Date(a.createDate).getTime(),
      );

      // Separa por status e pega só as que aparecem na Home.
      const byStatus = (status: ListStatus) =>
        sorted.filter((list) => list.status === status);

      const shown = SECTIONS.flatMap(({ status }) =>
        byStatus(status).slice(0, PER_GROUP),
      );

      // Itens só das cestinhas exibidas (progresso e estimativa).
      const entries = await Promise.all(
        shown.map(
          async (list) => [list.id, await getListProducts(list.id)] as const,
        ),
      );
      const itemsByList = Object.fromEntries(entries);

      const next = { ...EMPTY_GROUPS };
      SECTIONS.forEach(({ status }) => {
        const all = byStatus(status);
        next[status] = {
          total: all.length,
          items: all
            .slice(0, PER_GROUP)
            .map((list) => toCard(list, itemsByList[list.id] ?? [])),
        };
      });

      setGroups(next);
    } catch (error) {
      Alert.alert("Ops", errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHome();
    }, [loadHome]),
  );

  const hasAnyList = SECTIONS.some(({ status }) => groups[status].total > 0);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: spacing.xxl }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.topBox}>
        <Text style={styles.titlePrincipal}>Minha Cestinha</Text>

        {/* Substituído pelo componente reaproveitável */}
        <View style={styles.userIconBox}>
          <UserAvatar
            size={40}
            avatarUri={userAvatar}
            onPress={() => {
              // Exemplo: ir para a tela de perfil/configurações ao clicar no avatar
              // router.push("/tabs/profile");
            }}
          />
        </View>
      </View>

      <Text style={styles.title}>{greeting(userName)}</Text>
      <Text style={styles.subtitle}>O que vai pra cestinha hoje?</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: spacing.xl }}
        />
      ) : hasAnyList ? (
        SECTIONS.map(({ status, title }) => (
          <ListSection
            key={status}
            title={title}
            total={groups[status].total}
            lists={groups[status].items}
            onSeeAllPress={() =>
              router.push({ pathname: "/tabs/lists", params: { status } })
            }
            onListPress={(list) =>
              router.push({
                pathname: "/tabs/planning",
                params: { listId: String(list.id) },
              })
            }
          />
        ))
      ) : (
        <Text style={styles.empty}>Sua cestinha está vazia. Bora encher?</Text>
      )}

      {/* Botão no final da página */}
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Nova cestinha"
          type="primary"
          onPress={() => setIsModalVisible(true)}
        />
      </View>

      <CreateListModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onCreateBlank={() => {
          setIsModalVisible(false);
          router.push("/tabs/newList");
        }}
        onCopied={(list) => {
          setIsModalVisible(false);
          router.push({
            pathname: "/tabs/planning",
            params: { listId: String(list.id) },
          });
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.screen,
  },
  topBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xxl,
  },
  userIconBox: {
    marginLeft: "auto",
  },
  userIcon: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
  },
  titlePrincipal: {
    ...typography.screenTitle,
    color: colors.primary,
  },
  title: {
    ...typography.greeting,
    color: colors.text,
    marginTop: spacing.xxl,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  empty: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.xxl,
  },
  buttonContainer: {
    marginTop: spacing.xxl,
    width: "100%",
  },
});
