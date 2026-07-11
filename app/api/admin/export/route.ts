import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { toCSV } from "@/lib/csv";
import { formatKWD } from "@/lib/utils";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const type = url.searchParams.get("type") || "products";

  if (type === "inventory") {
    const products = await prisma.product.findMany({
      include: { category: { select: { name: true, nameAr: true, slug: true } } },
      orderBy: { name: "asc" },
    });
    const rows = products.map((p) => ({
      id: p.id,
      sku: p.sku || "",
      name: p.name,
      nameAr: p.nameAr,
      category: p.category?.name || "",
      categoryAr: p.category?.nameAr || "",
      categorySlug: p.category?.slug || "",
      petType: p.petType,
      price: p.price.toFixed(3),
      originalPrice: p.originalPrice?.toFixed(3) || "",
      stock: p.stock,
      lowStockThreshold: p.lowStockThreshold,
      stockStatus: p.stock === 0 ? "out_of_stock" : p.stock <= p.lowStockThreshold ? "low_stock" : "in_stock",
      active: p.active ? "yes" : "no",
      featured: p.featured ? "yes" : "no",
      hasVariants: p.hasVariants ? "yes" : "no",
      rating: p.rating.toFixed(2),
      reviewCount: p.reviewCount,
      description: p.description || "",
      descriptionAr: p.descriptionAr || "",
      createdAt: p.createdAt.toISOString(),
    }));
    const csv = toCSV(rows);
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="inventory-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  // Default: products export (with images)
  const products = await prisma.product.findMany({
    include: {
      category: { select: { name: true, nameAr: true, slug: true } },
      images: { orderBy: { order: "asc" } },
    },
    orderBy: { name: "asc" },
  });
  const rows = products.map((p) => ({
    sku: p.sku || "",
    name: p.name,
    nameAr: p.nameAr,
    slug: p.slug,
    category: p.category?.name || "",
    categoryAr: p.category?.nameAr || "",
    petType: p.petType,
    price: p.price,
    originalPrice: p.originalPrice ?? "",
    stock: p.stock,
    lowStockThreshold: p.lowStockThreshold,
    description: p.description || "",
    descriptionAr: p.descriptionAr || "",
    images: p.images.map((i) => i.url).join("|"),
    active: p.active ? "1" : "0",
    featured: p.featured ? "1" : "0",
  }));
  const csv = toCSV(rows);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="products-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
