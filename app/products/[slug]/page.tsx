import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/products";
import ProductDetailClient from "./client";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug, "en");

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts("en");
  const related = allProducts
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  return <ProductDetailClient product={product} related={related} />;
}
