import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const branchId = url.searchParams.get("branchId");
  const locale = url.searchParams.get("locale") || "en";

  // For delivery (no branchId): show all active products
  // For pickup (branchId): show only products with stock in that branch
  if (!branchId) {
    const products = await prisma.product.findMany({
      where: { active: true },
      include: {
        category: { select: { name: true, nameAr: true, slug: true } },
        images: { take: 1, orderBy: { order: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(serializeProducts(products, locale));
  }

  // Pickup mode: only products with stock > 0 in this branch
  const branchStocks = await prisma.branchStock.findMany({
    where: { branchId, active: true, stock: { gt: 0 } },
    include: {
      product: {
        include: {
          category: { select: { name: true, nameAr: true, slug: true } },
          images: { take: 1, orderBy: { order: "asc" } },
        },
      },
    },
    orderBy: { product: { createdAt: "desc" } },
  });

  const products = branchStocks
    .filter((bs) => bs.product.active)
    .map((bs) => bs.product);

  return NextResponse.json(serializeProducts(products, locale));
}

function serializeProducts(products: any[], locale: string) {
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    nameAr: p.nameAr,
    slug: p.slug,
    description: p.description,
    descriptionAr: p.descriptionAr,
    price: p.price,
    originalPrice: p.originalPrice,
    stock: p.stock,
    petType: p.petType,
    featured: p.featured,
    active: p.active,
    onSale: p.originalPrice !== null && p.originalPrice > p.price,
    category: p.category,
    categorySlug: p.category?.slug || "",
    tags: p.tags,
    rating: p.rating,
    reviewCount: p.reviewCount,
    createdAt: p.createdAt,
    images: p.images,
  }));
}
