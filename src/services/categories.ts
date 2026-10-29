import { request } from "./api";
import type { Category } from "./types";

export function getCategories(signal?: AbortSignal): Promise<Category[]> {
  return request<Category[]>("/categories", { signal });
}

export function createCategory(payload: {
  name: string;
  active?: boolean;
}): Promise<Category> {
  return request<Category>("/categories", { method: "POST", body: payload });
}
