import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const branches = await prisma.branch.findMany({
    where: { active: true, pickupAvailable: true },
    orderBy: { name: "asc" },
  });
  const result = branches.map((b) => ({
    id: b.id,
    name: b.name,
    nameAr: b.nameAr,
    address: b.address,
    addressAr: b.addressAr,
    phone: (() => { try { return JSON.parse(b.phone); } catch { return [b.phone]; } })(),
    hours: b.hours,
    hoursAr: b.hoursAr,
    pickupAvailable: b.pickupAvailable,
    active: b.active,
  }));
  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
