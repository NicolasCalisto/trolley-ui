import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Category } from '../../mocks/category';

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
  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isSelected = item.name === selectedCategory;

          return (
            <Pressable
              onPress={() => onSelectCategory(item.name)}
              style={[
                styles.tab,
                isSelected ? styles.selectedTab : styles.unselectedTab,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  isSelected ? styles.selectedTabText : styles.unselectedTabText,
                ]}
              >
                {item.name}
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
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTab: {
    backgroundColor: '#F59E0B',
  },
  unselectedTab: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
  },
  selectedTabText: {
    color: '#0d1321',
    fontWeight: 'bold',
    fontSize: 13,
  },
  unselectedTabText: {
    color: '#9CA3AF',
    fontWeight: '500',
    fontSize: 13,
  },
});