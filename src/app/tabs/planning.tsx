import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

// IMPORTS EXTERNOS (Componentes e Mocks)
import { CategoryTabs } from '../../components/modal/category';
import { CATEGORIES_MOCK } from '../../mocks/category';

interface ListItem {
  id: string;
  productId: string;
  name: string;
  category: string;
  quantity: number;
}

export default function PlanningScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode: string }>();

  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  useEffect(() => {
    if (mode === 'duplicate') {
      loadLastPurchase();
    }
  }, [mode]);

  const loadLastPurchase = async () => {
    try {
      setLoading(true);
      
      // Futura chamada de API:
      // const response = await api.get('/lists/last-finished');
      // setItems(response.data.items);

      // Simulação rápida enquanto sem backend:
      setTimeout(() => {
        setItems([
          { id: '1', productId: 'p1', name: 'Leite Integral', category: 'Laticínios', quantity: 4 },
          { id: '2', productId: 'p2', name: 'Arroz 5kg', category: 'Mercearia', quantity: 1 },
          { id: '3', productId: 'p3', name: 'Café 500g', category: 'Mercearia', quantity: 2 },
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      setLoading(false);
      Alert.alert('Erro', 'Não foi possível carregar a última compra.');
    }
  };

  // Filtragem dinâmica dos itens por categoria selecionada
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'Todas') return items;
    return items.filter(
      (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [items, selectedCategory]);

  // Alterar quantidade
  const handleUpdateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as ListItem[]
    );
  };

  // Remover item da lista
  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Navegar para a tela de compras
  const handleStartShopping = () => {
    if (items.length === 0) {
      Alert.alert('Atenção', 'Adicione pelo menos um item antes de ir ao mercado.');
      return;
    }
    router.push({
      pathname: '/shopping',
      params: { listData: JSON.stringify(items) },
    });
  };

  return (
    <View style={styles.container}>
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Planejamento</Text>
          <Text style={styles.subtitle}>
            {mode === 'duplicate' ? 'Cópia da última compra' : 'Nova lista de compras'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            /* Abrir Modal de Catálogo */
          }}
        >
          <FontAwesome5 name="plus" size={16} color="#0d1321" />
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      {/* BARRA DE CATEGORIAS IMPORTADA */}
      <CategoryTabs
        categories={CATEGORIES_MOCK}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* LISTA DE ITENS */}
      {loading ? (
        <ActivityIndicator size="large" color="#F59E0B" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="clipboard-list" size={48} color="#374151" />
              <Text style={styles.emptyText}>Nenhum item encontrado.</Text>
              <Text style={styles.emptySubtext}>
                {selectedCategory === 'Todas'
                  ? 'Clique em "Adicionar" para buscar itens do catálogo.'
                  : `Não há itens cadastrados na categoria "${selectedCategory}".`}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
              </View>

              {/* CONTROLES DE QUANTIDADE */}
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => handleUpdateQuantity(item.id, -1)}
                >
                  <FontAwesome5 name="minus" size={12} color="#F59E0B" />
                </TouchableOpacity>

                <Text style={styles.qtyText}>{item.quantity}</Text>

                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => handleUpdateQuantity(item.id, 1)}
                >
                  <FontAwesome5 name="plus" size={12} color="#F59E0B" />
                </TouchableOpacity>
              </View>

              {/* BOTÃO REMOVER */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleRemoveItem(item.id)}
              >
                <FontAwesome5 name="trash-alt" size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* RODAPÉ / BOTÃO IR PRO MERCADO */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.startShoppingButton, items.length === 0 && styles.disabledButton]}
          onPress={handleStartShopping}
          disabled={items.length === 0}
        >
          <FontAwesome5 name="shopping-cart" size={18} color="#0d1321" />
          <Text style={styles.startShoppingText}>Ir para o Mercado ({items.length})</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1321',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: '#0d1321',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  itemCategory: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginRight: 12,
    gap: 8,
  },
  qtyButton: {
    padding: 6,
  },
  qtyText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
    minWidth: 18,
    textAlign: 'center',
  },
  deleteButton: {
    padding: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  emptySubtext: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
    backgroundColor: '#0d1321',
  },
  startShoppingButton: {
    backgroundColor: '#F59E0B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  startShoppingText: {
    color: '#0d1321',
    fontWeight: 'bold',
    fontSize: 16,
  },
});