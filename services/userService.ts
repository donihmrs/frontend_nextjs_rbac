import { apiFetchClient } from "./apiClient";

export async function getUsers() {
  return apiFetchClient("/users", {
    method: "GET",
  });
}

export async function getUserByUsername(username: string) {
  return apiFetchClient(`/users/${username}`, {
    method: "GET",
  });
}

export async function createUser(data: any) {
  return apiFetchClient("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateUser(username: string, data: any) {
  return apiFetchClient(`/users/${username}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteUser(username: string) {
  return apiFetchClient(`/users/${username}`, {
    method: "DELETE",
  });
}
