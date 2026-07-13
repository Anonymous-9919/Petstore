import { NextResponse } from "next/server";
import { getProductsByCategory, getAllProducts, searchProducts } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const sort = searchParams.get("sort") || "name";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  let products = category ? getProductsByCategory(category) : getAllProducts();

  if (q) {
    products = searchProducts(q);
  }

  if (sort === "price_asc") {
    products = [...products].sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    products = [...products].sort((a, b) => b.price - a.price);
  } else {
    products = [...products].sort((a, b) => a.name.localeCompare(b.name));
  }

  const total = products.length;
  const start = (page - 1) * limit;
  const paged = products.slice(start, start + limit);

  return NextResponse.json({
    success: true,
    data: paged,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}
