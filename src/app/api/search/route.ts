import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (!q.trim()) {
    return NextResponse.json({
      success: true,
      data: [],
      total: 0,
    });
  }

  const results = searchProducts(q);

  return NextResponse.json({
    success: true,
    data: results,
    total: results.length,
    query: q,
  });
}
