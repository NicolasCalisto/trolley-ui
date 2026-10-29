import { buildQuery, request } from "./api";
import type {
    DeletedResponse,
    ShoppingList,
    ShoppingListStatus,
} from "./types";

export function getLists(
  status?: ShoppingListStatus,
  signal?: AbortSignal,
): Promise<ShoppingList[]> {
  return request<ShoppingList[]>(`/lists${buildQuery({ status })}`, { signal });
}

export function getListById(
  id: number,
  signal?: AbortSignal,
): Promise<ShoppingList> {
  return request<ShoppingList>(`/lists/${id}`, { signal });
}

export function createList(name: string): Promise<ShoppingList> {
  return request<ShoppingList>("/lists", { method: "POST", body: { name } });
}

export function updateListStatus(
  id: number,
  status: ShoppingListStatus,
): Promise<ShoppingList> {
  return request<ShoppingList>(`/lists/${id}/status${buildQuery({ status })}`, {
    method: "PATCH",
  });
}

export function duplicateLastList(): Promise<ShoppingList> {
  return request<ShoppingList>("/lists/duplicate-last", { method: "POST" });
}

export function deleteList(id: number): Promise<DeletedResponse> {
  return request<DeletedResponse>(`/lists/${id}`, { method: "DELETE" });
}
