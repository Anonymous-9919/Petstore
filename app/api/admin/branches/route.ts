import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const branchSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  nameAr: z.string().min(1),
  address: z.string().min(1),
  addressAr: z.string().min(1),
  phone: z.array(z.string()).min(1),
  hours: z.string().min(1),
  hoursAr: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
  active: z.boolean().default(true),
  deliveryAvailable: z.boolean().default(true),
  pickupAvailable: z.boolean().default(true),
});

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 50);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role === "STAFF") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = branchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  let id = parsed.data.id || slugify(parsed.data.name) || `branch-${Date.now()}`;
  let n = 1;
  while (await prisma.branch.findUnique({ where: { id } })) {
    id = `${parsed.data.id || slugify(parsed.data.name)}-${n++}`;
  }

  const branch = await prisma.branch.create({
    data: {
      id,
      name: parsed.data.name,
      nameAr: parsed.data.nameAr,
      address: parsed.data.address,
      addressAr: parsed.data.addressAr,
      phone: parsed.data.phone.join(", "),
      hours: parsed.data.hours,
      hoursAr: parsed.data.hoursAr,
      lat: parsed.data.lat,
      lng: parsed.data.lng,
      active: parsed.data.active,
      deliveryAvailable: parsed.data.deliveryAvailable,
      pickupAvailable: parsed.data.pickupAvailable,
    },
  });
  return NextResponse.json(branch);
}
