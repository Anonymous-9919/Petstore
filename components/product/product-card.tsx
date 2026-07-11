"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Minus, Plus, ShoppingCart, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatKWD } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import { t } from "@/lib/translations";
import type { Product } from "@/types";
import type { Locale } from "@/lib/translations";

const petEmoji: Record<string, string> = {
  cats: "🐱",
  dogs: "🐶",
  birds: "🐦",
  fish: "🐟",
  rabbits: "🐰",
  hamsters: "🐹",
  reptiles: "🦎",
  general: "🐾",
};

const petBg: Record<string, string> = {
  cats: "bg-orange-50",
  dogs: "bg-blue-50",
  birds: "bg-yellow-50",
  fish: "bg-cyan-50",
  rabbits: "bg-pink-50",
  hamsters: "bg-amber-50",
  reptiles: "bg-green-50",
  general: "bg-gray-50",
};

interface ProductCardProps {
  product: Product;
  locale: Locale;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const router = useRouter();
  const { addItem, updateQuantity, getItemQuantity } = useCartStore();
  const cartQty = getItemQuantity(product.id);

  const isInStock = "inStock" in product ? product.inStock : (product as any).stock > 0;

  const isNew =
    new Date(product.createdAt) >
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const savePercent =
    product.onSale && product.originalPrice
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

  const imageSrc = product.images?.[0] || "/images/products/placeholder.svg";

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      image: product.images[0],
      slug: product.slug,
    });
  };

  const buyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      image: product.images[0],
      slug: product.slug,
    });
    router.push("/cart");
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card className="group relative h-full flex flex-col overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block">
          <div
            className={`relative aspect-square ${
              petBg[product.petType] || "bg-gray-50"
            } flex items-center justify-center overflow-hidden`}
          >
            <img
              src={imageSrc}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const t = e.currentTarget;
                t.style.display = "none";
                const fallback = t.nextElementSibling as HTMLElement | null;
                if (fallback) fallback.style.display = "flex";
              }}
            />
            <span
              className="hidden absolute inset-0 items-center justify-center text-4xl sm:text-5xl"
              aria-hidden="true"
            >
              {petEmoji[product.petType] ?? "🐾"}
            </span>

            {/* Badges — top left, stacked, never overlapping content */}
            <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
              {product.onSale && (
                <Badge variant="sale" className="text-[10px] sm:text-xs px-1.5 py-0.5">
                  {t("badge.sale", locale)}
                </Badge>
              )}
              {product.featured && (
                <Badge variant="featured" className="text-[10px] sm:text-xs px-1.5 py-0.5">
                  {t("badge.featured", locale)}
                </Badge>
              )}
              {isNew && (
                <Badge variant="new" className="text-[10px] sm:text-xs px-1.5 py-0.5">
                  {t("badge.new", locale)}
                </Badge>
              )}
            </div>

            {/* Discount % — top right */}
            {product.onSale && savePercent > 0 && (
              <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full px-1.5 py-0.5">
                -{savePercent}%
              </div>
            )}
          </div>
        </Link>

        <CardBody className="flex flex-col flex-1 p-2.5 sm:p-3 gap-1.5">
          <Link href={`/products/${product.slug}`} className="block min-h-0">
            <p className="text-[10px] sm:text-xs text-[#ff6600] font-medium truncate">
              {locale === "ar" && product.categoryAr ? product.categoryAr : product.category}
            </p>
            <h3 className="font-semibold text-gray-900 text-xs sm:text-sm leading-snug line-clamp-2 min-h-[2.5rem] sm:min-h-[2.75rem]">
              {locale === "ar" && product.nameAr ? product.nameAr : product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                  i < Math.round(product.rating)
                    ? "fill-[#ff6600] text-[#ff6600]"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
            <span className="text-[10px] sm:text-xs text-gray-400 ml-0.5">
              ({product.reviewCount})
            </span>
          </div>

          <div className="mt-auto pt-1.5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-[#ff6600] text-sm sm:text-base truncate">
                  {formatKWD(product.price)}
                </span>
                {product.onSale && product.originalPrice ? (
                  <span className="text-[10px] sm:text-xs text-gray-400 line-through truncate">
                    {formatKWD(product.originalPrice)}
                  </span>
                ) : null}
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {cartQty > 0 ? (
                  <motion.div
                    key="stepper"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center rounded-xl bg-[#ff6600] text-white shrink-0"
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        updateQuantity(product.id, cartQty - 1);
                      }}
                      className="p-2 sm:p-2.5 hover:bg-[#e65c00] rounded-l-xl transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <span className="w-7 sm:w-9 text-center font-extrabold text-sm sm:text-base">
                      {cartQty}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        updateQuantity(product.id, cartQty + 1);
                      }}
                      className="p-2 sm:p-2.5 hover:bg-[#e65c00] rounded-r-xl transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {cartQty === 0 && (
              <div className="flex gap-1.5">
                <Button
                  variant="secondary"
                  onClick={addToCart}
                  disabled={!isInStock}
                  className="flex-1 h-9 sm:h-10 px-2 text-xs sm:text-sm font-bold rounded-xl"
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                  {t("product.add-to-cart", locale)}
                </Button>
                <Button
                  variant="primary"
                  onClick={buyNow}
                  disabled={!isInStock}
                  className="flex-1 h-9 sm:h-10 px-2 text-xs sm:text-sm font-bold rounded-xl"
                >
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                  {t("product.buy-now", locale)}
                </Button>
              </div>
            )}

            {cartQty > 0 && (
              <Button
                variant="primary"
                onClick={buyNow}
                disabled={!isInStock}
                className="w-full h-9 sm:h-10 text-xs sm:text-sm font-bold rounded-xl"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                {t("product.buy-now", locale)}
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
