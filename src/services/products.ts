import { buildQuery, request } from "./api";
import type { DeletedResponse, Product } from "./types";

export interface ProductFilters {
  id?: number;
  name?: string;
  category?: string;
  active?: boolean;
}

export function getProducts(
  filters: ProductFilters = {},
  signal?: AbortSignal,
): Promise<Product[]> {
  return request<Product[]>(`/products${buildQuery({ ...filters })}`, {
    signal,
  });
}

export function createProduct(payload: {
  name: string;
  categoryId?: number;
  lastPrice?: number;
  active?: boolean;
}): Promise<Product> {
  return request<Product>("/products", { method: "POST", body: payload });
}

export function deleteProduct(id: number): Promise<DeletedResponse> {
  return request<DeletedResponse>(`/products/${id}`, { method: "DELETE" });
}
