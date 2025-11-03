import { apiFetchClient } from "./apiClient";

export async function getOrders() {
  return apiFetchClient("/orders", {
    method: "GET",
  });
}

export async function getOrderById(id: number) {
  return apiFetchClient(`/orders/${id}`, {
    method: "GET",
  });
}

export async function createOrder(data: any) {
  return apiFetchClient("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateStatusOrder(id: number, data: any) {
  return apiFetchClient(`/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteOrder(id: number) {
  return apiFetchClient(`/orders/${id}`, {
    method: "DELETE",
  });
}