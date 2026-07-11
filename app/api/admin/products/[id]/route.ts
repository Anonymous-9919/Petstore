import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1).optional(),
  nameAr: z.string().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  price: z.number().min(0).optional(),
  originalPrice: z.number().nullable().optional(),
  stock: z.number().int().min(0).optional(),
  lowStockThreshold: z.number().int().min(0).optional(),
  sku: z.string().nullable().optional(),
  petType: z.string().optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  categoryId: z.string().optional(),
  status: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session as { role?: string }).role === "STAFF") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const data = parsed.data;
  const { images, ...rest } = data;

  if (images) {
    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.productImage.createMany({
      data: images.map((url, i) => ({ productId: id, url, order: i })),
    });
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...rest,
      sku: rest.sku === undefined ? undefined : rest.sku || null,
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: (session as { id: string }).id,
      action: "update",
      entity: "Product",
      entityId: id,
      details: `Updated product: ${product.name}`,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session as { role?: string }).role !== "OWNER") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await prisma.productImage.deleteMany({ where: { productId: id } });
  await prisma.inventoryLog.deleteMany({ where: { productId: id } });
  await prisma.variant.deleteMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
