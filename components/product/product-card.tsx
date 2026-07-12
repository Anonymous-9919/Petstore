"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { formatKWD } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import { t } from "@/lib/translations";
import type { Product } from "@/types";
import type { Locale } from "@/lib/translations";

const petEmoji: Record<string, string> = {
  cats: "🐱", dogs: "🐶", birds: "🐦", fish: "🐟",
  rabbits: "🐰", hamsters: "🐹", reptiles: "🦎", general: "🐾",
};

interface ProductCardProps {
  product: Product;
  locale: Locale;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const { addItem } = useCartStore();

  const isInStock = "inStock" in product ? product.inStock : (product as any).stock > 0;
  const imageSrc = product.images?.[0] || "/images/products/placeholder.svg";

  const savePercent =
    product.onSale && product.originalPrice
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      image: product.images?.[0],
      slug: product.slug,
    });
  };

  return (
    <Link href={`/products/${product.slug}`} className="block group">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
          <img
            src={imageSrc}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fb = e.currentTarget.nextElementSibling as HTMLElement | null;
              if (fb) fb.style.display = "flex";
            }}
          />
          <span className="hidden absolute inset-0 items-center justify-center text-5xl" aria-hidden="true">
            {petEmoji[product.petType] ?? "🐾"}
          </span>

          {/* Discount badge */}
          {product.onSale && savePercent > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold rounded-md px-1.5 py-0.5">
              -{savePercent}%
            </div>
          )}

          {/* Out of stock overlay */}
          {!isInStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-sm font-bold text-red-500 bg-red-50 px-3 py-1 rounded-lg">
                {t("badge.out-of-stock", locale)}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col flex-1">
          <h3 className="text-xs font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] leading-snug">
            {locale === "ar" && product.nameAr ? product.nameAr : product.name}
          </h3>

          <div className="mt-auto pt-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#ff6600]">
                {formatKWD(product.price)}
              </span>
              {product.onSale && product.originalPrice && (
                <span className="text-[10px] text-gray-400 line-through">
                  {formatKWD(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Add to cart button */}
            <button
              onClick={addToCart}
              disabled={!isInStock}
              className="mt-2 w-full flex items-center justify-center gap-1.5 bg-[#29ac00] hover:bg-[#249000] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-semibold py-2 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {t("product.add-to-cart", locale)}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
