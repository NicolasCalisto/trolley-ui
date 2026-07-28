export interface Category {
  id: string;
  name: string;
}

export const CATEGORIES_MOCK: Category[] = [
  { id: 'all', name: 'Todas' },
  { id: 'laticinios', name: 'Laticínios' },
  { id: 'mercearia', name: 'Mercearia' },
  { id: 'hortifruti', name: 'Hortifruti' },
  { id: 'carnes', name: 'Carnes' },
  { id: 'bebidas', name: 'Bebidas' },
  { id: 'limpeza', name: 'Limpeza' },
];