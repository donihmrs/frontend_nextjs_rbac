import { apiFetchClient } from "./apiClient";

// Get Invitations
export async function getInvitations() {
  return apiFetchClient("/invitations", {
    method: "GET",
  });
}

// Get Invitation by ID
export async function getInvitationById(id: number) {
  return apiFetchClient(`/invitations/${id}`, {
    method: "GET",
  });
}

// Create Invitation
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
    body: JSON.stringify({}),
  });
}

// Accept Invitation

export async function acceptInvitation(token: string, data: object) {
  return apiFetchClient(`/invitations/accept?token=${token}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}