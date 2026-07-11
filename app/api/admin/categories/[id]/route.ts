import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  nameAr: z.string().min(1).optional(),
  petType: z.string().optional(),
  image: z.string().nullable().optional(),
  order: z.number().int().optional(),
  active: z.boolean().optional(),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role === "STAFF") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const cat = await prisma.category.update({ where: { id }, data: parsed.data });
  return NextResponse.json(cat);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "OWNER") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const products = await prisma.product.count({ where: { categoryId: id } });
  if (products > 0) {
    return NextResponse.json({ error: `Cannot delete: ${products} product(s) use this category. Reassign or delete them first.` }, { status: 409 });
  }
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
