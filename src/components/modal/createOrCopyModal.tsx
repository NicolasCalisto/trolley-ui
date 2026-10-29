import { FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

import { addListProduct, getListProducts } from "../../services/listProducts";
import { createList, getLists } from "../../services/lists";
import type { ShoppingList } from "../../services/types";
import {
    colors,
    fonts,
    radius,
    spacing,
    TOUCH_TARGET,
    typography,
} from "../../theme";
import { errorMessage, LIST_STATUS } from "../../theme/listStatus";

const RECENT_LIMIT = 3;

interface CreateOrCopyModal {
  visible: boolean;
  onClose: () => void;
  onCreateBlank: () => void;
  onCopied: (list: ShoppingList) => void;
}

export const CreateListModal: React.FC<CreateOrCopyModal> = ({
  visible,
  onClose,
  onCreateBlank,
  onCopied,
}) => {
  const [step, setStep] = useState<"OPTIONS" | "COPY">("OPTIONS");
  const [recentLists, setRecentLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(false);
  const [copyingId, setCopyingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      setStep("OPTIONS");
      setError(null);
      setCopyingId(null);
    }
  }, [visible]);

  const openCopyStep = async () => {
    setStep("COPY");
    setError(null);

    try {
      setLoading(true);
      const lists = await getLists();
      setRecentLists(
        [...lists]
          .sort(
            (a, b) =>
              new Date(b.createDate).getTime() -
              new Date(a.createDate).getTime(),
          )
          .slice(0, RECENT_LIMIT),
      );
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (source: ShoppingList) => {
    setError(null);
    setCopyingId(source.id);

    try {
      const list = await createList(`Cópia de ${source.name}`);
      const items = await getListProducts(source.id);

      for (const item of items) {
        await addListProduct({
          shoppingListId: list.id,
          productId: item.product.id,
          plannedQuantity: item.plannedQuantity,
          basePrice: item.currentPrice ?? item.basePrice ?? 0,
        });
      }

      onCopied(list);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setCopyingId(null);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Clicar fora fecha o modal */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.indicator} />

              <View style={styles.header}>
                {step === "COPY" && (
                  <TouchableOpacity
                    style={styles.headerAction}
                    onPress={() => setStep("OPTIONS")}
                  >
                    <FontAwesome5
                      name="arrow-left"
                      size={16}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                )}

                <Text style={styles.title}>
                  {step === "OPTIONS" ? "Nova cestinha" : "Copiar de"}
                </Text>

                <TouchableOpacity style={styles.headerAction} onPress={onClose}>
                  <FontAwesome5
                    name="times"
                    size={18}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              {step === "OPTIONS" ? (
                <>
                  <TouchableOpacity
                    style={styles.optionCard}
                    activeOpacity={0.7}
                    onPress={onCreateBlank}
                  >
                    <Text style={styles.emoji}>🧺</Text>
                    <View style={styles.cardTextContainer}>
                      <Text style={styles.cardTitle}>Começar do zero</Text>
                      <Text style={styles.cardSub}>
                        Uma cestinha vazia pra você encher do seu jeito.
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.optionCard}
                    activeOpacity={0.7}
                    onPress={openCopyStep}
                  >
                    <Text style={styles.emoji}>🔁</Text>
                    <View style={styles.cardTextContainer}>
                      <Text style={styles.cardTitle}>Copiar uma cestinha</Text>
                      <Text style={styles.cardSub}>
                        Traz os itens e as quantidades de uma cestinha recente.
                      </Text>
                    </View>
                  </TouchableOpacity>
                </>
              ) : loading ? (
                <ActivityIndicator
                  size="large"
                  color={colors.primary}
                  style={styles.loader}
                />
              ) : recentLists.length === 0 ? (
                <Text style={styles.emptyText}>
                  Sua cestinha está vazia. Bora encher?
                </Text>
              ) : (
                recentLists.map((list) => {
                  const status = LIST_STATUS[list.status];
                  return (
                    <TouchableOpacity
                      key={list.id}
                      style={styles.optionCard}
                      activeOpacity={0.7}
                      disabled={copyingId !== null}
                      onPress={() => handleCopy(list)}
                    >
                      <Text style={styles.emoji}>🧺</Text>
                      <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle} numberOfLines={1}>
                          {list.name}
                        </Text>
                        <Text style={styles.cardSub}>
                          {status.label} ·{" "}
                          <Text style={styles.cardDate}>
                            {new Date(list.createDate).toLocaleDateString(
                              "pt-BR",
                            )}
                          </Text>
                        </Text>
                      </View>

                      {copyingId === list.id && (
                        <ActivityIndicator color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  );
                })
              )}

              {error && <Text style={styles.errorText}>{error}</Text>}

              {/* Botão Cancelar */}
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.surface1,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    alignItems: "center",
    gap: spacing.md,
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    alignSelf: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  headerAction: {
    width: TOUCH_TARGET,
    height: TOUCH_TARGET,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    ...typography.sectionTitle,
    color: colors.primary,
  },
  optionCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface2,
    padding: spacing.lg,
    borderRadius: radius.card,
    gap: spacing.lg,
    minHeight: TOUCH_TARGET + 16,
  },
  emoji: {
    fontSize: 24,
  },
  cardTextContainer: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    ...typography.itemName,
    color: colors.text,
  },
  cardSub: {
    fontFamily: fonts.text,
    fontSize: 13,
    color: colors.textSecondary,
  },
  cardDate: {
    ...typography.numberSmall,
    color: colors.textSecondary,
  },
  loader: {
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    paddingVertical: spacing.xl,
  },
  errorText: {
    ...typography.label,
    color: colors.tertiary,
    textAlign: "center",
  },
  cancelButton: {
    minHeight: TOUCH_TARGET,
    justifyContent: "center",
    alignSelf: "center",
  },
  cancelText: {
    fontFamily: fonts.textMedium,
    fontSize: 15,
    color: colors.textSecondary,
  },
});
