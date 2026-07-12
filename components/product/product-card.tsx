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
        className="bg-white overflow-hidden relative"
        style={{
          borderRadius: 7,
          minHeight: 240,
          cursor: "pointer",
        }}
      >
        {/* Image */}
        <div
          className="relative flex items-center justify-center overflow-hidden"
          style={{ maxHeight: 240, minHeight: 240, borderRadius: 7 }}
        >
          {imageSrc && !imgError ? (
            <img
              src={imageSrc}
              alt={isEnglish ? product.name : (product.nameAr || product.name)}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain preventDrag"
              style={{ borderRadius: 7 }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-4xl" style={{ minHeight: 240 }}>
              🐾
            </div>
          )}

          {/* Discount badge — matching source: padding:1px 5px, borderRadius:3, fontSize:16px, top:8px */}
          {product.onSale && savePercent > 0 && (
            <div
              className="discount-sign"
              style={{
                right: isEnglish ? 10 : undefined,
                left: isEnglish ? undefined : 10,
                direction: "ltr",
                zIndex: 100,
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

        {/* Product Name — 14px, bold, height 40px */}
        <p
          className="text-black"
          style={{
            fontSize: 14,
            fontWeight: "bold",
            height: 40,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            padding: "8px 15px 0",
            textDecoration: isInStock ? "none" : "line-through",
            fontFamily: isEnglish ? "Quicksand" : "Cairo",
            textAlign: isEnglish ? "left" : "right",
            direction: isEnglish ? "ltr" : "rtl",
          }}
        >
          {isEnglish ? product.name : (product.nameAr || product.name)}
        </p>

        {/* Price — 14px, bold, theme color */}
        <div
          style={{
            padding: "0 15px",
            fontSize: 14,
            fontWeight: "bold",
            color: "#ff6600",
            direction: isEnglish ? "ltr" : "rtl",
            textAlign: isEnglish ? "left" : "right",
          }}
        >
          {product.onSale && product.originalPrice ? (
            <span style={{ position: "relative" }}>
              <span style={{ textDecoration: "line-through", fontSize: 11, position: "absolute", top: -15, left: 6, color: "#999" }}>
                {formatKWD(product.originalPrice)}
              </span>
              <br />
              {formatKWD(product.price)}
            </span>
          ) : (
            formatKWD(product.price)
          )}
        </div>

        {/* Add to Cart / Quantity Controls */}
        <div style={{ padding: "8px 15px 12px" }}>
          {cartQty > 0 ? (
            <div
              className="flex items-center justify-between mx-auto"
              style={{
                width: 125,
                backgroundColor: "white",
                height: 30,
                border: "1px solid #DEDEDE",
                borderRadius: 50,
              }}
            >
              <button
                onClick={handleDecrement}
                className="flex items-center justify-center"
                style={{ width: 30 }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff6600" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <span
                style={{
                  color: "#ff6600",
                  border: "1px solid #DEDEDE",
                  width: 60,
                  padding: "2px 0",
                  textAlign: "center",
                  fontSize: 14,
                  borderTop: 0,
                  borderBottom: 0,
                }}
              >
                {cartQty}
              </span>
              <button
                onClick={handleIncrement}
                className="flex items-center justify-center"
                style={{ width: 30 }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff6600" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className="w-full flex items-center justify-center gap-1 disabled:cursor-not-allowed"
              style={{
                height: 30,
                fontWeight: "bold",
                border: isInStock ? "1px solid #29ac00" : "1px solid #ccc",
                borderRadius: 3,
                textTransform: "none",
                fontSize: 14,
                backgroundColor: isInStock ? "#29ac00" : "#ccc",
                color: "white",
                fontFamily: "Quicksand, Cairo, sans-serif",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
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
