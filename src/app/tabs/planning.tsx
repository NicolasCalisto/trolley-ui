import { FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { ALL_CATEGORIES, CategoryTabs } from "../../components/modal/category";
import { ProductPickerModal } from "../../components/modal/productPicker";
import { getCategories } from "../../services/categories";
import {
    addListProduct,
    deleteListProduct,
    getListProducts,
    toggleListProductCheck,
    updateListProduct,
} from "../../services/listProducts";
import {
    duplicateLastList,
    getListById,
    updateListStatus,
} from "../../services/lists";
import type {
    Category,
    ListProduct,
    Product,
    ShoppingList,
} from "../../services/types";
import {
    colors,
    fonts,
    radius,
    spacing,
    TOUCH_TARGET,
    typography,
} from "../../theme";
import { categoryEmoji } from "../../theme/categoryEmoji";
import { errorMessage } from "../../theme/listStatus";

const currency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// A API pode devolver preços nulos enquanto o item nunca foi comprado.
const priceOf = (item: ListProduct) => item.currentPrice ?? item.basePrice ?? 0;

export default function PlanningScreen() {
  const router = useRouter();
  const { mode, listId } = useLocalSearchParams<{
    mode?: string;
    listId?: string;
  }>();

  const [list, setList] = useState<ShoppingList | null>(null);
  const [items, setItems] = useState<ListProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<string>(ALL_CATEGORIES);
  const [isCatalogVisible, setCatalogVisible] = useState(false);

  // Garante que a lista só seja criada/duplicada uma vez, mesmo com re-execuções do efeito.
  const bootstrapped = useRef(false);

  const resolveList = useCallback((): Promise<ShoppingList> => {
    if (listId) {
      return getListById(Number(listId));
    }
    if (mode === "duplicate") {
      return duplicateLastList();
    }
    return Promise.reject(new Error("Nenhuma cestinha escolhida."));
  }, [listId, mode]);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const currentList = await resolveList();
        setList(currentList);

        const [listItems, categoryList] = await Promise.all([
          getListProducts(currentList.id),
          getCategories(),
        ]);

        setItems(listItems);
        setCategories(categoryList);
      } catch (err) {
        setError(errorMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [resolveList]);

  // Filtragem por categoria, com o que já foi pego descendo para o fim da lista
  const filteredItems = useMemo(() => {
    const visible =
      selectedCategory === ALL_CATEGORIES
        ? items
        : items.filter(
            (item) => item.product.category?.name === selectedCategory,
          );

    return [...visible].sort((a, b) => Number(a.checked) - Number(b.checked));
  }, [items, selectedCategory]);

  const checkedCount = useMemo(
    () => items.filter((item) => item.checked).length,
    [items],
  );

  const progress = items.length > 0 ? checkedCount / items.length : 0;

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + priceOf(item) * item.plannedQuantity,
        0,
      ),
    [items],
  );

  // Alterar quantidade (PUT /list-products/{id} espera isChecked, a resposta traz checked)
  const handleUpdateQuantity = async (item: ListProduct, delta: number) => {
    const newQuantity = item.plannedQuantity + delta;
    if (newQuantity < 1) return;

    const previous = items;
    setItems((prev) =>
      prev.map((it) =>
        it.id === item.id ? { ...it, plannedQuantity: newQuantity } : it,
      ),
    );

    try {
      const updated = await updateListProduct(item.id, {
        plannedQuantity: newQuantity,
        actualQuantity: item.actualQuantity,
        currentPrice: priceOf(item),
        isChecked: item.checked,
      });
      setItems((prev) =>
        prev.map((it) => (it.id === updated.id ? updated : it)),
      );
    } catch (err) {
      setItems(previous);
      Alert.alert("Ops", errorMessage(err));
    }
  };

  // Remover item da cestinha
  const handleRemoveItem = async (item: ListProduct) => {
    const previous = items;
    setItems((prev) => prev.filter((it) => it.id !== item.id));

    try {
      await deleteListProduct(item.id);
    } catch (err) {
      setItems(previous);
      Alert.alert("Ops", errorMessage(err));
    }
  };

  // Marcar/desmarcar o item (POST /list-products/{id}/toggle-check)
  const handleToggleCheck = async (item: ListProduct) => {
    const previous = items;
    setItems((prev) =>
      prev.map((it) =>
        it.id === item.id ? { ...it, checked: !it.checked } : it,
      ),
    );

    try {
      const updated = await toggleListProductCheck(item.id);
      setItems((prev) =>
        prev.map((it) => (it.id === updated.id ? updated : it)),
      );
    } catch (err) {
      setItems(previous);
      Alert.alert("Ops", errorMessage(err));
    }
  };

  const handleAddProduct = async (product: Product) => {
    if (!list) return;
    setCatalogVisible(false);

    try {
      const created = await addListProduct({
        shoppingListId: list.id,
        productId: product.id,
        plannedQuantity: 1,
        basePrice: product.lastPrice ?? 0,
      });
      setItems((prev) => [...prev, created]);
    } catch (err) {
      Alert.alert("Ops", errorMessage(err));
    }
  };

  // Move a cestinha para "No mercado"
  const handleStartShopping = async () => {
    if (!list) return;
    if (items.length === 0) {
      Alert.alert(
        "Quase lá",
        "Coloque pelo menos um item antes de ir pro mercado.",
      );
      return;
    }

    try {
      await updateListStatus(list.id, "SHOPPING");
      router.replace("/tabs/lists");
    } catch (err) {
      Alert.alert("Ops", errorMessage(err));
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorEmoji}>🧺</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {list?.name ?? "Cestinha"}
          </Text>
          <Text style={styles.subtitle}>
            <Text style={styles.subtitleNumber}>{checkedCount}</Text>
            {" de "}
            <Text style={styles.subtitleNumber}>{items.length}</Text>
            {" na sacola"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setCatalogVisible(true)}
        >
          <FontAwesome5 name="plus" size={14} color={colors.onPrimary} />
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      {/* PROGRESSO DA CESTINHA */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.round(progress * 100)}%`,
              backgroundColor: progress === 1 ? colors.success : colors.primary,
            },
          ]}
        />
      </View>

      {/* BARRA DE CATEGORIAS (GET /categories) */}
      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* ITENS DA CESTINHA (GET /list-products/list/{id}) */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🧺</Text>
            <Text style={styles.emptyText}>
              Sua cestinha está vazia. Bora encher?
            </Text>
            <Text style={styles.emptySubtext}>
              {selectedCategory === ALL_CATEGORIES
                ? 'Toque em "Adicionar" para buscar itens do catálogo.'
                : `Nada de ${selectedCategory} por aqui ainda.`}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            {/* CHECKBOX GRANDE */}
            <TouchableOpacity
              style={[styles.checkbox, item.checked && styles.checkboxChecked]}
              onPress={() => handleToggleCheck(item)}
            >
              {item.checked && (
                <FontAwesome5 name="check" size={12} color={colors.onPrimary} />
              )}
            </TouchableOpacity>

            <Text style={styles.itemEmoji}>
              {categoryEmoji(item.product.category?.name)}
            </Text>

            <View style={styles.itemInfo}>
              <Text
                style={[
                  styles.itemName,
                  item.checked && styles.itemNameChecked,
                ]}
                numberOfLines={1}
              >
                {item.product.name}
              </Text>
              <Text style={styles.itemCategory}>
                {item.product.category?.name ?? "Sem categoria"} ·{" "}
                <Text style={styles.itemPrice}>{currency(priceOf(item))}</Text>
              </Text>
            </View>

            {/* CONTROLES DE QUANTIDADE */}
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => handleUpdateQuantity(item, -1)}
              >
                <FontAwesome5 name="minus" size={12} color={colors.primary} />
              </TouchableOpacity>

              <Text style={styles.qtyText}>{item.plannedQuantity}</Text>

              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => handleUpdateQuantity(item, 1)}
              >
                <FontAwesome5 name="plus" size={12} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {/* BOTÃO REMOVER */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleRemoveItem(item)}
            >
              <FontAwesome5
                name="trash-alt"
                size={16}
                color={colors.tertiary}
              />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* RODAPÉ / BOTÃO IR PRO MERCADO */}
      <View style={styles.footer}>
        <Text style={styles.totalText}>
          Estimativa: <Text style={styles.totalValue}>{currency(total)}</Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.startShoppingButton,
            items.length === 0 && styles.disabledButton,
          ]}
          onPress={handleStartShopping}
          disabled={items.length === 0}
        >
          <FontAwesome5
            name="shopping-cart"
            size={16}
            color={colors.onPrimary}
          />
          <Text style={styles.startShoppingText}>
            Ir pro mercado ({items.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ProductPickerModal
        visible={isCatalogVisible}
        category={selectedCategory}
        onClose={() => setCatalogVisible(false)}
        onSelectProduct={handleAddProduct}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: 56,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.xxl,
  },
  errorEmoji: {
    fontSize: 40,
  },
  errorText: {
    ...typography.body,
    color: colors.text,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    minHeight: TOUCH_TARGET,
    justifyContent: "center",
  },
  retryText: {
    fontFamily: fonts.textBold,
    fontSize: 16,
    color: colors.onPrimary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.screen,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  title: {
    ...typography.screenTitle,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.text,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  subtitleNumber: {
    ...typography.numberSmall,
    color: colors.textSecondary,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    minHeight: TOUCH_TARGET,
    gap: spacing.sm,
  },
  addButtonText: {
    fontFamily: fonts.textMedium,
    fontSize: 13,
    color: colors.onPrimary,
  },
  progressTrack: {
    height: 6,
    marginHorizontal: spacing.screen,
    marginBottom: spacing.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.surface2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: radius.pill,
  },
  listContainer: {
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.screen,
    gap: spacing.md,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface1,
    padding: spacing.md,
    borderRadius: radius.card,
    minHeight: 56,
    gap: spacing.md,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  itemEmoji: {
    fontSize: 20,
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    ...typography.itemName,
    color: colors.text,
  },
  itemNameChecked: {
    color: colors.textMuted,
    textDecorationLine: "line-through",
  },
  itemCategory: {
    fontFamily: fonts.text,
    fontSize: 13,
    color: colors.textSecondary,
  },
  itemPrice: {
    ...typography.numberSmall,
    color: colors.textSecondary,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface2,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
  },
  qtyButton: {
    width: 32,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    ...typography.number,
    color: colors.text,
    minWidth: 18,
    textAlign: "center",
  },
  deleteButton: {
    width: TOUCH_TARGET - 8,
    height: TOUCH_TARGET - 8,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: spacing.sm,
  },
  emptyEmoji: {
    fontSize: 40,
  },
  emptyText: {
    ...typography.sectionTitle,
    color: colors.text,
  },
  emptySubtext: {
    ...typography.body,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: spacing.screen,
  },
  footer: {
    padding: spacing.screen,
    backgroundColor: colors.surface1,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    gap: spacing.md,
  },
  totalText: {
    fontFamily: fonts.text,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
  },
  totalValue: {
    ...typography.number,
    color: colors.text,
  },
  startShoppingButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: TOUCH_TARGET,
    paddingVertical: spacing.lg,
    borderRadius: radius.pill,
    gap: spacing.sm,
  },
  disabledButton: {
    opacity: 0.5,
  },
  startShoppingText: {
    fontFamily: fonts.textBold,
    fontSize: 16,
    color: colors.onPrimary,
  },
});
