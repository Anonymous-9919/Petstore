import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const bannerSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().nullable().optional(),
  imageUrl: z.string().min(1),
  link: z.string().nullable().optional(),
  position: z.enum(["hero", "secondary"]).default("hero"),
  active: z.boolean().default(true),
  order: z.number().int().default(0),
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const banners = await prisma.banner.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
  return NextResponse.json(banners);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role === "STAFF") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = bannerSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data", issues: parsed.error.flatten() }, { status: 400 });

  const banner = await prisma.banner.create({ data: parsed.data });
  return NextResponse.json(banner);
}
