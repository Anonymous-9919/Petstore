import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { scryptSync, randomBytes } from "node:crypto";
import { z } from "zod";

const staffSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["OWNER", "MANAGER", "STAFF"]).default("STAFF"),
});

function hash(pw: string) {
  const salt = randomBytes(16).toString("hex");
  return `scrypt$${salt}$${scryptSync(pw, salt, 64).toString("hex")}`;
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session as { role?: string }).role !== "OWNER") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = staffSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const exists = await prisma.adminUser.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (exists) return NextResponse.json({ error: "Email already exists" }, { status: 409 });

  const user = await prisma.adminUser.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      passwordHash: hash(parsed.data.password),
      role: parsed.data.role,
    },
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json(user);
}
