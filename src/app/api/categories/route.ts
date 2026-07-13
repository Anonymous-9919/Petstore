import { NextResponse } from "next/server";
import { MOCK_CATEGORIES } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parentOnly = searchParams.get("parentOnly") === "true";

  let categories = MOCK_CATEGORIES.filter((c) => c.isActive);

  if (parentOnly) {
    categories = categories.filter((c) => c.parentId === null);
  }

  return NextResponse.json({
    success: true,
    data: categories,
    total: categories.length,
  });
}
