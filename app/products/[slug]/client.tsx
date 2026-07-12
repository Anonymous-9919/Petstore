"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
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
  const isEnglish = locale === "en";
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

  const addToCart = useCallback(() => {
    if (!product.inStock) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id, name: product.name, nameAr: product.nameAr,
        price: product.price, image: product.images[0], slug: product.slug,
      });
    }
  }, [product, quantity, addItem]);

  const buyNow = useCallback(() => {
    if (!product.inStock) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id, name: product.name, nameAr: product.nameAr,
        price: product.price, image: product.images[0], slug: product.slug,
      });
    }
    router.push("/cart");
  }, [product, quantity, addItem, router]);

  const scrollImages = (dir: number) => {
    if (!scrollRef.current) return;
    const newIdx = Math.max(0, Math.min(images.length - 1, currentImage + dir));
    setCurrentImage(newIdx);
    scrollRef.current.scrollTo({ left: newIdx * scrollRef.current.clientWidth, behavior: "smooth" });
  };

  // Sync current image with scroll position
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setCurrentImage(idx);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh" }} className="noselect">
      {/* Fixed Detail Header — matching source: 60px, fixed, z-1000, white, border-bottom */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-[1000] bg-white border-b"
        style={{ height: 60, borderColor: "#dee2e6" }}
      >
        <div className="flex items-center h-[60px] px-3">
          <button onClick={() => router.back()} className="p-1 -ml-1 rounded hover:bg-gray-100">
            <ChevronLeft className="w-6 h-6 text-black" />
          </button>
          <div className="absolute left-0 right-0 text-center" style={{ width: "100%", left: 15 }}>
            <p className="text-center font-semibold truncate mx-auto px-10" style={{ fontWeight: 600, fontSize: 17, maxHeight: 54, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
              {isEnglish ? product.name : (product.nameAr || product.name)}
            </p>
          </div>
          <div className="ml-auto" />
        </div>
      </div>

      {/* Spacer for fixed header on mobile */}
      <div className="md:hidden" style={{ height: 60 }} />

      {/* Image Carousel — auto-height, swipeable, matching source */}
      <div className="relative bg-white">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {images.map((img, i) => (
            <div
              key={i}
              className="shrink-0 w-full snap-center bg-white flex items-center justify-center"
              style={{ minHeight: 230, maxHeight: 550 }}
            >
              <img
                src={img}
                alt={`${product.name} ${i + 1}`}
                className="w-full h-full object-contain preventDrag"
                style={{ backgroundColor: "white" }}
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        {/* Discount badge — matching source: top:8px, padding:1px 5px, borderRadius:3 */}
        {product.onSale && savePercent > 0 && (
          <div
            className="discount-sign"
            style={{ right: 10, color: "#fff", fontWeight: "bold", padding: "1px 5px", borderRadius: 3, textAlign: "center", fontSize: 16, top: 8, position: "absolute" as const }}
          >
            -{savePercent}%
          </div>
        )}

        {/* Image navigation arrows */}
        {images.length > 1 && (
          <>
            <button onClick={() => scrollImages(-1)} disabled={currentImage === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow disabled:opacity-30 z-10">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scrollImages(1)} disabled={currentImage === images.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow disabled:opacity-30 z-10">
              <ChevronRight className="w-5 h-5" />
            </button>
            {/* Dot indicators — max 6, matching source */}
            {images.length <= 6 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === currentImage ? "bg-[#ff6600]" : "bg-gray-300"}`} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Name + Price + Quantity (top) — matching source layout */}
      <div className="bg-white border-t border-b" style={{ borderColor: "#dee2e6", lineHeight: "30px", minHeight: 45 }}>
        <div style={{ marginTop: 5 }}>
          {/* Product Name */}
          <span
            className={`cut-text-one-line-product-name ${isEnglish ? "mx-3 text-left" : "text-right"}`}
            style={{ direction: isEnglish ? "ltr" : "rtl", width: "97%", fontWeight: "bold", display: "-webkit-box", WebkitBoxOrient: "vertical" as any, overflow: "hidden", textOverflow: "ellipsis", WebkitLineClamp: 1 }}
          >
            {isEnglish ? product.name : (product.nameAr || product.name)}
          </span>

          {/* Price + Quantity row */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: -7, flexDirection: isEnglish ? "row" : "row-reverse" }}>
            {/* Price */}
            <div>
              <div className={`mt-3 ${isEnglish ? "float-right" : "float-left"}`} style={{ width: 150, height: 30 }}>
                <span
                  className={`${isEnglish ? "float-left ml-3" : "float-right mr-3"}`}
                  style={{ fontWeight: "bold", color: "#ff6600", fontSize: 20, whiteSpace: "nowrap" }}
                >
                  {product.onSale && product.originalPrice ? (
                    <>
                      <span style={{ textDecoration: "line-through", fontSize: 11, position: "relative", top: -15, left: 6, color: "#999" }}>
                        {formatKWD(product.originalPrice)}
                      </span>
                      <br />
                      {formatKWD(product.price)}
                    </>
                  ) : (
                    formatKWD(product.price)
                  )}
                </span>
              </div>
            </div>

            {/* Quantity Stepper (top) — pill shape, matching source */}
            <div>
              {product.inStock && (
                <div
                  className={`mx-3 ${isEnglish ? "float-right" : "float-left"}`}
                  style={{
                    width: 125,
                    backgroundColor: "white",
                    height: "55%",
                    border: "1px solid #DEDEDE",
                    borderRadius: 50,
                    display: "flex",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                  }}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ textAlign: "center", width: 30 }}
                  >
                    <Minus style={{ color: "#ff6600", fontSize: 15, width: 15, height: 15 }} />
                  </button>
                  <div
                    style={{
                      color: "#ff6600",
                      border: "1px solid #DEDEDE",
                      width: 60,
                      padding: "2px 0",
                      margin: 0,
                      overflow: "hidden",
                      borderTop: 0,
                      borderBottom: 0,
                      textAlign: "center",
                      fontSize: 14,
                    }}
                  >
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ textAlign: "center", width: 30 }}
                  >
                    <Plus style={{ color: "#ff6600", fontSize: 15, width: 15, height: 15 }} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description Section — matching source */}
      {product.description && (
        <div className="mt-4 mx-3" style={{ fontWeight: "bold" }}>
          <div className={`${isEnglish ? "text-left" : "text-right"}`}>
            {isEnglish ? "Description" : "الوصف"}
          </div>
          <div className="mt-1 border" style={{ backgroundColor: "white" }}>
            <div
              className={`mx-3 my-3 ${isEnglish ? "text-left" : "text-right"}`}
              style={{ direction: isEnglish ? "ltr" : "rtl" }}
            >
              {isEnglish ? product.description : (product.descriptionAr || product.description)}
            </div>
          </div>
        </div>
      )}

      {/* Stock Status */}
      {!product.inStock && (
        <div className="mx-3 mt-4 p-3 bg-red-50 rounded text-center">
          <span className="text-sm font-bold text-red-600">
            {t("badge.out-of-stock", locale)}
          </span>
        </div>
      )}

      {/* Recommended Products — horizontal scroll, matching source */}
      {related.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <p className="bold mb-2 box-title" style={{ padding: "0 10px", textAlign: isEnglish ? "left" : "right", fontWeight: "bold", color: "#5b5b5b", fontSize: "1rem" }}>
            {isEnglish ? "You might also like" : "قد يعجبك ايضًا"}
          </p>
          <div className={`flex items-center w-full border ${isEnglish ? "" : "flex-row-reverse"}`} style={{ background: "white", padding: "20px 5px" }}>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide px-2" style={{ width: "100%" }}>
              {related.map((p) => (
                <div key={p.id} className="shrink-0" style={{ width: 150 }}>
                  <ProductCard product={p} locale={locale as any} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Free space for bottom bar */}
      <div style={{ height: 80 }} />

      {/* Bottom Fixed Action Bar — matching source: position:fixed, bottom:0, white bg, height:60 */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white flex items-center ${isEnglish ? "" : "flex-row-reverse"}`}
        style={{
          paddingBottom: 8,
          marginBottom: 0,
          height: 60,
          zIndex: 10,
          alignItems: "center",
          direction: isEnglish ? "ltr" : "rtl",
        }}
      >
        {/* Add to Cart — primary, 50% width */}
        <button
          onClick={addToCart}
          disabled={!product.inStock}
          className="flex-1 flex items-center justify-center h-full mx-1"
          style={{
            boxShadow: "none",
            textTransform: "none",
            backgroundColor: product.inStock ? "#ff6600" : "#9c9c9c",
            color: "white",
            fontWeight: "bold",
            fontSize: "1rem",
            border: "none",
            borderRadius: 4,
            cursor: product.inStock ? "pointer" : "not-allowed",
          }}
        >
          {cartQty > 0 && (
            <span className="px-1" style={{
              position: "absolute",
              left: isEnglish ? 10 : undefined,
              right: isEnglish ? undefined : 10,
              top: 6,
              lineHeight: "34px",
              background: "rgba(0, 0, 0, 0.3)",
              borderRadius: 7,
              minWidth: 32,
              height: 32,
              fontSize: "1rem",
            }}>
              {cartQty}
            </span>
          )}
          <ShoppingCart className="w-5 h-5 mr-2" />
          {t("product.add-to-cart", locale)}
        </button>

        {/* Buy Now — green, 50% width */}
        <button
          onClick={buyNow}
          disabled={!product.inStock}
          className="flex-1 flex items-center justify-center h-full mx-1"
          style={{
            boxShadow: "none",
            textTransform: "none",
            backgroundColor: product.inStock ? "#2ecc71" : "#9c9c9c",
            color: "white",
            border: "none",
            borderRadius: 4,
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: product.inStock ? "pointer" : "not-allowed",
          }}
        >
          {isEnglish ? "Buy now" : "اشترِ الان"}
        </button>
      </div>
    </div>
  );
}
