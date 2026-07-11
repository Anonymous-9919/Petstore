import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1),
  nameAr: z.string().min(1),
  slug: z.string().optional(),
  petType: z.string().min(1),
  image: z.string().nullable().optional(),
  order: z.number().int().default(0),
  active: z.boolean().default(true),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role === "STAFF") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const slug = parsed.data.slug && parsed.data.slug.length > 0 ? slugify(parsed.data.slug) : slugify(parsed.data.name) || `cat-${Date.now()}`;

  let uniqueSlug = slug;
  let n = 1;
  while (await prisma.category.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${slug}-${n++}`;
  }

  const cat = await prisma.category.create({
    data: { ...parsed.data, slug: uniqueSlug },
  });
  return NextResponse.json(cat);
}
