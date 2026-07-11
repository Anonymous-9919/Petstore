"use client";

// Client-side auth helpers
// In NextAuth v5 the React hooks moved to next-auth/react but types may be missing.
// We provide a minimal client-side signIn/signOut using fetch to the credentials endpoint.

export async function signIn(email: string, password: string) {
  const csrfRes = await fetch("/api/auth/csrf");
  const { csrfToken } = await csrfRes.json();

  const res = await fetch("/api/auth/callback/credentials", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      csrfToken,
      email,
      password,
      redirect: "false",
      json: "true",
    }).toString(),
  });
  return res;
}

export async function signOut() {
  const csrfRes = await fetch("/api/auth/csrf");
  const { csrfToken } = await csrfRes.json();
  await fetch("/api/auth/signout", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ csrfToken }).toString(),
  });
  window.location.href = "/admin/login";
}
