"use client";

import { useCallback } from "react";
import Link from "next/link";
import { t } from "@/lib/translations";
import { useLocale } from "@/lib/locale";
import { useCartStore, useCartSummary } from "@/lib/store";
import { cn, formatKWD } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, PawPrint, ShoppingCart } from "lucide-react";

const DELIVERY_THRESHOLD = 10;

export default function CartDrawer() {
  const { locale } = useLocale();
  const open = useCartStore((s) => s.cartDrawerOpen);
  const setOpen = useCartStore((s) => s.setCartDrawerOpen);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const { subtotal, itemCount, deliveryFee, total } = useCartSummary();
  const isDeliveryFree = subtotal >= DELIVERY_THRESHOLD;

  const handleUpdateQuantity = useCallback(
    (id: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeItem(id);
      } else {
        updateQuantity(id, newQuantity);
      }
    },
    [updateQuantity, removeItem]
  );

  const onClose = useCallback(() => setOpen(false), [setOpen]);

  if (!open) return null;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="cart-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[90] bg-black/50"
        onClick={onClose}
      />

      {/* Desktop: right panel */}
      <motion.div
        key="cart-desktop"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        className="fixed inset-y-0 right-0 w-[420px] z-[95] bg-white shadow-2xl flex flex-col rounded-l-2xl max-md:hidden"
      >
        <CartDrawerContent
          locale={locale}
          items={items}
          subtotal={subtotal}
          itemCount={itemCount}
          deliveryFee={deliveryFee}
          total={total}
          isDeliveryFree={isDeliveryFree}
          onClose={onClose}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={removeItem}
        />
      </motion.div>

      {/* Mobile: slide-up drawer */}
      <motion.div
        key="cart-mobile"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        className="fixed bottom-0 inset-x-0 max-h-[85vh] z-[95] bg-white rounded-t-2xl shadow-2xl flex flex-col md:hidden"
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>
        <CartDrawerContent
          locale={locale}
          items={items}
          subtotal={subtotal}
          itemCount={itemCount}
          deliveryFee={deliveryFee}
          total={total}
          isDeliveryFree={isDeliveryFree}
          onClose={onClose}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={removeItem}
        />
      </motion.div>
    </AnimatePresence>
  );
}

interface CartDrawerContentProps {
  locale: "en" | "ar";
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    color?: string;
  }>;
  subtotal: number;
  itemCount: number;
  deliveryFee: number;
  total: number;
  isDeliveryFree: boolean;
  onClose: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

function CartDrawerContent({
  locale,
  items,
  subtotal,
  itemCount,
  deliveryFee,
  total,
  isDeliveryFree,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerContentProps) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-[#ff6600]" />
          <h2 className="text-lg font-bold text-gray-900">
            {t("cart.title", locale)}
          </h2>
          {itemCount > 0 && (
            <span className="text-xs font-medium text-gray-400">
              ({itemCount} {itemCount === 1 ? t("cart.item", locale) : t("cart.items", locale)})
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 -mr-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          aria-label="Close cart"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
            <div className="p-4 rounded-full bg-gray-50">
              <PawPrint className="w-12 h-12 text-gray-300" />
            </div>
            <div className="text-center">
              <p className="text-base font-medium text-gray-500">
                {t("cart.empty", locale)}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {t("cart.emptyMessage", locale)}
              </p>
            </div>
            <Link
              href="/products"
              onClick={onClose}
              className="px-6 py-2.5 bg-[#ff6600] text-white text-sm font-medium rounded-lg hover:bg-[#e55b00] transition-colors"
            >
              {t("cart.startShopping", locale)}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
              >
                <div className="w-16 h-16 rounded-lg shrink-0 bg-gray-50 overflow-hidden flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <PawPrint
                    className={cn(
                      "w-6 h-6 text-[#ff6600]/40",
                      item.image && "hidden"
                    )}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => onRemoveItem(item.productId)}
                      className="p-1 rounded text-gray-300 hover:text-red-500 transition-colors shrink-0"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-sm font-semibold text-[#ff6600] mt-1">
                    {formatKWD(item.price)}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-0 bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                        className="p-1.5 text-gray-500 hover:bg-gray-50 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                        className="p-1.5 text-gray-500 hover:bg-gray-50 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatKWD(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="shrink-0 border-t border-gray-100 px-5 py-4 space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{t("cart.subtotal", locale)}</span>
              <span className="font-medium text-gray-900">{formatKWD(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{t("cart.delivery", locale)}</span>
              <span className={cn("font-medium", isDeliveryFree ? "text-[#29ac00]" : "text-gray-900")}>
                {isDeliveryFree ? t("cart.free", locale) : formatKWD(deliveryFee)}
              </span>
            </div>
            {!isDeliveryFree && (
              <p className="text-xs text-[#29ac00]">
                {locale === "ar"
                  ? `أضف ${formatKWD(DELIVERY_THRESHOLD - subtotal)} للتوصيل المجاني`
                  : `Add ${formatKWD(DELIVERY_THRESHOLD - subtotal)} for free delivery`}
              </p>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-base font-bold text-gray-900">{t("cart.total", locale)}</span>
              <span className="text-base font-bold text-[#ff6600]">{formatKWD(total)}</span>
            </div>
          </div>

          <Link
            href="/cart"
            onClick={onClose}
            className="flex items-center justify-center w-full py-3 bg-[#ff6600] text-white text-sm font-semibold rounded-xl hover:bg-[#e55b00] transition-colors"
          >
            {t("cart.viewCheckout", locale)}
          </Link>
        </div>
      )}
    </>
  );
}
