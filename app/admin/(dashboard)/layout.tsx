import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const unreadCount = await prisma.notification.count({ where: { read: false } });

  return (
    <AdminShell
      user={{ name: session.name, email: session.email, role: session.role }}
      unreadCount={unreadCount}
    >
      {children}
    </AdminShell>
  );
}
