import { prisma } from "@/lib/db";
import { BranchStockManager } from "@/components/admin/branch-stock-manager";

export const dynamic = "force-dynamic";

export default async function BranchInventoryPage() {
  const [branches, products, branchStocks] = await Promise.all([
    prisma.branch.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, nameAr: true, sku: true, categoryId: true },
    }),
    prisma.branchStock.findMany(),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Branch Inventory</h2>
        <p className="text-sm text-gray-500">
          Manage stock per branch. Products with stock 0 in a branch won't show in pickup mode for that branch.
        </p>
      </div>
      <BranchStockManager
        branches={branches.map((b) => ({ id: b.id, name: b.name, nameAr: b.nameAr }))}
        products={products}
        initialStocks={branchStocks.map((s) => ({ branchId: s.branchId, productId: s.productId, stock: s.stock, active: s.active }))}
      />
    </div>
  );
}
