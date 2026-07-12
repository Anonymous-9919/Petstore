"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { formatKWD } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import { t } from "@/lib/translations";
import type { Product } from "@/types";
import type { Locale } from "@/lib/translations";

interface ProductCardProps {
  product: Product;
  locale: Locale;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const { addItem, updateQuantity, getItemQuantity } = useCartStore();
  const [imgError, setImgError] = useState(false);

  const isInStock = "inStock" in product ? product.inStock : (product as any).stock > 0;
  const imageSrc = product.images?.[0] || null;
  const cartQty = getItemQuantity(product.id);

  const savePercent =
    product.onSale && product.originalPrice
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
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

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      image: product.images?.[0],
      slug: product.slug,
    });
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartQty <= 1) {
      updateQuantity(product.id, 0);
    } else {
      updateQuantity(product.id, cartQty - 1);
    }
  };

  return (
    <Link href={`/products/${product.slug}`} className="block group">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
          {imageSrc && !imgError ? (
            <img
              src={imageSrc}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-4xl">
              🐾
            </div>
          )}

          {/* Discount badge - top right like source */}
          {product.onSale && savePercent > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-[11px] font-bold rounded px-1.5 py-0.5">
              -{savePercent}%
            </div>
          )}

          {/* Out of stock overlay */}
          {!isInStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded">
                {t("badge.out-of-stock", locale)}
              </span>
            </div>
          )}
        </div>

        {/* Info - matches source: title (1 line), description (2 lines), price, add-to-cart */}
        <div className="p-2.5 flex flex-col flex-1">
          {/* Title - 1 line clamp like source's cut-text-one-line */}
          <h3 className="text-[13px] font-semibold text-gray-900 line-clamp-1 mb-0.5">
            {locale === "ar" && product.nameAr ? product.nameAr : product.name}
          </h3>

          {/* Description - 2 lines like source's cut-text-two-lines-grid-view */}
          {(product.description || product.descriptionAr) && (
            <p className="text-[11px] text-gray-500 line-clamp-2 mb-1.5 leading-relaxed">
              {locale === "ar" && product.descriptionAr ? product.descriptionAr : product.description}
            </p>
          )}

          <div className="mt-auto">
            {/* Price */}
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-sm font-bold text-[#ff6600]">
                {formatKWD(product.price)}
              </span>
              {product.onSale && product.originalPrice && (
                <span className="text-[10px] text-gray-400 line-through">
                  {formatKWD(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Quantity stepper (like source) or Add to Cart button */}
            {cartQty > 0 ? (
              <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                <button
                  onClick={handleDecrement}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-gray-900">{cartQty}</span>
                <button
                  onClick={handleIncrement}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={!isInStock}
                className="w-full flex items-center justify-center gap-1.5 bg-[#29ac00] hover:bg-[#249000] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-[11px] font-semibold py-1.5 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-3 h-3" />
                {t("product.add-to-cart", locale)}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
