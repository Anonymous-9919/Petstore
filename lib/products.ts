import { prisma } from "@/lib/db";
import type { Product, Category, Branch } from "@/types";
import type { Locale } from "@/lib/translations";

function mapProduct(p: any): Product {
  const images = (p.images || [])
    .slice()
    .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
    .map((i: any) => i.url);

  const catName = p.category?.name || "";
  const catNameAr = p.category?.nameAr || "";
  const catSlug = p.category?.slug || "";

  return {
    id: p.id,
    name: p.name,
    nameAr: p.nameAr || p.name,
    slug: p.slug,
    description: p.description || "",
    descriptionAr: p.descriptionAr || "",
    price: p.price,
    originalPrice: p.originalPrice ?? null,
    category: catName,
    categoryAr: catNameAr,
    categorySlug: catSlug,
    petType: p.petType as Product["petType"],
    images,
    tags: [],
    featured: p.featured ?? false,
    onSale: p.originalPrice != null && p.originalPrice > p.price,
    inStock: p.stock > 0 && p.active,
    rating: p.rating ?? 4.5,
    reviewCount: p.reviewCount ?? 0,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt),
  };
}

function mapCategory(c: any, productCount?: number): Category {
  return {
    name: c.name,
    nameAr: c.nameAr,
    slug: c.slug,
    petType: c.petType as Category["petType"],
    icon: c.image || undefined,
    count: productCount ?? 0,
  };
}

export function localize(p: Product, locale: Locale): Product {
  if (locale === "ar") {
    return { ...p, name: p.nameAr, description: p.descriptionAr, category: p.categoryAr };
  }
  return p;
}

const includeProduct = {
  category: { select: { name: true, nameAr: true, slug: true } },
  images: { orderBy: { order: "asc" as const } },
};

export async function getProducts(locale?: Locale): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { active: true },
    include: includeProduct,
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => localize(mapProduct(r), locale ?? "en"));
}

export async function getProductBySlug(slug: string, locale?: Locale): Promise<Product | undefined> {
  const row = await prisma.product.findUnique({
    where: { slug },
    include: includeProduct,
  });
  if (!row) return undefined;
  return localize(mapProduct(row), locale ?? "en");
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const row = await prisma.product.findUnique({
    where: { id },
    include: includeProduct,
  });
  if (!row) return undefined;
  return mapProduct(row);
}

export async function getCategories(locale?: Locale): Promise<Category[]> {
  const [cats, counts] = await Promise.all([
    prisma.category.findMany({ orderBy: [{ petType: "asc" }, { name: "asc" }] }),
    prisma.product.groupBy({
      by: ["categoryId"],
      _count: { _all: true },
      where: { active: true },
    }),
  ]);
  const countMap = new Map(counts.map((c) => [c.categoryId, c._count._all]));
  return cats.map((c) => {
    const cat = mapCategory(c, countMap.get(c.id) || 0);
    return locale === "ar" ? { ...cat, name: cat.nameAr } : cat;
  });
}

export async function getFeaturedProducts(locale?: Locale): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { active: true, featured: true },
    include: includeProduct,
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => localize(mapProduct(r), locale ?? "en"));
}

export async function getSaleProducts(locale?: Locale): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { active: true, originalPrice: { not: null, gt: 0 } },
    include: includeProduct,
    orderBy: { createdAt: "desc" },
  });
  return rows
    .map((r) => mapProduct(r))
    .filter((p) => p.originalPrice != null && p.originalPrice > p.price)
    .map((p) => localize(p, locale ?? "en"));
}

export async function getNewArrivals(locale?: Locale): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { active: true },
    include: includeProduct,
    orderBy: { createdAt: "desc" },
    take: 8,
  });
  return rows.map((r) => localize(mapProduct(r), locale ?? "en"));
}

export async function searchProducts(query: string, locale?: Locale): Promise<Product[]> {
  const lower = query.toLowerCase();
  const rows = await prisma.product.findMany({
    where: {
      active: true,
      OR: [
        { name: { contains: lower } },
        { description: { contains: lower } },
      ],
    },
    include: includeProduct,
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => localize(mapProduct(r), locale ?? "en"));
}

export async function getBranches(): Promise<Branch[]> {
  const rows = await prisma.branch.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });
  return rows.map((b) => ({
    id: b.id,
    name: b.name,
    nameAr: b.nameAr,
    address: b.address,
    addressAr: b.addressAr,
    phone: (() => {
      try { return JSON.parse(b.phone); } catch { return [b.phone]; }
    })(),
    hours: b.hours,
    hoursAr: b.hoursAr,
    lat: b.lat,
    lng: b.lng,
  }));
}
