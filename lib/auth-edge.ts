// lib/auth-edge.ts — Edge runtime compatible session check
// Only verifies the cookie exists and decodes the payload (signature check
// happens in the Node runtime via lib/auth.ts).

import { cookies } from "next/headers";

const COOKIE_NAME = "ps_admin_session";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export function fromBase64url(s: string): string {
  const padded = s + "=".repeat((4 - (s.length % 4)) % 4);
  if (typeof atob === "function") {
    return atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
  }
  return Buffer.from(padded.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8");
}

export async function getSessionEdge(): Promise<SessionUser | null> {
  try {
    const store = await cookies();
    const token = store.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const data = JSON.parse(fromBase64url(payload));
    if (typeof data.exp === "number" && data.exp < Math.floor(Date.now() / 1000)) return null;
    if (!data.id || !data.email || !data.role) return null;
    return { id: data.id, email: data.email, name: data.name, role: data.role };
  } catch {
    return null;
  }
}

export async function hasSession(): Promise<boolean> {
  try {
    const store = await cookies();
    return !!store.get(COOKIE_NAME)?.value;
  } catch {
    return false;
  }
}
