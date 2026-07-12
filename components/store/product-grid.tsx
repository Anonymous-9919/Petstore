"use client";

import { useLocale } from "@/lib/locale";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types";

export function ProductGrid({ products }: { products: Product[] }) {
  const { locale } = useLocale();
  return (
    <div className="grid grid-cols-2 gap-2">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} locale={locale} />
      ))}
    </div>
  );
}
