import { FontAwesome5 } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { getProducts } from "../../services/products";
import type { Product } from "../../services/types";
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
import { ALL_CATEGORIES } from "./category";

interface ProductPickerModalProps {
  visible: boolean;
  category: string;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export function ProductPickerModal({
  visible,
  category,
  onClose,
  onSelectProduct,
}: ProductPickerModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts({
        active: true,
        category: category === ALL_CATEGORIES ? undefined : category,
      });
      setProducts(data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    if (visible) {
      loadProducts();
    }
  }, [visible, loadProducts]);

  const normalizedSearch = search.trim().toLowerCase();
  const visibleProducts = normalizedSearch
    ? products.filter((product) =>
        product.name.toLowerCase().includes(normalizedSearch),
      )
    : products;

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.indicator} />
          <Text style={styles.title}>O que vai pra cestinha?</Text>

          <TextInput
            style={styles.search}
            placeholder="Buscar produto"
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />

          {loading ? (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={{ marginTop: spacing.xxl }}
            />
          ) : error ? (
            <View style={styles.feedback}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={loadProducts}
              >
                <Text style={styles.retryText}>Tentar de novo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={visibleProducts}
              keyExtractor={(item) => String(item.id)}
              style={styles.list}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  Não achamos nada com esse nome.
                </Text>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.productRow}
                  onPress={() => onSelectProduct(item)}
                >
                  <Text style={styles.productEmoji}>
                    {categoryEmoji(item.category?.name)}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productMeta}>
                      {item.category?.name ?? "Sem categoria"} ·{" "}
                      <Text style={styles.productPrice}>
                        {(item.lastPrice ?? 0).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </Text>
                    </Text>
                  </View>
                  <FontAwesome5 name="plus" size={14} color={colors.primary} />
                </TouchableOpacity>
              )}
            />
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: colors.surface1,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    padding: spacing.xl,
    maxHeight: "80%",
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    alignSelf: "center",
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  search: {
    backgroundColor: colors.surface2,
    borderRadius: radius.input,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: TOUCH_TARGET,
    color: colors.text,
    fontFamily: fonts.text,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  list: {
    marginBottom: spacing.md,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface2,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    minHeight: 56,
    gap: spacing.md,
  },
  productEmoji: {
    fontSize: 20,
  },
  productName: {
    ...typography.itemName,
    color: colors.text,
  },
  productMeta: {
    fontFamily: fonts.text,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  productPrice: {
    ...typography.numberSmall,
    color: colors.textSecondary,
  },
  feedback: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
    gap: spacing.md,
  },
  errorText: {
    ...typography.body,
    color: colors.tertiary,
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
    fontSize: 15,
    color: colors.onPrimary,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    paddingVertical: spacing.xl,
  },
  closeButton: {
    minHeight: TOUCH_TARGET,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontFamily: fonts.textMedium,
    fontSize: 15,
    color: colors.textSecondary,
  },
});
