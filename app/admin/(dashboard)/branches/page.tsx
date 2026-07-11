import { prisma } from "@/lib/db";
import { BranchesManager } from "@/components/admin/branches-manager";

export const dynamic = "force-dynamic";

export default async function BranchesPage() {
  const branches = await prisma.branch.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { orders: true } } },
  });
  return (
    <div className="space-y-5">
      <BranchesManager
        initial={branches.map((b) => ({
          ...b,
          phone: b.phone.split(",").map((p) => p.trim()).filter(Boolean),
          orderCount: b._count.orders,
        }))}
      />
    </div>
  );
}
