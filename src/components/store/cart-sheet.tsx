"use client";

import Image from "next/image";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { useCartStore } from "@/stores/cart-store";
import { UI_STRINGS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

export function CartSheet() {
  const { cartSheetOpen, setCartSheetOpen, language } = useUIStore();
  const { items, updateQuantity, removeItem, getTotal, getItemCount } =
    useCartStore();
  const isArabic = language === "ar";

  if (!cartSheetOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[2000] bg-black/50"
        onClick={() => setCartSheetOpen(false)}
      />
      <div
        className={`fixed bottom-0 z-[2001] max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-white animate-slide-in-up ${
          isArabic ? "left-0" : "right-0"
        }`}
        style={{ maxWidth: 480, margin: "0 auto" }}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-store-border bg-white px-4 py-3">
          <h2 className="text-base font-bold text-text-primary">
            {isArabic ? "سلة المشتريات" : "Shopping Cart"}
          </h2>
          <button onClick={() => setCartSheetOpen(false)}>
            <X className="h-5 w-5 text-text-primary" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-sm text-text-secondary">
              {isArabic ? "السلة فارغة" : "Your cart is empty"}
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-store-border">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 p-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={item.photo}
                      alt={isArabic ? item.nameAr : item.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-sm font-bold text-text-black">
                        {isArabic ? item.nameAr : item.name}
                      </p>
                      <p className="text-sm font-bold text-brand-orange">
                        {formatPrice(item.price)} KD
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="flex h-7 w-7 items-center justify-center rounded border border-store-border"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-[20px] text-center text-sm font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="flex h-7 w-7 items-center justify-center rounded border border-store-border"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto"
                      >
                        <Trash2 className="h-4 w-4 text-text-muted" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 border-t border-store-border bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-text-secondary">
                  {getItemCount()}{" "}
                  {isArabic ? "منتجات" : "items"} •{" "}
                  {isArabic ? "المجموع" : "Total"}
                </span>
                <span className="text-base font-bold text-brand-orange">
                  {formatPrice(getTotal())} KD
                </span>
              </div>
              <button className="w-full rounded-lg bg-brand-orange py-3 text-sm font-bold text-white shadow-btn transition-colors hover:bg-brand-orange-hover">
                {isArabic
                  ? UI_STRINGS.reviewOrderAr
                  : UI_STRINGS.reviewOrder}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
