import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth-client";
import { StaffManager } from "@/components/admin/staff-manager";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");
  if (session.role !== "OWNER") {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Only the store owner can manage staff.</p>
      </div>
    );
  }

  const staff = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  });

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Staff</h2>
        <p className="text-sm text-gray-500">{staff.length} users · Owner-only</p>
      </div>
      <      StaffManager initial={staff} currentUserId={session.id} />
    </div>
  );
}
