import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { toCSV } from "@/lib/csv";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 30);
}

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const type = url.searchParams.get("type") || "products";

  const branches = await prisma.branch.findMany({ where: { active: true }, orderBy: { name: "asc" } });
  const branchInfo = branches.map((b) => ({ id: b.id, slug: slugify(b.name) }));

  if (type === "inventory") {
    const products = await prisma.product.findMany({
      include: {
        category: { select: { name: true, nameAr: true, slug: true } },
        branchStocks: true,
      },
      orderBy: { name: "asc" },
    });
    const rows = products.map((p) => {
      const bsMap = new Map(p.branchStocks.map((bs) => [bs.branchId, bs]));
      const row: Record<string, unknown> = {
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
      };
      for (const b of branchInfo) {
        const bs = bsMap.get(b.id);
        row[`branch_${b.slug}_stock`] = bs?.stock ?? "";
        row[`branch_${b.slug}_active`] = bs ? (bs.active ? "yes" : "no") : "";
      }
      return row;
    });
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
      branchStocks: true,
    },
    orderBy: { name: "asc" },
  });
  const rows = products.map((p) => {
    const bsMap = new Map(p.branchStocks.map((bs) => [bs.branchId, bs]));
    const row: Record<string, unknown> = {
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
    };
    for (const b of branchInfo) {
      const bs = bsMap.get(b.id);
      row[`branch_${b.slug}_stock`] = bs?.stock ?? "";
      row[`branch_${b.slug}_active`] = bs ? (bs.active ? "1" : "0") : "";
    }
    return row;
  });
  const csv = toCSV(rows);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="products-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
