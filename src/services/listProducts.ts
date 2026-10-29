import { request } from "./api";
import type { DeletedResponse, ListProduct } from "./types";

/** A API devolve o booleano como `isChecked`; a documentação cita `checked`. Aceitamos os dois. */
type ListProductResponse = Omit<ListProduct, "checked"> & {
  checked?: boolean;
  isChecked?: boolean;
};

const normalize = (item: ListProductResponse): ListProduct => ({
  ...item,
  checked: item.isChecked ?? item.checked ?? false,
});

export async function getListProducts(
  listId: number,
  signal?: AbortSignal,
): Promise<ListProduct[]> {
  const items = await request<ListProductResponse[]>(
    `/list-products/list/${listId}`,
    { signal },
  );
  return items.map(normalize);
}

export async function addListProduct(payload: {
  shoppingListId: number;
  productId: number;
  plannedQuantity: number;
  basePrice: number;
}): Promise<ListProduct> {
  return normalize(
    await request<ListProductResponse>("/list-products", {
      method: "POST",
      body: payload,
    }),
  );
}

export async function updateListProduct(
  id: number,
  payload: {
    plannedQuantity: number;
    actualQuantity?: number | null;
    currentPrice: number;
    isChecked: boolean;
  },
): Promise<ListProduct> {
  return normalize(
    await request<ListProductResponse>(`/list-products/${id}`, {
      method: "PUT",
      body: payload,
    }),
  );
}

export async function toggleListProductCheck(id: number): Promise<ListProduct> {
  return normalize(
    await request<ListProductResponse>(`/list-products/${id}/toggle-check`, {
      method: "POST",
    }),
  );
}

export function deleteListProduct(id: number): Promise<DeletedResponse> {
  return request<DeletedResponse>(`/list-products/${id}`, { method: "DELETE" });
}
