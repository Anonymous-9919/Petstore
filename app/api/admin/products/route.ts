import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1),
  nameAr: z.string().optional().default(""),
  slug: z.string().optional(),
  description: z.string().optional().default(""),
  descriptionAr: z.string().optional().default(""),
  price: z.number().min(0),
  originalPrice: z.number().nullable().optional(),
  stock: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().min(0).default(5),
  sku: z.string().optional().default(""),
  petType: z.string().default("general"),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  categoryId: z.string().min(1),
  images: z.array(z.string()).default([]),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session as { role?: string }).role;
  if (role === "STAFF") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data", issues: parsed.error.flatten() }, { status: 400 });

  const data = parsed.data;
  const slug = data.slug && data.slug.length > 0 ? slugify(data.slug) : slugify(data.name) || `p-${Date.now()}`;

  // ensure unique slug
  let uniqueSlug = slug;
  let n = 1;
  while (await prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${slug}-${n++}`;
  }

  const product = await prisma.product.create({
    data: {
      name: data.name,
      nameAr: data.nameAr || data.name,
      slug: uniqueSlug,
      description: data.description || "",
      descriptionAr: data.descriptionAr || "",
      price: data.price,
      originalPrice: data.originalPrice ?? null,
      stock: data.stock,
      lowStockThreshold: data.lowStockThreshold,
      sku: data.sku || null,
      petType: data.petType,
      featured: data.featured,
      active: data.active,
      hasVariants: false,
      categoryId: data.categoryId,
      images: {
        create: data.images.map((url, i) => ({ url, order: i })),
      },
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: (session as { id: string }).id,
      action: "create",
      entity: "Product",
      entityId: product.id,
      details: `Created product: ${product.name}`,
    },
  });

  return NextResponse.json({ id: product.id });
}

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const q = url.searchParams.get("q") || "";
  const where = q
    ? { OR: [{ name: { contains: q } }, { sku: { contains: q } }] }
    : {};

  const products = await prisma.product.findMany({
    where,
    include: { category: true, images: { take: 1 } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json(products);
}
