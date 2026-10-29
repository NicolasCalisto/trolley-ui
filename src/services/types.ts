export interface Category {
  id: number;
  name: string;
  active: boolean;
}

export interface Product {
  id: number;
  name: string;
  category: Category | null;
  lastPrice: number | null;
  active: boolean;
}

export type ShoppingListStatus = "PLANNING" | "SHOPPING" | "FINISHED";

export interface ShoppingList {
  id: number;
  name: string;
  status: ShoppingListStatus;
  createDate: string;
}

/** O backend devolve `checked`, mas o PUT espera `isChecked`. */
export interface ListProduct {
  id: number;
  shoppingList: ShoppingList;
  product: Product;
  plannedQuantity: number;
  lastPrice: number | null;
  currentPrice: number | null;
  actualQuantity: number | null;
  basePrice: number | null;
  checked: boolean;
}

export interface DeletedResponse {
  deleted?: boolean;
  message?: string;
}
