import { apiFetchClient } from "./apiClient";

export async function createInvitation(data: any) {
  return apiFetchClient("/invitations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Revoke Invitation

export async function revokeInvitation(id: number) {
  return apiFetchClient(`/invitations/${id}/revoke`, {
    method: "POST",
  });
}

// Accept Invitation

export async function acceptInvitation(token: string, data: object) {
  return apiFetchClient(`/invitations/accept?token=${token}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}