"use client";

import Link from "next/link";
import { useUIStore } from "@/stores/ui-store";
import { useCartStore } from "@/stores/cart-store";
import { UI_STRINGS } from "@/lib/constants";

interface ProductCardProps {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  categorySlug: string;
  variant?: string;
  variantAr?: string;
  price: number;
  photo: string;
}

export function ProductCard({
  id,
  name,
  nameAr,
  slug,
  categorySlug,
  variant,
  variantAr,
  price,
  photo,
}: ProductCardProps) {
  const { language } = useUIStore();
  const { addItem } = useCartStore();
  const isArabic = language === "ar";

  const displayName = isArabic ? nameAr : name;
  const displayVariant = isArabic ? variantAr : variant;
  const displayPrice = price.toFixed(3);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id,
      productId: id,
      name,
      nameAr,
      photo,
      price,
    });
  };

  return (
    <Link
      href={`/product/${categorySlug}/${slug}`}
      className="block w-1/2 px-[7px] pb-5 no-underline"
      style={{ color: "black" }}
    >
      <div
        className="relative rounded-[7px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("${photo}")`,
          height: 240,
          width: "100%",
          backgroundSize: "contain",
        }}
      />
      <div className="w-full">
        <p
          className="cut-text-two-lines mb-0 pl-[3.5px] pt-2 text-left text-sm font-bold text-text-black"
          style={{ height: 40, fontSize: 14, fontWeight: "bold" }}
        >
          {displayName}
        </p>
        {displayVariant && (
          <p
            className="cut-text-two-lines-grid-view pl-[3.5px] text-left text-sm font-light text-text-dark"
            style={{
              fontSize: 14,
              color: "rgb(51, 51, 51)",
              marginTop: 3,
              marginBottom: 3,
              height: 38,
            }}
          >
            {displayVariant}
          </p>
        )}
        {!displayVariant && <div style={{ height: 38 }} />}
        <div className="mb-4 pr-[3.5px] text-right" style={{ fontSize: 14, color: "#ff6600" }}>
          <div style={{ fontWeight: "bold" }}>
            {displayPrice} KD
          </div>
          <div className="mt-2 flex w-full justify-around" style={{ width: "100%" }}>
            <button
              onClick={handleAddToCart}
              className="flex h-[30px] w-[45%] items-center justify-center rounded border border-brand-orange text-[14px] font-bold text-brand-orange"
            >
              {isArabic ? UI_STRINGS.addToCartButtonAr : UI_STRINGS.addToCartButton}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="flex h-[30px] w-[45%] items-center justify-center rounded border border-brand-green bg-brand-green text-[14px] font-bold text-white"
            >
              {isArabic ? UI_STRINGS.buyNowAr : UI_STRINGS.buyNow}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
