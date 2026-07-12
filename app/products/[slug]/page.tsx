import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
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

  const related = await getRelatedProducts(product.categorySlug, product.id, "en");

  return <ProductDetailClient product={product} related={related} />;
}
