import { prisma } from "@/lib/db";
import { CategoriesManager } from "@/components/admin/categories-manager";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const cats = await prisma.category.findMany({
    orderBy: [{ petType: "asc" }, { order: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });
  return (
    <div className="space-y-5">
      <CategoriesManager initial={cats.map(c => ({ ...c, count: c._count.products }))} />
    </div>
  );
}
