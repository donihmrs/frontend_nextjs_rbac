import { apiFetchClient } from "./apiClient";

export async function getProducts() {
  return apiFetchClient("/products", {
    method: "GET",
  });
}

export async function getProductById(id: number) {
  return apiFetchClient(`/products/${id}`, {
    method: "GET",
  });
} 

export async function createProduct(data: any) {
  return apiFetchClient("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id: number, data: any) {
  return apiFetchClient(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: number) {
  return apiFetchClient(`/products/${id}`, {
    method: "DELETE",
  });
}
