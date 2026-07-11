"use client";

import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ShoppingCart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatKWD } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import { t } from "@/lib/translations";
import type { Product } from "@/types";
import type { Locale } from "@/lib/translations";

interface FeaturedCarouselProps {
  products: Product[];
  locale: Locale;
}

export function FeaturedCarousel({ products, locale }: FeaturedCarouselProps) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCartStore();

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 280;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const handleAdd = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      image: product.images[0],
      slug: product.slug,
    });
  };

  const handleBuyNow = (product: Product) => {
    handleAdd(product);
    router.push("/cart");
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 items-stretch"
      >
        {products.map((product) => {
          const savePercent =
            product.onSale && product.originalPrice
              ? Math.round((1 - product.price / product.originalPrice) * 100)
              : 0;

          return (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.02 }}
              className="min-w-[200px] max-w-[250px] flex-shrink-0 flex"
            >
              <div className="rounded-2xl bg-white shadow-md overflow-hidden hover:shadow-lg transition-all flex flex-col w-full h-full">
                <Link href={`/products/${product.slug}`} className="block relative">
                  <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-4xl">🐾</span>
                    )}
                  </div>
                  <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
                    {product.onSale && (
                      <Badge variant="sale">{t("badge.sale", locale)}</Badge>
                    )}
                    {product.featured && (
                      <Badge variant="featured">{t("badge.featured", locale)}</Badge>
                    )}
                  </div>
                  {product.onSale && savePercent > 0 && (
                    <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full px-1.5 py-0.5">
                      -{savePercent}%
                    </div>
                  )}
                </Link>
                <div className="p-3 flex flex-col flex-1">
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between gap-1 mt-auto">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-[#ff6600] text-sm">
                        {formatKWD(product.price)}
                      </span>
                      {product.onSale && product.originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through">
                          {formatKWD(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleAdd(product)}
                        disabled={!product.inStock}
                        className="!p-2 h-8 w-8"
                        aria-label={t("product.add-to-cart", locale)}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleBuyNow(product)}
                        disabled={!product.inStock}
                        className="!p-2 h-8 w-8"
                        aria-label={t("product.buy-now", locale)}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}
