import { redirect } from "next/navigation";
import { getSession } from "./auth";

export async function auth() {
  return getSession();
}

export async function requireAdmin() {
  const user = await getSession();
  if (!user) redirect("/admin/login");
  return user;
}
