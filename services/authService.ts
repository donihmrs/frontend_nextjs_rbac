import { apiFetchClient } from "./apiClient";

export async function login(username: string, password: string) {
  return await apiFetchClient("/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function logout(refreshToken: string) {
  return await apiFetchClient("/logout", {
    method: "POST",
    body: JSON.stringify({ refresh: refreshToken }),
  });
}