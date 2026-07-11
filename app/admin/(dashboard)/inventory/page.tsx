import { prisma } from "@/lib/db";
import { InventoryManager } from "@/components/admin/inventory-manager";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { category: { select: { name: true, slug: true } } },
    orderBy: { stock: "asc" },
    take: 500,
  });
  return (
    <div className="space-y-5">
      <InventoryManager
        initial={products.map((p) => ({
          id: p.id,
          name: p.name,
          nameAr: p.nameAr,
          sku: p.sku,
          price: p.price,
          originalPrice: p.originalPrice,
          stock: p.stock,
          lowStockThreshold: p.lowStockThreshold,
          petType: p.petType,
          active: p.active,
          featured: p.featured,
          onSale: p.originalPrice !== null && p.originalPrice > p.price,
          categoryName: p.category?.name || "",
          categorySlug: p.category?.slug || "",
          description: p.description,
          descriptionAr: p.descriptionAr,
          createdAt: p.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
