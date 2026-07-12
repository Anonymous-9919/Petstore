"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, ChevronLeft, ChevronRight, ArrowLeft, Send } from "lucide-react";
import { formatKWD } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types";

interface ProductDetailClientProps {
  product: Product;
  related: Product[];
}

export default function ProductDetailClient({ product, related }: ProductDetailClientProps) {
  const router = useRouter();
  const { locale } = useLocale();
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const { addItem, getItemQuantity } = useCartStore();
  const cartQty = getItemQuantity(product.id);
  const scrollRef = useRef<HTMLDivElement>(null);

  const images = product.images?.length > 0 ? product.images : ["/images/products/placeholder.svg"];
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

  const scrollImages = (dir: number) => {
    if (!scrollRef.current) return;
    const newIdx = Math.max(0, Math.min(images.length - 1, currentImage + dir));
    setCurrentImage(newIdx);
    scrollRef.current.scrollTo({ left: newIdx * scrollRef.current.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="pb-20 md:pb-0">
      {/* Fixed Detail Header like source site */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 md:hidden">
        <div className="flex items-center h-[48px] px-3">
          <button onClick={() => router.back()} className="p-1.5 -ml-1 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="flex-1 text-center text-sm font-medium text-gray-900 truncate px-3">
            {locale === "ar" && product.nameAr ? product.nameAr : product.name}
          </h1>
          <button onClick={() => { navigator.share?.({ title: product.name, url: window.location.href }).catch(() => {}); }}
            className="p-1.5 rounded-lg hover:bg-gray-100">
            <Send className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Image Carousel - like source site */}
      <div className="relative bg-white">
        <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide" style={{ scrollSnapType: "x mandatory" }}>
          {images.map((img, i) => (
            <div key={i} className="shrink-0 w-full snap-center aspect-square bg-white flex items-center justify-center">
              <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-contain p-4" loading={i === 0 ? "eager" : "lazy"} />
            </div>
          ))}
        </div>

        {/* Discount badge */}
        {product.onSale && savePercent > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold rounded px-2 py-1">
            -{savePercent}%
          </div>
        )}

        {/* Out of stock */}
        {!product.inStock && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold rounded px-2 py-1">
            {t("badge.out-of-stock", locale)}
          </div>
        )}

        {/* Image navigation arrows */}
        {images.length > 1 && (
          <>
            <button onClick={() => scrollImages(-1)} disabled={currentImage === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow disabled:opacity-30">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scrollImages(1)} disabled={currentImage === images.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow disabled:opacity-30">
              <ChevronRight className="w-5 h-5" />
            </button>
            {/* Dots indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === currentImage ? "bg-[#ff6600]" : "bg-gray-300"}`} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Product Info */}
      <div className="bg-white px-4 py-4 border-t border-gray-100">
        {/* Category */}
        <p className="text-xs text-[#ff6600] font-medium mb-1">{product.category}</p>

        {/* Name */}
        <h1 className="text-lg font-bold text-gray-900 mb-2">
          {locale === "ar" && product.nameAr ? product.nameAr : product.name}
        </h1>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-[#ff6600]">{formatKWD(product.price)}</span>
          {product.onSale && product.originalPrice && (
            <>
              <span className="text-sm text-gray-400 line-through">{formatKWD(product.originalPrice)}</span>
              <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded">
                {t("product.save", locale)} {savePercent}%
              </span>
            </>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {locale === "ar" && product.descriptionAr ? product.descriptionAr : product.description}
          </p>
        )}

        {/* Stock status */}
        <div className="mb-4">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded ${product.inStock ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
            {product.inStock ? t("product.in-stock", locale) : t("product.out-of-stock", locale)}
          </span>
        </div>

        {/* Quantity + Buttons - like source site */}
        <div className="flex items-center gap-3 mb-4">
          {/* Quantity stepper */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2.5 text-gray-600 hover:bg-gray-50 transition-colors">
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center text-sm font-bold text-gray-900">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2.5 text-gray-600 hover:bg-gray-50 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart - always visible */}
          <button onClick={addToCart} disabled={!product.inStock}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#29ac00] text-white text-sm font-semibold rounded-lg hover:bg-[#249000] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
            <ShoppingCart className="w-4 h-4" />
            {t("product.add-to-cart", locale)}
          </button>
        </div>

        {/* In-cart indicator */}
        {cartQty > 0 && (
          <button onClick={() => useCartStore.getState().setCartDrawerOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2 mb-4 text-sm text-[#29ac00] font-medium hover:underline">
            <ShoppingCart className="w-4 h-4" />
            {t("product.view-cart", locale)} ({cartQty})
          </button>
        )}

        {/* Buy Now */}
        <button onClick={buyNow} disabled={!product.inStock}
          className="w-full py-3 bg-[#ff6600] text-white text-sm font-semibold rounded-lg hover:bg-[#e55b00] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
          {t("product.buy-now", locale)}
        </button>
      </div>

      {/* Related Products — horizontal scroll like source */}
      {related.length > 0 && (
        <div className="pt-5 pb-4">
          <h2 className="text-sm font-bold text-gray-900 mb-3 px-4">{t("product.related", locale)}</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2">
            {related.map((p) => (
              <div key={p.id} className="shrink-0 w-[150px]">
                <ProductCard product={p} locale={locale as any} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
