import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { order: "asc" } } },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, nameAr: true, petType: true, slug: true },
    }),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
        <p className="text-sm text-gray-500">{product.name}</p>
      </div>
      <ProductForm
        categories={categories}
        product={{
          ...product,
          description: product.description ?? "",
          descriptionAr: product.descriptionAr ?? "",
          originalPrice: product.originalPrice ?? null,
          sku: product.sku ?? undefined,
          images: product.images.map((i) => ({ id: i.id, url: i.url, order: i.order })),
        }}
      />
    </div>
  );
}
