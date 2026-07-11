import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: [{ petType: "asc" }, { name: "asc" }],
  });
  // Add product count per category
  const counts = await prisma.product.groupBy({
    by: ["categoryId"],
    _count: { _all: true },
    where: { active: true },
  });
  const countMap = new Map(counts.map((c) => [c.categoryId, c._count._all]));
  return NextResponse.json(
    categories.map((c) => ({ ...c, count: countMap.get(c.id) || 0 }))
  );
}
