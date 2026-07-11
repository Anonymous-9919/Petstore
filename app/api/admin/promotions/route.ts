import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const promoSchema = z.object({
  code: z.string().min(1).transform((v) => v.toUpperCase()),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.number().min(0),
  minOrder: z.number().min(0).default(0),
  active: z.boolean().default(true),
  startsAt: z.string().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
  usageLimit: z.number().int().nullable().optional(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role === "STAFF") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = promoSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const exists = await prisma.promotion.findUnique({ where: { code: parsed.data.code } });
  if (exists) return NextResponse.json({ error: "Code already exists" }, { status: 409 });

  const promo = await prisma.promotion.create({
    data: {
      code: parsed.data.code,
      type: parsed.data.type,
      value: parsed.data.value,
      minOrder: parsed.data.minOrder,
      active: parsed.data.active,
      startsAt: parsed.data.startsAt ? new Date(parsed.data.startsAt) : null,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
      usageLimit: parsed.data.usageLimit || null,
    },
  });
  return NextResponse.json(promo);
}
