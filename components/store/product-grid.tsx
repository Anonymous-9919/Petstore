"use client";

import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} locale="en" />
      ))}
    </div>
  );
}
