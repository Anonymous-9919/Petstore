import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  nameAr: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  addressAr: z.string().min(1).optional(),
  phone: z.array(z.string()).optional(),
  hours: z.string().optional(),
  hoursAr: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  active: z.boolean().optional(),
  deliveryAvailable: z.boolean().optional(),
  pickupAvailable: z.boolean().optional(),
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
  if (Array.isArray(data.phone)) data.phone = data.phone.join(", ");

  const branch = await prisma.branch.update({ where: { id }, data });
  return NextResponse.json(branch);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "OWNER") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const orders = await prisma.order.count({ where: { branchId: id } });
  if (orders > 0) {
    return NextResponse.json({ error: `Cannot delete: ${orders} order(s) reference this branch.` }, { status: 409 });
  }
  await prisma.branch.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
