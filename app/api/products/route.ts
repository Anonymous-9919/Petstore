import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const branchId = url.searchParams.get("branchId");
  const locale = url.searchParams.get("locale") || "en";

  if (!branchId) {
    const products = await prisma.product.findMany({
      where: { active: true },
      select: {
        id: true, name: true, nameAr: true, slug: true,
        description: true, descriptionAr: true,
        price: true, originalPrice: true, stock: true, petType: true,
        featured: true, active: true, rating: true,
        reviewCount: true, createdAt: true,
        category: { select: { name: true, nameAr: true, slug: true } },
        images: { select: { url: true, order: true }, take: 1, orderBy: { order: "asc" as const } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(serializeProducts(products, locale), {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  }

  const branchStocks = await prisma.branchStock.findMany({
    where: { branchId, active: true, stock: { gt: 0 }, product: { active: true } },
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
    .map((bs) => bs.product)
    .filter(Boolean);

  return NextResponse.json(serializeProducts(products, locale), {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" },
  });
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
    tags: null,
    rating: p.rating,
    reviewCount: p.reviewCount,
    createdAt: p.createdAt,
    images: p.images,
  }));
}
