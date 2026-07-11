"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Minus, Plus, ShoppingCart, ChevronRight, ShoppingBag, PawPrint } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatKWD } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types";

const petEmoji: Record<string, string> = {
  cats: "🐱", dogs: "🐶", birds: "🐦", fish: "🐟",
  rabbits: "🐰", hamsters: "🐹", reptiles: "🦎", general: "🐾",
};

const petBg: Record<string, string> = {
  cats: "bg-orange-50", dogs: "bg-blue-50", birds: "bg-yellow-50",
  fish: "bg-cyan-50", rabbits: "bg-pink-50", hamsters: "bg-amber-50",
  reptiles: "bg-green-50", general: "bg-gray-50",
};

interface ProductDetailClientProps {
  product: Product;
  related: Product[];
}

export default function ProductDetailClient({ product, related }: ProductDetailClientProps) {
  const router = useRouter();
  const { locale } = useLocale();
  const [quantity, setQuantity] = useState(1);
  const { addItem, getItemQuantity } = useCartStore();
  const cartQty = getItemQuantity(product.id);

  const savePercent =
    product.onSale && product.originalPrice
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

  const addToCart = () => {
    if (!product.inStock) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id, name: product.name, nameAr: product.nameAr,
        price: product.price, image: product.images[0], slug: product.slug,
      });
    }
  };

  const buyNow = () => {
    if (!product.inStock) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id, name: product.name, nameAr: product.nameAr,
        price: product.price, image: product.images[0], slug: product.slug,
      });
    }
    router.push("/cart");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-6 overflow-x-auto no-scrollbar">
        <Link href="/" className="hover:text-primary transition-colors shrink-0">{t("nav.home", locale)}</Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link href="/products" className="hover:text-primary transition-colors shrink-0">{t("nav.shop", locale)}</Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-text shrink-0">{product.category}</span>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-text font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className={`aspect-square ${petBg[product.petType] || "bg-gray-50"} rounded-2xl flex items-center justify-center relative overflow-hidden`}>
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain p-4" loading="eager" />
            ) : (
              <span className="text-8xl">{petEmoji[product.petType] || "🐾"}</span>
            )}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.onSale && <Badge variant="sale">{t("badge.sale", locale)}</Badge>}
              {!product.inStock && (
                <Badge variant="default" className="bg-red-100 text-red-600">
                  {t("badge.out-of-stock", locale)}
                </Badge>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex flex-col">
          <p className="text-sm text-primary font-medium mb-2">{product.category}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-text mb-3">{product.name}</h1>

          <div className="flex items-center gap-1.5 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? "fill-primary text-primary" : "fill-gray-200 text-gray-200"}`} />
            ))}
            <span className="text-sm font-medium text-text">{product.rating}</span>
            <span className="text-sm text-text-muted">({product.reviewCount} {t("product.reviews", locale)})</span>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl font-extrabold text-primary">{formatKWD(product.price)}</span>
            {product.onSale && product.originalPrice && (
              <>
                <span className="text-lg text-text-muted line-through">{formatKWD(product.originalPrice)}</span>
                <span className="inline-flex items-center rounded-full bg-red-100 text-red-600 px-2.5 py-0.5 text-xs font-semibold">
                  {t("product.save", locale)} {savePercent}%
                </span>
              </>
            )}
          </div>

          <p className="text-text-muted text-sm leading-relaxed mb-5">{product.description}</p>

          <div className="mb-5">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${product.inStock ? "bg-success-light text-success" : "bg-error-light text-error"}`}>
              {product.inStock ? t("product.in-stock", locale) : t("product.out-of-stock", locale)}
            </span>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-base font-semibold text-text">{t("product.quantity", locale)}</span>
              <div className="flex items-center rounded-xl border-2 border-border overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3.5 hover:bg-surface transition-colors">
                  <Minus className="w-5 h-5" />
                </button>
                <AnimatePresence mode="wait">
                  <motion.span key={quantity} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 8, opacity: 0 }} transition={{ duration: 0.15 }} className="w-14 text-center font-extrabold text-lg">
                    {quantity}
                  </motion.span>
                </AnimatePresence>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3.5 hover:bg-surface transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {cartQty > 0 ? (
                <motion.div key="in-cart-actions" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-2">
                  <Button size="lg" variant="secondary" className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold" onClick={() => useCartStore.getState().setCartDrawerOpen(true)}>
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                    {t("product.view-cart", locale)} ({cartQty})
                  </Button>
                  <Button size="lg" variant="primary" className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold" onClick={buyNow}>
                    <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                    {t("product.buy-now", locale)}
                  </Button>
                </motion.div>
              ) : (
                <motion.div key="add-actions" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-2">
                  <Button size="lg" variant="secondary" className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold" disabled={!product.inStock} onClick={addToCart}>
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                    {t("product.add-to-cart", locale)}
                  </Button>
                  <Button size="lg" variant="primary" className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold" disabled={!product.inStock} onClick={buyNow}>
                    <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                    {t("product.buy-now", locale)}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-text mb-6">{t("product.related", locale)}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
