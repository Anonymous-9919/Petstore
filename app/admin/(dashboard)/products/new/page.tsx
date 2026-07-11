import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/admin/product-form";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, nameAr: true, petType: true, slug: true },
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">New Product</h2>
        <p className="text-sm text-gray-500">Create a new product in your store</p>
      </div>
      <ProductForm categories={categories} product={{ name: "", slug: "" }} />
    </div>
  );
}
