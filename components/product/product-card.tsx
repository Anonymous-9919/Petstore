"use client";

import { memo, useState, useCallback } from "react";
import Link from "next/link";
import { formatKWD } from "@/lib/utils";
import { useCartStore, useCartItemQuantity } from "@/lib/store";
import { t } from "@/lib/translations";
import type { Product } from "@/types";
import type { Locale } from "@/lib/translations";

interface ProductCardProps {
  product: Product;
  locale: Locale;
}

export const ProductCard = memo(function ProductCard({ product, locale }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const cartQty = useCartItemQuantity(product.id);
  const [imgError, setImgError] = useState(false);

  const isInStock = product.inStock;
  const imageSrc = product.images?.[0] || null;
  const isEnglish = locale === "en";

  const savePercent =
    product.onSale && product.originalPrice
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
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
  }, [product, isInStock, addItem]);

  const handleIncrement = useCallback((e: React.MouseEvent) => {
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
  }, [product, addItem]);

  const handleDecrement = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartQty <= 1) {
      updateQuantity(product.id, 0);
    } else {
      updateQuantity(product.id, cartQty - 1);
    }
  }, [product.id, cartQty, updateQuantity]);

  return (
    <Link href={`/products/${product.slug}`} className="block group" prefetch>
      <div
        className="bg-white overflow-hidden relative border border-gray-200 hover:shadow-lg transition-shadow"
        style={{
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        {/* Image */}
        <div
          className="relative flex items-center justify-center overflow-hidden bg-gray-50"
          style={{ height: 200 }}
        >
          {imageSrc && !imgError ? (
            <img
              src={imageSrc}
              alt={isEnglish ? product.name : (product.nameAr || product.name)}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain p-2 preventDrag"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-4xl">
              🐾
            </div>
          )}

          {/* Discount badge */}
          {product.onSale && savePercent > 0 && (
            <div
              className="absolute top-2 bg-red-500 text-white text-xs font-bold rounded px-2 py-1"
              style={{
                right: isEnglish ? 8 : undefined,
                left: isEnglish ? undefined : 8,
              }}
            >
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

        {/* Content */}
        <div className="p-3">
          {/* Product Name */}
          <h3
            className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2"
            style={{
              minHeight: 40,
              fontFamily: isEnglish ? "Quicksand, sans-serif" : "Cairo, sans-serif",
            }}
          >
            {isEnglish ? product.name : (product.nameAr || product.name)}
          </h3>

          {/* Price */}
          <div className="mb-3">
            {product.onSale && product.originalPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[#ff6600]">
                  {formatKWD(product.price)}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  {formatKWD(product.originalPrice)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-[#ff6600]">
                {formatKWD(product.price)}
              </span>
            )}
          </div>

          {/* Add to Cart / Quantity Controls */}
          {cartQty > 0 ? (
            <div
              className="flex items-center justify-between mx-auto"
              style={{
                width: 120,
                backgroundColor: "white",
                height: 32,
                border: "1px solid #DEDEDE",
                borderRadius: 16,
              }}
            >
              <button
                onClick={handleDecrement}
                className="flex items-center justify-center flex-1 h-full hover:bg-gray-50 rounded-l-full"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff6600" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <span className="text-sm font-semibold text-[#ff6600] min-w-[30px] text-center">
                {cartQty}
              </span>
              <button
                onClick={handleIncrement}
                className="flex items-center justify-center flex-1 h-full hover:bg-gray-50 rounded-r-full"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff6600" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className="w-full flex items-center justify-center gap-2 disabled:cursor-not-allowed transition-colors"
              style={{
                height: 36,
                fontWeight: "bold",
                border: "none",
                borderRadius: 6,
                fontSize: 13,
                backgroundColor: isInStock ? "#29ac00" : "#ccc",
                color: "white",
                fontFamily: "Quicksand, Cairo, sans-serif",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {t("product.add-to-cart", locale)}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}, (prev, next) =>
  prev.product.id === next.product.id &&
  prev.locale === next.locale &&
  prev.product.price === next.product.price &&
  prev.product.onSale === next.product.onSale &&
  prev.product.inStock === next.product.inStock &&
  prev.product.images?.[0] === next.product.images?.[0]
);
