import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const updateSchema = z.object({
  code: z.string().optional(),
  type: z.enum(["PERCENT", "FIXED"]).optional(),
  value: z.number().min(0).optional(),
  minOrder: z.number().min(0).optional(),
  active: z.boolean().optional(),
  startsAt: z.string().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
  usageLimit: z.number().int().nullable().optional(),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role === "STAFF") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const data: Record<string, unknown> = { ...parsed.data };
  if (data.startsAt !== undefined) data.startsAt = data.startsAt ? new Date(data.startsAt as string) : null;
  if (data.expiresAt !== undefined) data.expiresAt = data.expiresAt ? new Date(data.expiresAt as string) : null;
  if (data.code && typeof data.code === "string") data.code = data.code.toUpperCase();

  const promo = await prisma.promotion.update({ where: { id }, data });
  return NextResponse.json(promo);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "OWNER") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await prisma.promotion.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
