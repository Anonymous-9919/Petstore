import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const branches = await prisma.branch.findMany({
    where: { active: true, pickupAvailable: true },
    orderBy: { name: "asc" },
  });
  // Parse phone JSON for each branch
  const result = branches.map((b) => ({
    ...b,
    phone: (() => { try { return JSON.parse(b.phone); } catch { return [b.phone]; } })(),
  }));
  return NextResponse.json(result);
}
