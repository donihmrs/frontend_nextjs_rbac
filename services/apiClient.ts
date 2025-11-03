import { refreshToken } from "@/app/helper";

export const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export async function apiFetchClient(endpoint: string, options: RequestInit = {}, retry = true): Promise<any> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${apiBase}${endpoint}`, {
    ...options,
    headers,
  });

  // Kalau token expired (401)
  if (response.status === 401 && retry) {
    console.warn("Token expired, trying to refresh...");

    const newToken = await refreshToken();
    if (newToken) {
      return apiFetchClient(endpoint, options, false);
    } else {
      window.location.href = "/login";
      return null;
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  if (response.status === 204 || response.status === 205) {
    return null; // No Content
  } else {
    return response.json();
  }
}
