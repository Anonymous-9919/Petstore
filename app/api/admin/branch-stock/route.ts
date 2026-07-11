import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  branchId: z.string().min(1),
  productId: z.string().min(1),
  stock: z.number().int().min(0),
  active: z.boolean().default(true),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role === "STAFF") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const data = parsed.data;
  const result = await prisma.branchStock.upsert({
    where: { branchId_productId: { branchId: data.branchId, productId: data.productId } },
    update: { stock: data.stock, active: data.active },
    create: data,
  });
  return NextResponse.json(result);
}

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const branchId = url.searchParams.get("branchId");
  const where = branchId ? { branchId } : {};
  const stocks = await prisma.branchStock.findMany({ where });
  return NextResponse.json(stocks);
}
