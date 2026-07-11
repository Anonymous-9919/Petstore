import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session as { role?: string }).role === "STAFF") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const orig = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!orig) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Create duplicate with new slug
  let slug = `${orig.slug}-copy`;
  let n = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${orig.slug}-copy-${n++}`;
  }

  const dup = await prisma.product.create({
    data: {
      name: `${orig.name} (Copy)`,
      nameAr: orig.nameAr,
      slug,
      description: orig.description,
      descriptionAr: orig.descriptionAr,
      price: orig.price,
      originalPrice: orig.originalPrice,
      stock: orig.stock,
      lowStockThreshold: orig.lowStockThreshold,
      sku: null,
      petType: orig.petType,
      featured: false,
      active: false,
      hasVariants: orig.hasVariants,
      rating: orig.rating,
      reviewCount: 0,
      categoryId: orig.categoryId,
      images: {
        create: orig.images.map((i) => ({ url: i.url, order: i.order })),
      },
    },
  });

  return NextResponse.json({ id: dup.id });
}
